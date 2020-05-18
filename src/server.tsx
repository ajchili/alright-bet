import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express, Request, Response } from "express";
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
import { seed } from "./controllers/database";
import { getMe } from "./api/v1/discord";
import { User } from "./lib/v1/discord";

const app: Express = express();
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

app.use("/api/v1/authentication", AuthenticationRouter);

app.get("*", async (req: Request, res: Response) => {
  const token = req.session.accessToken;
  let me: User;
  if (token !== undefined && token.length > 0) {
    const decodedAccessToken = jwt.decode(token, { json: true });
    const { accessToken, exp: tokenExpiresAt = 0 } = decodedAccessToken;
    const now = new Date().getTime() / 1000;
    const tokenExpired = now > tokenExpiresAt;
    try {
      if (!tokenExpired) {
        me = await getMe(accessToken);
      }
    } catch (err) {
      // TODO: Handle error
      console.error(err);
    }
  }
  const reactApp = ReactDOMServer.renderToString(
    <StaticRouter>
      <App me={me} />
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
        window.__INITIAL__DATA__ = ${JSON.stringify({ me })};
      </script>`)
      .replace("<div id=\"root\"></div>", `<div id="root">${reactApp}</div>`);
    res.send(html);
  });
});

seed()
  .then(() => app.listen(PORT));
