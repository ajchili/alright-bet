import { QueryResult } from "pg";
import { ActiveBet, Bet, User } from "../../lib/v1";
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
        client.release(true);
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

export const find = async (id: number): Promise<Bet> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT * FROM bets WHERE id = $1",
      [id],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject(new Error("Bet does not exist!"));
        } else {
          const bet = result.rows[0] as Bet;
          resolve(bet);
        }
      }
    );
  });
};

export const getActiveForGroup = async (
  groupID: number
): Promise<ActiveBet[]> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT bets.id, bets.name, bets.description, users.id AS creator, users.username, users.discriminator, users.avatar FROM bets JOIN users ON bets.creator_id = users.id WHERE bets.group_id = $1 AND bets.proof IS NULL",
      [groupID],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else {
          const activeBets: ActiveBet[] = result.rows.map((row) => {
            return {
              id: row.id,
              name: row.name,
              description: row.description,
              creator: {
                id: row.creator,
                username: row.username,
                discriminator: row.discriminator,
                avatar: row.avatar,
              },
              betters: [],
              wagers: 0,
            };
          });
          resolve(activeBets);
        }
      }
    );
  });
};
