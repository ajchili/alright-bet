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
    const group = await Groups.createGroup(user, name);
    res.status(200).send({ redirect: `/?group=${group.id}` });
  } catch (err) {
    res.status(500).send();
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  try {
    const groupId = parseInt(id, 10);
    const groupOwner = await Groups.getOwner(groupId);
    if (groupOwner.id !== user.id) {
      res.status(401).send();
      return;
    }
    await Groups.destroy(groupId);
    res.status(200).send({ redirect: "/" });
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/:id/members", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const groupId = parseInt(id, 10);
    const groupMembers = await Groups.getMembers(groupId);
    res.status(200).json(groupMembers);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/:id/owner", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const groupId = parseInt(id, 10);
    const groupMembers = await Groups.getOwner(groupId);
    res.status(200).json(groupMembers);
  } catch (err) {
    res.status(500).send();
  }
});

export default router;
