import { Bet, User } from "../lib/v1";
import { bets } from "./database";

export const create = async (
  user: User,
  groupID: number,
  name: string,
  description: string = ""
): Promise<Bet> => {
  return await bets.create(user, groupID, name, description);
};
