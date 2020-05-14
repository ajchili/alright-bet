import fetch from "node-fetch";
import { User } from "../../lib/v1/discord";

export const getAvatarURL = (userId: string, avatarHash: string): string => {
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`;
};

export const getMe = async (token: string): Promise<User> => {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  return json as User;
};
