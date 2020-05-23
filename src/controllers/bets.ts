import { ActiveBet, Bet, Group, User } from "../lib/v1";
import { bets } from "./database";

export const create = async (
  user: User,
  group: Group,
  name: string,
  description: string = ""
): Promise<Bet> => {
  return await bets.create(user, group.id, name, description);
};

export const find = async (id: number): Promise<Bet> => {
  return await bets.find(id);
};

export const getForGroup = async (
  group: Group
): Promise<ActiveBet[]> => {
  return await bets.getActiveForGroup(group.id);
};
