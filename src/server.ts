import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { config } from "dotenv";
// Configure environment variables
config();

import AuthenticationRouter from "./routes/v1/authentication";
import BetsRouter from "./routes/v1/bets";
import GroupsRouter from "./routes/v1/groups";
import ReactRouter from "./routes/v1/react";
import AuthenticationMiddleware from "./middleware/authentication";
import { getPool } from "./controllers/database";

const pgSession = connectPgSimple(session);

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new pgSession({
      pool: getPool(),
    }),
  })
);
app.use(express.static("build", { index: false }));
const PORT: string = process.env.PORT || "80";

app.use(AuthenticationMiddleware);

app.use("/api/v1/authentication", AuthenticationRouter);
app.use("/api/v1/bets", BetsRouter);
app.use("/api/v1/groups", GroupsRouter);
app.use("/", ReactRouter);

app.listen(PORT);
