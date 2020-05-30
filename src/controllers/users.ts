import { QueryResult } from "pg";
import { DetailedUser, DiscordUser, User } from "../lib/v1";
import { users } from "./database";
import { getClient } from "./database/utils";
import * as Members from "./members";

export const findAndUpdateOrCreate = async (user: DiscordUser | User) => {
  const existingUser = await users.find(user.id);
  if (existingUser) {
    await users.update(existingUser);
  } else {
    await users.create(user);
  }
};

export const find = async (id: string): Promise<User> => {
  return await users.find(id);
};

export const getDetailedData = async (id: string): Promise<DetailedUser> => {
  const client = await getClient();
  const user: User = await new Promise((resolve, reject) => {
    client.query(
      "SELECT * FROM users WHERE id = $1",
      [id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject(new Error("User does not exist!"));
        }
        resolve(result.rows[0] as User);
      }
    );
  });
  const memberships = await Members.getForUser(user);
  return {
    ...user,
    memberships,
  };
};
