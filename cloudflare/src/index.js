const GOOGLE_JWKS = "https://www.googleapis.com/oauth2/v3/certs";

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", ...headers },
});

function corsHeaders(request, env) {
  const origin = request.headers.get("origin");
  const allowed = ["http://localhost:3000"];
  return origin && allowed.includes(origin) ? {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
    "access-control-allow-headers": "authorization,content-type",
    "access-control-max-age": "86400",
    "vary": "Origin",
  } : {};
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

async function verifyGoogleToken(request, env) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Missing or invalid ID token");

  const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1])));
  if (header.alg !== "RS256") throw new Error("Unsupported token algorithm");

  const jwksResponse = await fetch(GOOGLE_JWKS, { cf: { cacheTtl: 3600, cacheEverything: true } });
  if (!jwksResponse.ok) throw new Error("Could not load Google signing keys");
  const { keys } = await jwksResponse.json();
  const jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) throw new Error("Unknown token signing key");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    decodeBase64Url(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  const now = Math.floor(Date.now() / 1000);
  const issuerOk = payload.iss === "accounts.google.com" || payload.iss === "https://accounts.google.com";
  const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!valid || !issuerOk || !audience.includes(env.GOOGLE_CLIENT_ID) || payload.exp <= now || payload.iat > now + 60) {
    throw new Error("Expired or invalid ID token");
  }
  return payload;
}

const requireOwnUser = (identity, userId) => {
  if (identity.sub !== userId) throw new Response(JSON.stringify({ detail: "Forbidden" }), { status: 403 });
};

async function body(request) {
  try { return await request.json(); } catch { throw new Response(JSON.stringify({ detail: "Invalid JSON" }), { status: 400 }); }
}

async function meetingAccess(env, meetingId, userId, creatorOnly = false) {
  const row = await env.DB.prepare(`
    SELECT m.creator_user_sub, p.user_id
    FROM meetings m LEFT JOIN participants p ON p.meeting_id = m.id AND p.user_id = ?
    WHERE m.id = ?
  `).bind(userId, meetingId).first();
  return !!row && (creatorOnly ? row.creator_user_sub === userId : row.creator_user_sub === userId || row.user_id === userId);
}

function makeIcs(title, start, end) {
  const stamp = (value) => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const escape = (value) => String(value).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AcrossTime//Meeting//EN", "METHOD:REQUEST", "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@acrosstime`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(title)}`, "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
}

async function sendEmail(env, to, subject, text, ics) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return { skipped: true };
  const attachments = ics ? [{ filename: "invite.ics", content: btoa(unescape(encodeURIComponent(ics))) }] : undefined;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [to], subject, text, attachments }),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  return response.json();
}

async function route(request, env, identity) {
  const url = new URL(request.url);
  const frontendUrl = url.origin;
  const path = url.pathname.replace(/^\/api(?=\/|$)/, "").replace(/\/+$/, "") || "/";
  const method = request.method;
  let match;

  if (method === "GET" && (path === "/" || path === "/health")) return json({ ok: true, message: "Hello from Cloudflare Workers" });

  if ((match = path.match(/^\/register\/([^/]+)$/)) && method === "POST") {
    const userId = decodeURIComponent(match[1]); requireOwnUser(identity, userId);
    const input = await body(request);
    if (input.gmail !== identity.email) return json({ detail: "Email does not match token" }, 403);
    await env.DB.prepare(`INSERT INTO users (sub, username, gmail, timezone, picture) VALUES (?, ?, ?, 'UTC', ?)
      ON CONFLICT(sub) DO UPDATE SET username=excluded.username, gmail=excluded.gmail, picture=excluded.picture`)
      .bind(identity.sub, input.name || identity.name, identity.email, input.pic || identity.picture || null).run();
    return json(await env.DB.prepare("SELECT * FROM users WHERE sub = ?").bind(identity.sub).first());
  }

  if ((match = path.match(/^\/setting\/([^/]+)$/))) {
    const userId = decodeURIComponent(match[1]); requireOwnUser(identity, userId);
    if (method === "GET") {
      const user = await env.DB.prepare("SELECT username, timezone, gmail, picture FROM users WHERE sub = ?").bind(userId).first();
      return user ? json(user) : json({ detail: "User not found" }, 404);
    }
    if (method === "PUT") {
      const input = await body(request);
      await env.DB.prepare("UPDATE users SET username = ?, timezone = ? WHERE sub = ?").bind(input.username, input.timezone, userId).run();
      return json({ message: "Success!", data: await env.DB.prepare("SELECT sub, username, timezone, gmail FROM users WHERE sub = ?").bind(userId).first() });
    }
  }

  if ((match = path.match(/^\/contact\/search\/(.+)$/)) && method === "GET") {
    const contact = await env.DB.prepare("SELECT sub, username, gmail, timezone, picture FROM users WHERE gmail = ?").bind(decodeURIComponent(match[1])).first();
    return json(contact || { sub: null });
  }

  if ((match = path.match(/^\/contact\/(add|delete)\/([^/]+)$/))) {
    const action = match[1], userId = decodeURIComponent(match[2]); requireOwnUser(identity, userId);
    const input = await body(request);
    if (action === "add" && method === "POST") {
      if (input.sub === userId) return json({ detail: "Cannot add yourself" }, 400);
      const exists = await env.DB.prepare("SELECT sub FROM users WHERE sub = ?").bind(input.sub).first();
      if (!exists) return json({ detail: "User not found" }, 404);
      const result = await env.DB.prepare("INSERT OR IGNORE INTO contacts (user_sub, friend_of_this_user_sub) VALUES (?, ?)").bind(userId, input.sub).run();
      return json({ message: result.meta.changes ? "Successfully added!" : "This contact already exists in your contact" });
    }
    if (action === "delete" && method === "DELETE") {
      await env.DB.prepare("DELETE FROM contacts WHERE user_sub = ? AND friend_of_this_user_sub = ?").bind(userId, input.sub).run();
      return json({ message: "Successfully deleted!" });
    }
  }

  if ((match = path.match(/^\/contact\/([^/]+)$/)) && method === "GET") {
    const userId = decodeURIComponent(match[1]); requireOwnUser(identity, userId);
    const user = await env.DB.prepare("SELECT timezone FROM users WHERE sub = ?").bind(userId).first();
    if (!user) return json({ detail: "User not found" }, 404);
    const { results } = await env.DB.prepare(`SELECT c.id, u.sub, u.username AS name, u.gmail, u.timezone, u.picture
      FROM contacts c JOIN users u ON u.sub = c.friend_of_this_user_sub WHERE c.user_sub = ? ORDER BY u.username`).bind(userId).all();
    return json({ contacts: results, timezone: user.timezone });
  }

  if ((match = path.match(/^\/homepage\/([^/]+)$/))) {
    if (method === "GET") {
      const userId = decodeURIComponent(match[1]); requireOwnUser(identity, userId);
      const { results } = await env.DB.prepare(`SELECT m.id, m.slot_duration, m.title, m.created_at, m.all_voted, m.url,
        creator.username AS creator,
        GROUP_CONCAT(member.username, '|||') AS participant_names,
        GROUP_CONCAT(COALESCE(member.picture, ''), '|||') AS participant_pictures
        FROM participants mine JOIN meetings m ON m.id=mine.meeting_id JOIN users creator ON creator.sub=m.creator_user_sub
        JOIN participants p ON p.meeting_id=m.id JOIN users member ON member.sub=p.user_id
        WHERE mine.user_id=? GROUP BY m.id ORDER BY m.created_at DESC`).bind(userId).all();
      return json({ cards: results.map((m) => ({ ...m, date: new Date(`${m.created_at}Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }), all_voted: !!m.all_voted,
        participants: m.participant_names?.split("|||") || [], pictures: m.participant_pictures?.split("|||") || [] })) });
    }
    if (method === "DELETE") {
      const meetingId = Number(match[1]);
      if (!await meetingAccess(env, meetingId, identity.sub, true)) return json({ detail: "Forbidden" }, 403);
      await env.DB.prepare("DELETE FROM meetings WHERE id = ?").bind(meetingId).run();
      return json({ message: "Meeting deleted", id: meetingId });
    }
  }

  if ((match = path.match(/^\/newmeeting(?:other)?\/timezone\/([^/]+)$/)) && method === "GET" ||
      (match = path.match(/^\/meetinglink\/timezone\/([^/]+)$/)) && method === "GET") {
    const userId = decodeURIComponent(match[1]); requireOwnUser(identity, userId);
    const user = await env.DB.prepare("SELECT timezone FROM users WHERE sub = ?").bind(userId).first();
    return user ? json(user) : json({ detail: "User not found" }, 404);
  }

  if ((match = path.match(/^\/newmeeting\/([^/]+)$/))) {
    const userId = decodeURIComponent(match[1]); requireOwnUser(identity, userId);
    if (method === "GET") {
      const { results } = await env.DB.prepare(`SELECT c.id, u.sub, u.username AS name, u.gmail, u.timezone, u.picture
        FROM contacts c JOIN users u ON u.sub=c.friend_of_this_user_sub WHERE c.user_sub=? ORDER BY u.username`).bind(userId).all();
      return json({ contacts: results });
    }
    if (method === "POST") {
      const input = await body(request);
      if (input.creator_user_sub !== userId || !input.title || !input.slots?.length || input.slots.length > 10) return json({ detail: "Invalid meeting" }, 400);
      const allowed = await env.DB.prepare("SELECT friend_of_this_user_sub AS sub FROM contacts WHERE user_sub=?").bind(userId).all();
      const allowedSet = new Set(allowed.results.map((r) => r.sub));
      if ((input.invitees || []).some((id) => !allowedSet.has(id))) return json({ detail: "Invitee must be a contact" }, 400);
      const meeting = await env.DB.prepare("INSERT INTO meetings (title, timezone, creator_user_sub, slot_duration, url) VALUES (?, ?, ?, ?, '')")
        .bind(input.title, input.timezone, userId, input.slot_duration).run();
      const meetingId = meeting.meta.last_row_id;
      const publicUrl = `${frontendUrl}/meetinglink/${meetingId}`;
      const statements = [env.DB.prepare("UPDATE meetings SET url=? WHERE id=?").bind(publicUrl, meetingId),
        env.DB.prepare("INSERT INTO participants (meeting_id,user_id,voted,creator) VALUES (?,?,1,1)").bind(meetingId, userId),
        ...(input.invitees || []).map((id) => env.DB.prepare("INSERT INTO participants (meeting_id,user_id,voted,creator) VALUES (?,?,0,0)").bind(meetingId, id)),
        ...input.slots.map((slot) => env.DB.prepare("INSERT INTO voted_dates (meeting_id,starting_time,ending_time) VALUES (?,?,?)").bind(meetingId, slot.start, slot.end))];
      await env.DB.batch(statements);
      return json({ message: "Meeting created", meeting_id: meetingId });
    }
  }

  if ((match = path.match(/^\/meetinglink\/(\d+)$/)) && method === "GET") {
    const meetingId = Number(match[1]);
    if (!await meetingAccess(env, meetingId, identity.sub)) return json({ detail: "Forbidden" }, 403);
    const meeting = await env.DB.prepare(`SELECT m.slot_duration, u.sub, u.username AS name, u.gmail, u.timezone, u.picture
      FROM meetings m JOIN users u ON u.sub=m.creator_user_sub WHERE m.id=?`).bind(meetingId).first();
    if (!meeting) return json({ detail: "Meeting not found" }, 404);
    const contacts = await env.DB.prepare(`SELECT u.sub,u.username AS name,u.gmail,u.timezone,u.picture,p.voted
      FROM participants p JOIN users u ON u.sub=p.user_id WHERE p.meeting_id=? AND p.creator=0`).bind(meetingId).all();
    const slots = await env.DB.prepare(`SELECT d.id,d.starting_time AS start,d.ending_time AS end,COUNT(v.id) AS vote_count
      FROM voted_dates d LEFT JOIN votes v ON v.voted_date_id=d.id WHERE d.meeting_id=? GROUP BY d.id ORDER BY d.starting_time`).bind(meetingId).all();
    return json({ contacts: contacts.results.map((x) => ({ ...x, voted: !!x.voted })), available_slots: slots.results,
      slotDuration: meeting.slot_duration, creator: { sub: meeting.sub, name: meeting.name, gmail: meeting.gmail, timezone: meeting.timezone, picture: meeting.picture } });
  }

  if ((match = path.match(/^\/meetinglink\/(\d+)\/vote$/)) && method === "POST") {
    const meetingId = Number(match[1]), input = await body(request); requireOwnUser(identity, input.user_id);
    if (!await meetingAccess(env, meetingId, identity.sub)) return json({ detail: "Forbidden" }, 403);
    const validSlots = await env.DB.prepare("SELECT id FROM voted_dates WHERE meeting_id=?").bind(meetingId).all();
    const validSet = new Set(validSlots.results.map((r) => r.id));
    if ((input.slots || []).some((id) => !validSet.has(Number(id)))) return json({ detail: "Invalid slot" }, 400);
    await env.DB.batch([env.DB.prepare("DELETE FROM votes WHERE meeting_id=? AND user_id=?").bind(meetingId, identity.sub),
      ...(input.slots || []).map((id) => env.DB.prepare("INSERT INTO votes (user_id,voted_date_id,meeting_id) VALUES (?,?,?)").bind(identity.sub, id, meetingId)),
      env.DB.prepare("UPDATE participants SET voted=1 WHERE meeting_id=? AND user_id=?").bind(meetingId, identity.sub),
      env.DB.prepare(`UPDATE meetings SET all_voted=NOT EXISTS(SELECT 1 FROM participants WHERE meeting_id=? AND voted=0) WHERE id=?`).bind(meetingId, meetingId)]);
    return json({ message: "Vote submitted!" });
  }

  if ((match = path.match(/^\/send_email\/([^/]+)$/)) && method === "POST") {
    const userId = decodeURIComponent(match[1]); requireOwnUser(identity, userId); const input = await body(request);
    if (!Array.isArray(input.receivers) || input.receivers.length > 10) return json({ detail: "Invalid receivers" }, 400);
    const contacts = await env.DB.prepare(`SELECT u.gmail FROM contacts c JOIN users u ON u.sub=c.friend_of_this_user_sub WHERE c.user_sub=?`).bind(userId).all();
    const allowed = new Set(contacts.results.map((r) => r.gmail));
    if (input.receivers.some((email) => !allowed.has(email))) return json({ detail: "Receiver must be a contact" }, 403);
    await Promise.all(input.receivers.map((to) => sendEmail(env, to, input.subject, input.body)));
    return json({ message: true, email_configured: !!env.RESEND_API_KEY });
  }

  if ((match = path.match(/^\/finalizemeeting\/(\d+)\/vote$/)) && method === "POST") {
    const meetingId = Number(match[1]);
    if (!await meetingAccess(env, meetingId, identity.sub, true)) return json({ detail: "Forbidden" }, 403);
    const input = await body(request);
    const selected = await env.DB.prepare(`SELECT d.starting_time,d.ending_time,m.title FROM voted_dates d JOIN meetings m ON m.id=d.meeting_id WHERE d.id=? AND d.meeting_id=?`).bind(input.finalized_vote_id, meetingId).first();
    if (!selected) return json({ detail: "Invalid slot" }, 400);
    await env.DB.prepare("UPDATE meetings SET finalized=1,finalized_voted_date_id=? WHERE id=?").bind(input.finalized_vote_id, meetingId).run();
    const participants = await env.DB.prepare(`SELECT u.gmail,u.username,u.timezone FROM participants p JOIN users u ON u.sub=p.user_id WHERE p.meeting_id=?`).bind(meetingId).all();
    const ics = makeIcs(selected.title, selected.starting_time, selected.ending_time);
    await Promise.all(participants.results.map((p) => {
      const format = new Intl.DateTimeFormat("en-GB", { timeZone: p.timezone, dateStyle: "medium", timeStyle: "short" });
      return sendEmail(env, p.gmail, "AcrossTime: meeting time finalized", `Hi ${p.username},\n\n${selected.title} is finalized for ${format.format(new Date(selected.starting_time))} (${p.timezone}).\n${frontendUrl}/finalizemeeting/${meetingId}`, ics);
    }));
    return json({ message: "Finalized successfully!", email_configured: !!env.RESEND_API_KEY });
  }

  return json({ detail: "Not found" }, 404);
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    try {
      const url = new URL(request.url);
      const apiPath = url.pathname.replace(/^\/api(?=\/|$)/, "") || "/";
      const isPublic = apiPath === "/" || apiPath === "/health";
      const identity = isPublic ? null : await verifyGoogleToken(request, env);
      const response = await route(request, env, identity);
      const headers = new Headers(response.headers);
      Object.entries(cors).forEach(([key, value]) => headers.set(key, value));
      return new Response(response.body, { status: response.status, headers });
    } catch (error) {
      const response = error instanceof Response ? error : json({ detail: error.message || "Internal server error" }, error.message?.includes("token") ? 401 : 500);
      const headers = new Headers(response.headers);
      Object.entries(cors).forEach(([key, value]) => headers.set(key, value));
      return new Response(response.body, { status: response.status, headers });
    }
  },
};
