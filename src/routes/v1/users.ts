import { Request, Response } from "express";
import * as Users from "../../controllers/users";

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
