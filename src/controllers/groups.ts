import { Group, GroupMember, User } from "../lib/v1";
import { groups, members } from "./database";

export const createGroup = async (
  user: User,
  groupName: string
): Promise<Group> => {
  return await groups.create(user, groupName);
};

export const getGroup = async () => {};

export const getGroupsForUser = async (user: User): Promise<Group[]> => {
  return await groups.getForUser(user);
};

export const getMembers = async (
  id: number
): Promise<GroupMember[]> => {
  return await members.getForGroup(id);
};

export const joinGroup = async () => {};

export const leaveGroup = async () => {};

export const updateGroup = async () => {};

export const deleteGroup = async () => {};
