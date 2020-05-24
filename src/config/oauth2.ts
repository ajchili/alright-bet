import ClientOAuth2 from "client-oauth2";

export const discordAuth = new ClientOAuth2({
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  accessTokenUri: "https://discord.com/api/oauth2/token",
  authorizationUri: "https://discord.com/oauth2/authorize",
  redirectUri: process.env.DISCORD_REDIRECT_URI,
  scopes: ["identify"],
});
