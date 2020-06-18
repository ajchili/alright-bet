import { Group, GroupMember, User } from "../lib/v1";
import { bets, groups, members, wagers } from "./database";

export const create = async (user: User, groupName: string): Promise<Group> => {
  return await groups.create(user, groupName);
};

export const destroy = async (group: Group): Promise<void> => {
  const _bets = await bets.getForGroup(group);
  await Promise.all(_bets.map((bet) => wagers.propagateBetDestroy(bet)));
  await bets.propagateGroupDestroy(group);
  await members.propagateGroupDestroy(group.id);
  await groups.destroy(group.id);
};

export const get = async (id: number) => {
  return await groups.find(id);
};

export const getForUser = async (user: User): Promise<Group[]> => {
  return await groups.getForUser(user);
};

export const getMembers = async (id: number): Promise<GroupMember[]> => {
  return await members.getForGroup(id);
};

export const getOwner = async (id: number): Promise<User> => {
  return await groups.getOwner(id);
};

export const join = async (user: User, id: number): Promise<void> => {
  const alreadyInGroup = await members.isUserInGroup(user, id);
  if (!alreadyInGroup) {
    await groups.join(user, id);
  }
};

export const leave = async (user: User, group: Group): Promise<void> => {
  const alreadyInGroup = await members.isUserInGroup(user, group.id);
  if (alreadyInGroup) {
    await members.leaveGroup(user, group);
  }
};

export const stimulateEconomy = async (group: Group): Promise<void> => {
  await members.stimulateEconomyForGroup(group);
};
