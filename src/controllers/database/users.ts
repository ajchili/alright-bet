import { QueryResult } from "pg";
import { DiscordUser, User } from "../../lib/v1";
import { getClient } from "./utils";

export const create = async (user: DiscordUser): Promise<QueryResult> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "INSERT INTO users(id, username, avatar, discriminator) VALUES($1, $2, $3, $4) RETURNING *",
      [user.id, user.username, user.avatar, user.discriminator],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const find = async (id: string): Promise<User> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT * FROM users WHERE id = $1",
      [id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          const user = result.rows[0] as User;
          resolve(user);
        }
      }
    );
  });
};

export const update = async (user: User): Promise<QueryResult> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "UPDATE users SET(id, username, avatar, discriminator) VALUES($1, $2, $3, $4) WHERE id = $1",
      [user.id, user.username, user.avatar, user.discriminator],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
