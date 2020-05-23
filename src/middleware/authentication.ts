import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getMe } from "../api/v1/discord";
import { User } from "../lib/v1";

export default async (req: Request, _: Response, next: NextFunction) => {
  const token = req.session.accessToken;
  if (token !== undefined && token.length > 0) {
    const decodedAccessToken = jwt.decode(token, { json: true });
    const { accessToken, exp: tokenExpiresAt = 0 } = decodedAccessToken;
    const now = new Date().getTime() / 1000;
    const tokenExpired = now > tokenExpiresAt;
    try {
      if (!tokenExpired) {
        const user: User = await getMe(accessToken);
        req.cookies = {
          user,
        };
      }
    } catch (err) {
      // TODO: Handle error
      console.error(err);
    }
  }
  next();
};
