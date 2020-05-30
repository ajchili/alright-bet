-- v1
-- Initial version of database

CREATE TABLE users (
  id VARCHAR(100) NOT NULL UNIQUE,
  username VARCHAR(32) NOT NULL,
  discriminator VARCHAR(4) NOT NULL,
  avaratr VARCHAR(255)
);

CREATE TABLE groups (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE members (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  user_id VARCHAR(100) REFERENCES users(id),
  group_id INTEGER NOT NULL REFERENCES groups(id),
  role_id INTEGER NOT NULL REFERENCES roles(id),
  currency INTEGER NOT NULL
);

CREATE TABLE bets (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  creator_id VARCHAR(100) NOT NULL REFERENCES users(id),
  winner_id VARCHAR(100) REFERENCES users(id),
  group_id INTEGER NOT NULL REFERENCES groups(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  proof TEXT
);

CREATE TABLE wagers (
  id SERIAL PRIMARY KEY NOT NULL UNIQUE,
  bet_id INTEGER REFERENCES bets(id),
  user_id VARCHAR(100) REFERENCES users(id),
  amount INTEGER,
  time_placed TIMESTAMP
);

-- v1.1
-- Allow wagers to have a details field

ALTER TABLE IF EXISTS wagers ADD details TEXT;