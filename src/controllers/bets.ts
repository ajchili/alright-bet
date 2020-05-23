import { ActiveBet, Bet, Group, User } from "../lib/v1";
import { bets, groups } from "./database";

export const create = async (
  user: User,
  groupID: number,
  name: string,
  description: string = ""
): Promise<Bet> => {
  return await bets.create(user, groupID, name, description);
};

export const getForGroup = async (
  group: Group
): Promise<ActiveBet[]> => {
  return await bets.getActiveForGroup(group.id);
}
