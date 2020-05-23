import { User } from "../lib/v1";
import { groups } from "./database";

export const createGroup = async (user: User, groupName: string) => {
  await groups.create(user, groupName);
};

export const getGroup = async () => {};

export const getMyGroups = async () => {};

export const joinGroup = async () => {};

export const leaveGroup = async () => {};

export const updateGroup = async () => {};

export const deleteGroup = async () => {};
