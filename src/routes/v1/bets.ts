import { Router, Request, Response } from "express";
import * as Bets from "../../controllers/bets";
import * as Groups from "../../controllers/groups";
import * as Members from "../../controllers/members";
import * as Wagers from "../../controllers/wagers";

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
    await Bets.create(user, group, name, description);
    res.status(200).send({ redirect: `/?group=${group.id}` });
  } catch (err) {
    switch (err.message) {
      case "Group does not exist!":
        res.status(404).send();
        break;
      default:
        res.status(500).send();
        break;
    }
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const betId = parseInt(id, 10);
    const bet = await Bets.find(betId);
    res.status(200).send(bet);
  } catch (err) {
    switch (err.message) {
      case "Bet does not exist!":
        res.status(404).send();
        break;
      default:
        res.status(500).send();
        break;
    }
  }
});

router.get("/:id/wagers", async (req: Request, res: Response) => {});

router.post("/:id/wagers/create", async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  const { id } = req.params;
  const { amount = 0 } = req.body;
  const wager = parseInt(amount, 10);
  if (isNaN(wager) || wager === 0) {
    res.status(400).send();
    return;
  }
  try {
    const betId = parseInt(id, 10);
    const bet = await Bets.find(betId);
    const group = await Groups.find(bet.group_id);
    const member = await Members.find(user, group);
    if (wager < 1 || wager > member.currency) {
      res.status(400).send();
      return;
    }
    await Wagers.create(member, bet, wager);
    res.status(200).json({ redirect: `/bets/${bet.id}` });
  } catch (err) {
    console.error(err);
    switch (err.message) {
      case "Bet does not exist!":
      case "Group does not exist!":
      case "Member does not exist!":
        res.status(404).send();
        break;
      default:
        res.status(500).send();
        break;
    }
  }
});

export default router;
