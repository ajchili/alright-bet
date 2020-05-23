import { Group, GroupMember, User } from "../lib/v1";
import { groups, members } from "./database";

export const create = async (
  user: User,
  groupName: string
): Promise<Group> => {
  return await groups.create(user, groupName);
};

export const destroy = async (id: number) => {
  return await Promise.all([
    groups.destroy(id),
    members.propagateGroupDestroy(id),
  ]);
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
