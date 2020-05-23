import fetch from "node-fetch";
import { DiscordUser } from "../../lib/v1";

export const getAvatarURL = (userId: string, avatarHash: string): string => {
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`;
};

export const getMe = async (token: string): Promise<DiscordUser> => {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  return json as DiscordUser;
};

export const getUser = async (userId: string): Promise<DiscordUser> => {
  const response = await fetch(`https://discord.com/api/users/${userId}`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });
  const json = await response.json();
  return json as DiscordUser;
};
