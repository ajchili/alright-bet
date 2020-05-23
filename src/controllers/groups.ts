import { Group, User, Member } from "../lib/v1";
import { groups , members } from "./database";

export const createGroup = async (user: User, groupName: string) => {
  await groups.create(user, groupName);
};

export const getGroup = async () => {};

export const getGroupsForUser = async (user: User): Promise<Group[]> => {
  return await groups.getForUser(user);
};

export const joinGroup = async () => {};

export const leaveGroup = async () => {};

export const updateGroup = async () => {};

export const deleteGroup = async () => {};
