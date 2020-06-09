import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import formidable from "express-formidable";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { config } from "dotenv";
// Configure environment variables
config();

import AuthenticationRouter from "./routes/v1/authentication";
import GroupsRouter from "./routes/v1/groups";
import ReactRouter from "./routes/v1/react";
import AuthenticationMiddleware from "./middleware/authentication";
import * as Routes from "./routes";
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
// Bets
app.get("/api/v1/bets/:id", Routes.v1.Bets.get);
app.post("/api/v1/bets", Routes.v1.Bets.create);
app.post("/api/v1/bets/:id/complete", formidable(), Routes.v1.Bets.complete);
// Wagers
app.delete("/api/v1/bets/:id/wagers", Routes.v1.Wagers.remove);
app.get("/api/v1/bets/:id/wagers", Routes.v1.Wagers.getForBet);
app.post("/api/v1/bets/:id/wagers", Routes.v1.Wagers.create);
app.use("/api/v1/groups", GroupsRouter);
// Users
app.get("/api/v1/users/:id", Routes.v1.Users.getDetailedData);
// React SSR
app.use("/", Routes.v1.React.render);

app.listen(PORT);
