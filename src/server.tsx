import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import session from "express-session";
import { config } from "dotenv";
// Configure environment variables
config();

import App from "./App";
import AuthenticationRouter from "./routes/v1/authentication";
import GroupsRouter from "./routes/v1/groups";
import { seed } from "./controllers/database";
import * as Groups from "./controllers/groups";
import { getMe } from "./api/v1/discord";
import { Group, User } from "./lib/v1";

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    resave: true,
    secret: "insecureSecret",
    saveUninitialized: false,
  })
);
app.use(express.static("build", { index: false }));
const PORT: string = process.env.PORT || "80";

app.use(async (req: Request, _: Response, next: NextFunction) => {
  const token = req.session.accessToken;
  if (token !== undefined && token.length > 0) {
    const decodedAccessToken = jwt.decode(token, { json: true });
    const { accessToken, exp: tokenExpiresAt = 0 } = decodedAccessToken;
    const now = new Date().getTime() / 1000;
    const tokenExpired = now > tokenExpiresAt;
    try {
      if (!tokenExpired) {
        const user: User = await getMe(accessToken);
        req.cookies = {
          user
        };
      }
    } catch (err) {
      // TODO: Handle error
      console.error(err);
    }
  }
  next();
});

app.use("/api/v1/authentication", AuthenticationRouter);
app.use("/api/v1/groups", GroupsRouter);

app.get("*", async (req: Request, res: Response) => {
  const { user } = req.cookies;
  let groups: Group[] = [];
  switch (req.url) {
    case "/":
      if (user != null) {
        groups = await Groups.getGroupsForUser(user);
      }
      break;
  }

  const reactApp = ReactDOMServer.renderToString(
    <StaticRouter location={req.url}>
      <App
        groups={groups}
        me={user}
      />
    </StaticRouter>
  );

  const indexFile = path.resolve("./build/index.html");
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      res.status(500);
      res.send("Unable to render view, an unexpected error occurred!");
      return;
    }

    res.status(200);
    const html = data
      .replace("<script id=\"data\"></script>", `<script>
        window.__INITIAL__DATA__ = ${JSON.stringify({
        groups,
        me: user
      })};
      </script>`)
      .replace("<script src=\"main.js\"></script>", "<script src=\"/main.js\"></script>")
      .replace("<div id=\"root\"></div>", `<div id="root">${reactApp}</div>`);
    res.send(html);
  });
});

seed()
  .then(() => app.listen(PORT));
