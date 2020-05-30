import { Request, Response } from "express";
import { Bets, Groups, Members, Wagers } from "../../controllers";

export const create = async (req: Request, res: Response) => {
  const { user } = req.cookies;
  const { amount = 0, betId = "", details = "" } = req.body;
  const wagerAmount = parseInt(amount, 10);
  if (isNaN(wagerAmount) || wagerAmount === 0) {
    res.status(400).send("Wager amount must be greater than or equal to 1!");
    return;
  }
  if (betId.length === 0) {
    res.status(400).send("A bet id is required to create a wager!");
    return;
  }
  try {
    const bet = await Bets.find(parseInt(betId, 10));
    const group = await Groups.find(bet.group_id);
    const member = await Members.find(user, group);
    const previousWager = await Wagers.v1_1.getMostRecentForMemberInBet(
      member,
      bet
    );
    const maxWagerAmount = previousWager.amount + wagerAmount;
    if (wagerAmount < 1 || wagerAmount > maxWagerAmount) {
      res.status(400).send();
      return;
    }
    await Wagers.v1_1.create(bet, member, wagerAmount, details);
    member.currency = member.currency + previousWager.amount - wagerAmount;
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
};
