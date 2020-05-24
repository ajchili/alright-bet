import { Group, Member, User } from "../lib/v1";
import { members } from "./database";

export const find = async (user: User, group: Group): Promise<Member> => {
  return await members.find(user, group);
};

export const update = async (member: Member): Promise<Member> => {
  return await members.update(member);
};
