import { Bet, Member, Wager } from "../lib/v1";
import { wagers } from "./database";

export const create = async (
  member: Member,
  bet: Bet,
  amount: number
): Promise<Wager> => {
  return await wagers.create(member, bet, amount);
};
