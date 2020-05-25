import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import session from "express-session";
import { config } from "dotenv";
// Configure environment variables
config();

import AuthenticationRouter from "./routes/v1/authentication";
import BetsRouter from "./routes/v1/bets";
import GroupsRouter from "./routes/v1/groups";
import ReactRouter from "./routes/v1/react";
import AuthenticationMiddleware from "./middleware/authentication";
import { seed } from "./controllers/database";

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    resave: true,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
  })
);
app.use(express.static("build", { index: false }));
const PORT: string = process.env.PORT || "80";

app.use(AuthenticationMiddleware);

app.use("/api/v1/authentication", AuthenticationRouter);
app.use("/api/v1/bets", BetsRouter);
app.use("/api/v1/groups", GroupsRouter);
app.use("/", ReactRouter);

seed()
  .then(() => app.listen(PORT));
