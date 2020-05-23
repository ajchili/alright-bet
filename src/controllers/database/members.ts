import { QueryResult } from "pg";
import { constants, Member, User } from "../../lib/v1";
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
