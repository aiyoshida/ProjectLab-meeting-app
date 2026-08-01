# Cloudflare deployment

The React frontend runs on Cloudflare Pages. The API runs on a Worker and stores
data in D1. Google ID tokens are verified by the Worker on every protected API
request. Email is optional and uses Resend's HTTPS API instead of SMTP.

## 1. Create the D1 database

Install Node.js 22 or newer, log in to Cloudflare, then run:

```sh
cd cloudflare
npm install
npx wrangler login
npx wrangler d1 create acrosstime
```

Copy the returned `database_id` into `cloudflare/wrangler.toml`, then apply the
schema:

```sh
npm run db:remote
```

Update these values in `wrangler.toml`:

```toml
FRONTEND_URL = "https://YOUR-PAGES-PROJECT.pages.dev"
GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

Deploy the API:

```sh
npm run deploy
```

## 2. Deploy the React app to Pages

Connect this repository in Cloudflare Pages and use:

- Root directory: `my-react-app`
- Build command: `npm run build`
- Build output directory: `build`

Set the Pages build environment variables:

```text
REACT_APP_API_BASE_URL=https://acrosstime-api.YOUR-SUBDOMAIN.workers.dev
REACT_APP_FRONT_BASE_URL=https://YOUR-PAGES-PROJECT.pages.dev
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

In Google Cloud Console, add the Pages URL to the OAuth client's **Authorized
JavaScript origins**. A custom domain must also be added if one is attached later.

After the first Pages deployment, make sure `FRONTEND_URL` in `wrangler.toml`
exactly matches the deployed origin and deploy the Worker again. This value controls
CORS and links included in meeting emails.

## 3. Optional email delivery

Verify a sending domain with Resend, add `EMAIL_FROM` under `[vars]` in
`wrangler.toml`, and store the API key as a secret:

```sh
npx wrangler secret put RESEND_API_KEY
```

Without these values, meetings and voting continue to work; email calls report
`email_configured: false` and do not send mail.

## Local development

Set a real Google client ID in `wrangler.toml`, then run:

```sh
cd cloudflare
npm install
npm run db:local
npm run dev
```

In a second terminal:

```sh
cd my-react-app
cp .env.example .env.local
npm start
```

## Existing SQLite data

The migration creates an empty production database. The existing `app.db` is not
uploaded automatically. Export it to SQL, review the data and import it only if the
development accounts should become production accounts. Never commit OAuth or
email secrets.
