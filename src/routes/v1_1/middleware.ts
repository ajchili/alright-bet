import { Request, Response, NextFunction } from "express";

export const validateRequestIsAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).redirect("/");
    return;
  }
  next();
};
