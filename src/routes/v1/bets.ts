import { Router, Request, Response } from "express";
import formidable from "express-formidable";
import fs from "fs";
import * as Bets from "../../controllers/bets";
import * as Groups from "../../controllers/groups";
import * as Users from "../../controllers/users";

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
