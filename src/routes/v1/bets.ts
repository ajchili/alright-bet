import { Router, Request, Response } from "express";
import * as Bets from "../../controllers/bets";
import * as Groups from "../../controllers/groups";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  const { groupId: id = "", name = "", description = "" } = req.body;
  if (id.length === 0 || name.length < 3 || name.length > 100) {
    res.status(400).send();
    return;
  }
  try {
    const groupId = parseInt(id, 10);
    const group = await Groups.find(groupId);
    await Bets.create(user, group.id, name, description);
    res.status(200).send();
  } catch (err) {
    res.status(500).send();
  }
});

export default router;
