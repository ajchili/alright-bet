import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import formidable from "express-formidable";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { config } from "dotenv";
// Configure environment variables
config();

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

// Authentication
app.get(
  "/api/v1/authentication/authenticate",
  Routes.v1.Authentication.authenticate
);
app.get("/api/v1/authentication/callback", Routes.v1.Authentication.callback);
app.get("/api/v1/authentication/logout", Routes.v1.Authentication.logout);
// Bets
app.post("/api/v1/bets", Routes.v1.Bets.create);
app.get("/api/v1/bets/:id", Routes.v1.Bets.get);
app.post("/api/v1/bets/:id/complete", formidable(), Routes.v1.Bets.complete);
// Groups
app.post("/api/v1/groups", Routes.v1.Groups.create);
app.get("/api/v1/groups/mine", Routes.v1.Users.myGroups);
app.delete("/api/v1/groups/:id", Routes.v1.Groups.destroy);
app.get("/api/v1/groups/:id/bets", Routes.v1.Bets.getActiveBetsForGroup);
app.get("/api/v1/groups/:id/members", Routes.v1.Members.getForGroup);
app.get("/api/v1/groups/:id/membership", Routes.v1.Members.getMyMemberForGroup);
app.get("/api/v1/groups/:id/owner", Routes.v1.Users.getGroupOwner);
app.post("/api/v1/groups/:id/join", Routes.v1.Groups.join);
app.post("/api/v1/groups/:id/leave", Routes.v1.Groups.leave);
app.post(
  "/api/v1/groups/:id/stimulateEconomy",
  Routes.v1.Groups.stimulateEconomy
);
// Users
app.get("/api/v1/users/:id", Routes.v1.Users.getDetailedData);
// Wagers
app.delete("/api/v1/bets/:id/wagers", Routes.v1.Wagers.remove);
app.get("/api/v1/bets/:id/wagers", Routes.v1.Wagers.getForBet);
app.post("/api/v1/bets/:id/wagers", Routes.v1.Wagers.create);
// React SSR
app.use("/", Routes.v1.React.render);

app.listen(PORT);
