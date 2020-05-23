import { QueryResult } from "pg";
import { Bet, Member, Wager } from "../../lib/v1";
import { getClient } from "./utils";

export const create = async (
  member: Member,
  bet: Bet,
  amount: number
): Promise<Wager> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "INSERT INTO wagers(bet_id, user_id, amount, time_placed) VALUES($1, $2, $3, $4) RETURNING *",
      [bet.id, member.user_id, amount, new Date()],
      (err: Error, result: QueryResult) => {
        client.end();
        if (err) {
          reject(err);
        } else {
          const wager = result.rows[0] as Wager;
          resolve(wager);
        }
      }
    );
  });
};
