import { Bet, DetailedWager, Member, Wager } from "../lib/v1";
import { wagers } from "./database";

export const create = async (
  member: Member,
  bet: Bet,
  amount: number
): Promise<Wager> => {
  return await wagers.create(member, bet, amount);
};

export const getForBet = async (bet: Bet): Promise<DetailedWager[]> => {
  return await wagers.getForBet(bet);
};

export const getMostRecentWagerForBet = async (
  member: Member,
  bet: Bet
): Promise<number> => {
  return await wagers.getMostRecentWagerForBet(member, bet);
};
