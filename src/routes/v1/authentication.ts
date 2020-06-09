import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getMe } from "../../api/v1/discord";
import { discordAuth } from "../../config/oauth2";
import * as Users from "../../controllers/users";

export const authenticate = (_: Request, res: Response) => {
  res.redirect(discordAuth.code.getUri());
};

export const callback = async (req: Request, res: Response) => {
  const { code = "" } = req.query;
  if (code.length === 0 || typeof code !== "string") {
    res.status(400).send();
    return;
  }
  try {
    const user = await discordAuth.code.getToken(req.originalUrl);
    const discordUser = await getMe(user.accessToken);
    Users.findAndUpdateOrCreate(discordUser).catch(() => {
      // TODO: Handle error, ignore for now
    });
    const payload = {
      accessToken: user.accessToken,
      id: discordUser.id,
    };
    const options = {
      expiresIn: "6h",
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, options);
    req.session.accessToken = accessToken;
    res.redirect("/");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const logout = (req: Request, res: Response) => {
  delete req.session.accessToken;
  res.redirect("/");
};
