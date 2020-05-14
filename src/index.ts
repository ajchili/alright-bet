import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
// Configure environment variables
config();

import AuthenticationRouter from "./routes/v1/authentication";

const app: Express = express();
app.use(bodyParser.json());
const PORT: string = process.env.PORT || "80";

app.get("/", (_: Request, res: Response) => {
  res.status(200).send("Hello, World!");
});

app.use("/api/v1/authentication", AuthenticationRouter);

app.listen(PORT);
