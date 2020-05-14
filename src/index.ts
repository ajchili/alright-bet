import express, { Express, Request, Response } from "express";

const app: Express = express();
const PORT: string = process.env.PORT || "80";

app.get("/", (_: Request, res: Response) => {
  res.status(200).send("Hello, World!");
});

app.listen(PORT);
