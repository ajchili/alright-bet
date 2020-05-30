import { v1, v1_1 } from "../../lib";
import { getClient } from "../database/utils";
import { QueryResult } from "pg";

export const create = async (
  bet: v1.Bet,
  member: v1.Member,
  amount: number,
  details: string
): Promise<v1_1.Wager> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "INSERT INTO wagers(bet_id, user_id, amount, details, time_placed) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [bet.id, member.user_id, amount, details, "now()"],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject(
            new Error("Unable to create wager, an unexpected error occurred!")
          );
        }
        const wager = result.rows[0] as v1_1.Wager;
        resolve(wager);
      }
    );
  });
};

export const getAllForBet = async (
  bet: v1.Bet
): Promise<v1_1.DetailedWager[]> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT wagers.id, wagers.user_id, wagers.amount, wagers.details, wagers.time_placed, users.username, users.discriminator, users.avatar FROM wagers JOIN users ON wagers.user_id = users.id WHERE bet_id = $1 ORDER BY time_placed DESC",
      [bet.id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        }
        const wagers = result.rows as v1_1.DetailedWager[];
        resolve(wagers);
      }
    );
  });
};

export const getMostRecentAmountForMemberInBet = async (
  member: v1.Member,
  bet: v1.Bet
): Promise<number> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT wagers.amount FROM wagers JOIN users ON wagers.user_id = $2 WHERE bet_id = $1 ORDER BY time_placed DESC",
      [bet.id, member.user_id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          resolve(0);
        }
        const { amount = 0 } = result.rows[0] as v1_1.Wager;
        resolve(amount);
      }
    );
  });
};
