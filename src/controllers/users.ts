import { DiscordUser, User } from "../lib/v1";
import { users } from "./database";

export const findAndUpdateOrCreate = async (user: DiscordUser | User) => {
  const existingUser = await users.find(user.id);
  if (existingUser) {
    await users.update(existingUser);
  } else {
    await users.create(user);
  }
};

export const find = async (id: string): Promise<User> => {
  return await users.find(id);
};
