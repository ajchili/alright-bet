import { DiscordUser, User } from "../../../lib/v1";

export const getAvatarURL = (user: DiscordUser | User): string | undefined => {
  if (user.avatar === undefined) {
    return v;
  }
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
};
