import { Request, Response } from "express";
import { Groups } from "../../controllers";

export const create = async (req: Request, res: Response) => {
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
    const group = await Groups.create(user, name);
    res.status(200).send({ redirect: `/?group=${group.id}` });
  } catch (err) {
    res.status(500).send();
  }
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  try {
    const groupId = parseInt(id, 10);
    const group = await Groups.get(groupId);
    const groupOwner = await Groups.getOwner(group.id);
    if (groupOwner.id !== user.id) {
      res.status(401).send();
      return;
    }
    await Groups.destroy(group);
    res.status(200).send({ redirect: "/" });
  } catch (err) {
    res.status(500).send();
  }
};

export const join = async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  const { id } = req.params;
  try {
    const groupId = parseInt(id, 10);
    await Groups.join(user, groupId);
    res.status(200).json({ redirect: `/?group=${groupId}` });
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
};

export const leave = async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  const { id } = req.params;
  try {
    const groupId = parseInt(id, 10);
    const group = await Groups.get(groupId);
    await Groups.leave(user, group);
    res.status(200).json({ redirect: "/" });
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
};

export const stimulateEconomy = async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  const { id } = req.params;
  try {
    const groupId = parseInt(id, 10);
    const group = await Groups.get(groupId);
    await Groups.stimulateEconomy(group);
    res.status(200).json({ redirect: `/?group=${group.id}` });
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
};
