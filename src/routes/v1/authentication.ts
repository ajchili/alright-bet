import { Router, Request, Response } from "express";
import { discordAuth } from "../../config/oauth2";

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
    res.status(200).send(user.accessToken);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
