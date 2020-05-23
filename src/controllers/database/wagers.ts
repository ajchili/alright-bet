import { QueryResult } from "pg";
import { Bet, DetailedWager, Member, Wager } from "../../lib/v1";
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
        client.release(true);
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

export const getForBet = async (bet: Bet): Promise<DetailedWager[]> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT wagers.id, wagers.user_id, wagers.amount, wagers.time_placed, users.username, users.discriminator, users.avatar FROM wagers JOIN users ON wagers.user_id = users.id WHERE bet_id = $1",
      [bet.id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          const wagers = result.rows as DetailedWager[];
          resolve(wagers);
        }
      }
    );
  });
};
