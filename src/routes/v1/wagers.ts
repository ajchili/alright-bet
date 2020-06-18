import { Request, Response } from "express";
import { Bets, Groups, Members, Wagers } from "../../controllers";
import { User } from "../../lib/v1";

const handleError = (res: Response, err: Error) => {
  switch (err.message) {
    case "Bet does not exist!":
      res.status(400).send("Provided bet_id is invalid!");
      break;
    case "Member does not exist!":
      res
        .status(400)
        .send("Unable to submit bet for group that you are not a member of!");
      break;
    case "Group does not exist!":
    // Fall through
    default:
      res.status(500).send();
      break;
  }
};

export const create = async (req: Request, res: Response) => {
  const user = req.cookies.user as User;
  const { id: betId = "" } = req.params;
  const { amount = "" } = req.body;
  if (amount.length === 0) {
    res.status(400).send("No amount provided!");
    return;
  }
  try {
    const bet = await Bets.get(parseInt(betId, 10));
    const group = await Groups.get(bet.group_id);
    const member = await Members.get(user, group);
    const previousAmount = await Wagers.getMostRecentWagerForBet(member, bet);
    const maxAmount = member.currency + previousAmount;
    const newAmount = parseInt(amount, 10);
    if (isNaN(newAmount) || newAmount > maxAmount || newAmount < 1) {
      res.status(400).send("Invalid wager amount provided!");
      return;
    }
    const wager = await Wagers.create(member, bet, newAmount);
    member.currency = maxAmount - wager.amount;
    await Members.update(member);
    res.status(200).json({
      member,
      redirect: `/bets/${bet.id}`,
      wager,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const getForBet = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const betId = parseInt(id, 10);
    const bet = await Bets.get(betId);
    const wagers = await Wagers.getForBet(bet);
    const betters = new Set<string>();
    wagers.forEach((wager) => {
      if (betters.has(wager.user_id)) {
        wager.amended = true;
      }
      betters.add(wager.user_id);
    });
    res.status(200).json(wagers);
  } catch (err) {
    handleError(res, err);
  }
};

export const remove = async (req: Request, res: Response) => {
  const user = req.cookies.user as User;
  const { id: betId = "" } = req.params;
  try {
    const bet = await Bets.get(parseInt(betId, 10));
    const group = await Groups.get(bet.group_id);
    const member = await Members.get(user, group);
    const previousAmount = await Wagers.getMostRecentWagerForBet(member, bet);
    const totalAmount = member.currency + previousAmount;
    await Wagers.create(member, bet, 0);
    member.currency = totalAmount;
    await Members.update(member);
    res.status(200).json({
      member,
      redirect: `/bets/${bet.id}`,
    });
  } catch (err) {
    handleError(res, err);
  }
};
