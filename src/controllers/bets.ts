import { ActiveBet, Bet, Group, User } from "../lib/v1";
import { bets, groups, members, wagers } from "./database";

export const create = async (
  user: User,
  group: Group,
  name: string,
  description: string = ""
): Promise<Bet> => {
  return await bets.create(user, group, name, description);
};

export const complete = async (
  bet: Bet,
  winner: User,
  proof?: string
): Promise<void> => {
  const group = await groups.find(bet.group_id);
  const validWagers: Map<string, number> = new Map();
  const wagersOnBet = await wagers.getForBet(bet);
  wagersOnBet.forEach(wager => {
    if (!validWagers.has(wager.user_id)) {
      validWagers.set(wager.user_id, wager.amount);
    }
  });
  const wonMarbles: number = Array.from(validWagers.values())
    .reduce((total: number, current: number) => total + current);
  const member = await members.find(winner, group);
  member.currency += wonMarbles;
  await members.update(member);
  return await bets.complete(bet, winner, proof);
};

export const get = async (id: number): Promise<Bet> => {
  return await bets.find(id);
};

export const getForGroup = async (group: Group): Promise<ActiveBet[]> => {
  return await bets.getActiveForGroup(group.id);
};
