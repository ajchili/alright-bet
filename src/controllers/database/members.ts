import { QueryResult } from "pg";
import { constants, GroupMember, Member, User } from "../../lib/v1";
import { getClient } from "./utils";

export const create = async (
  user: User,
  groupId: number,
  roleId: number
): Promise<Member> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "INSERT INTO members(user_id, group_id, role_id, currency) VALUES($1, $2, $3, $4) RETURNING *",
      [user.id, groupId, roleId, constants.DEFAULT_CURRENCY_AMOUNT],
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          const member = result.rows[0] as Member;
          resolve(member);
        }
      }
    );
  });
};


export const getForGroup = async (id: number): Promise<GroupMember[]> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT members.id, members.user_id, members.role_id, members.currency, users.username, users.discriminator, users.avatar FROM members LEFT JOIN users ON members.user_id = users.id WHERE members.group_id = $1",
      [id],
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          const users = result.rows as GroupMember[];
          resolve(users);
        }
      }
    );
  });
};