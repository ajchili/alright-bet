import { Request, Response } from "express";
import { Groups, Members } from "../../controllers";

export const getForGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const groupId = parseInt(id, 10);
    const groupMembers = await Groups.getMembers(groupId);
    res.status(200).json(groupMembers);
  } catch (err) {
    res.status(500).send();
  }
};

export const getMyMemberForGroup = async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  const { id } = req.params;
  try {
    const groupId = parseInt(id, 10);
    const group = await Groups.get(groupId);
    const membership = await Members.get(user, group);
    res.status(200).json(membership);
  } catch (err) {
    switch (err.message) {
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
