import { Request, Response } from "express";
import { Groups, Users } from "../../controllers";

export const getDetailedData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await Users.getDetailedData(id);
    res.status(200).json(data);
  } catch (err) {
    switch (err.message) {
      case "User does not exist!":
        res.status(404).send();
        break;
      default:
        res.status(500).send();
        break;
    }
  }
};

export const getGroupOwner = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const groupId = parseInt(id, 10);
    const groupMembers = await Groups.getOwner(groupId);
    res.status(200).json(groupMembers);
  } catch (err) {
    res.status(500).send();
  }
};

export const myGroups = async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  try {
    const groups = await Groups.getForUser(user);
    res.status(200).send(groups);
  } catch (err) {
    res.status(500).send();
  }
};
