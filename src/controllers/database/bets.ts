import { QueryResult } from "pg";
import { Bet, User } from "../../lib/v1";
import { getClient } from "./utils";

export const create = async (
  user: User,
  groupID: number,
  name: string,
  description: string
): Promise<Bet> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "INSERT INTO bets(creator_id, group_id, name, description) VALUES($1, $2, $3, $4) RETURNING *",
      [user.id, groupID, name, description],
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          const bet = result.rows[0] as Bet;
          resolve(bet);
        }
      }
    );
  });
};
