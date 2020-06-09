import { QueryResult } from "pg";
import { Group, Member, User } from "../lib/v1";
import { members } from "./database";
import { getClient } from "./database/utils";

export const get = async (user: User, group: Group): Promise<Member> => {
  return await members.find(user, group);
};

export const getForUser = async (user: User): Promise<Member[]> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT * FROM members WHERE user_id = $1",
      [user.id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        }
        const memberships = result.rows as Member[];
        resolve(memberships);
      }
    );
  });
};

export const update = async (member: Member): Promise<Member> => {
  return await members.update(member);
};
