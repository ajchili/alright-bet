import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { discordAuth } from "../../config/oauth2";
import { getMe } from "../../api/v1/discord";

const router = Router();

router.get("/authenticate", (_: Request, res: Response) => {
  res.redirect(discordAuth.code.getUri());
});

router.get("/callback", async (req: Request, res: Response) => {
  const { code = "" } = req.query;
  if (code.length === 0 || typeof code !== "string") {
    res.status(400).send();
    return;
  }
  try {
    const user = await discordAuth.code.getToken(req.originalUrl);
    const discordUser = await getMe(user.accessToken);
    const payload = {
      accessToken: user.accessToken,
      id: discordUser.id,
    };
    const options = {
      expiresIn: '6h'
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, options);
    console.log(accessToken);
    res.status(200).send(discordUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
