CREATE TABLE users (
  id VARCHAR(100) PRIMARY KEY NOT NULL UNIQUE,
  username VARCHAR(32) NOT NULL,
  discriminator VARCHAR(32) NOT NULL,
  avatar VARCHAR(255)
);

CREATE TABLE groups (
  id SERIAL PRIMARY KEY UNIQUE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY UNIQUE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE members (
  id SERIAL PRIMARY KEY UNIQUE,
  user_id VARCHAR(100) NOT NULL REFERENCES users(id),
  group_id INTEGER NOT NULL REFERENCES groups(id),
  role_id INTEGER NOT NULL REFERENCES roles(id),
  currency INTEGER NOT NULL
);

CREATE TABLE bets (
  id SERIAL PRIMARY KEY UNIQUE,
  creator_id VARCHAR(100) NOT NULL REFERENCES users(id),
  winner_id VARCHAR(100) NOT NULL REFERENCES users(id),
  group_id INTEGER NOT NULL REFERENCES groups(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  proof TEXT
);

CREATE TABLE wagers (
  id SERIAL PRIMARY KEY UNIQUE,
  bet_id INTEGER NOT NULL REFERENCES bets(id),
  user_id VARCHAR(100) NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL,
  time_placed TIMESTAMP NOT NULL
);

CREATE TABLE winners (
  id SERIAL PRIMARY KEY UNIQUE,
  bet_id INTEGER NOT NULL REFERENCES bets(id),
  wager_id INTEGER NOT NULL REFERENCES wagers(id)
);
