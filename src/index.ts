import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/", (_: Request, res: Response) => {
  res.status(200).send("Hello, World!");
});

app.listen(8080);
