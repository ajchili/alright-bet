import { Router, Request, Response } from "express";
import formidable from "express-formidable";
import fs from "fs";
import{ Bets, Groups, Members, Users, Wagers } from "../../controllers";

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

router.get("/:id/wagers", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const betId = parseInt(id, 10);
    const bet = await Bets.find(betId);
    const wagers = await Wagers.getForBet(bet);
    const betters = new Set();
    wagers.forEach((wager) => {
      if (betters.has(wager.user_id)) {
        wager.amended = true;
      }
      betters.add(wager.user_id);
    });
    res.status(200).json(wagers);
  } catch (err) {
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
    const previousWager = await Wagers.getMostRecentWagerForBet(member, bet);
    const maxWager = previousWager + wager;
    if (wager < 1 || wager > maxWager) {
      res.status(400).send();
      return;
    }
    await Wagers.create(member, bet, wager);
    member.currency = member.currency + previousWager - wager;
    await Members.update(member);
    res.status(200).json({ redirect: `/bets/${bet.id}` });
  } catch (err) {
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

router.delete("/:id/wagers", async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  const { id } = req.params;
  try {
    const betId = parseInt(id, 10);
    const bet = await Bets.find(betId);
    const group = await Groups.find(bet.group_id);
    const member = await Members.find(user, group);
    const previousWager = await Wagers.getMostRecentWagerForBet(member, bet);
    await Wagers.create(member, bet, 0);
    member.currency = member.currency + previousWager;
    await Members.update(member);
    res.status(200).json({ redirect: `/bets/${bet.id}` });
  } catch (err) {
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

router.use(formidable());

router.post("/:id/complete", async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  const { id } = req.params;
  const { winner_id = "" } = req.fields;
  const { proof } = req.files;
  let proofURL: string;
  if (typeof winner_id !== "string" || winner_id.length === 0) {
    res.status(400).send();
    return;
  }
  try {
    const betId = parseInt(id, 10);
    const bet = await Bets.find(betId);
    if (bet.creator_id !== user.id) {
      res.status(401).redirect("/");
      return;
    }
    if (proof !== undefined) {
      const bitmapAsBase64 = fs.readFileSync(proof.path, {
        encoding: "base64",
      });
      proofURL = `data:${proof.type};base64,${bitmapAsBase64}`;
    }
    const winner = await Users.find(winner_id);
    await Bets.complete(bet, winner, proofURL);
    res.status(200).json({ proofURL, redirect: `/bets/${bet.id}` });
  } catch (err) {
    console.error(err);
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

export default router;
