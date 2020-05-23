import { Router, Request, Response } from "express";
import * as Groups from "../../controllers/groups";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  const { name = "" } = req.body;
  if (name.length < 3) {
    res.status(400).send();
    return;
  }
  try {
    await Groups.createGroup(user, name);
    res.status(200).send();
  } catch (err) {
    res.status(500).send();
  }
});

export default router;
