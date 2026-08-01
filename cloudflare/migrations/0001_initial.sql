PRAGMA foreign_keys = ON;

CREATE TABLE users (
  sub TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  gmail TEXT NOT NULL UNIQUE,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  picture TEXT
);

CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_sub TEXT NOT NULL REFERENCES users(sub) ON DELETE CASCADE,
  friend_of_this_user_sub TEXT NOT NULL REFERENCES users(sub) ON DELETE CASCADE,
  UNIQUE(user_sub, friend_of_this_user_sub),
  CHECK(user_sub <> friend_of_this_user_sub)
);

CREATE TABLE meetings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  timezone TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  creator_user_sub TEXT NOT NULL REFERENCES users(sub) ON DELETE CASCADE,
  slot_duration TEXT NOT NULL,
  finalized INTEGER NOT NULL DEFAULT 0,
  all_voted INTEGER NOT NULL DEFAULT 0,
  url TEXT,
  finalized_voted_date_id INTEGER
);

CREATE TABLE participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meeting_id INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(sub) ON DELETE CASCADE,
  voted INTEGER NOT NULL DEFAULT 0,
  creator INTEGER NOT NULL DEFAULT 0,
  UNIQUE(meeting_id, user_id)
);

CREATE TABLE voted_dates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meeting_id INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  starting_time TEXT NOT NULL,
  ending_time TEXT NOT NULL
);

CREATE TABLE votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(sub) ON DELETE CASCADE,
  voted_date_id INTEGER NOT NULL REFERENCES voted_dates(id) ON DELETE CASCADE,
  meeting_id INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  UNIQUE(user_id, voted_date_id)
);

CREATE INDEX contacts_user_idx ON contacts(user_sub);
CREATE INDEX participants_user_idx ON participants(user_id);
CREATE INDEX participants_meeting_idx ON participants(meeting_id);
CREATE INDEX voted_dates_meeting_idx ON voted_dates(meeting_id);
CREATE INDEX votes_meeting_idx ON votes(meeting_id);
CREATE INDEX votes_date_idx ON votes(voted_date_id);
