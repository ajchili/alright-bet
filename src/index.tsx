import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import session from "express-session";
import { config } from "dotenv";
// Configure environment variables
config();

import App from "../web/src/App";
import AuthenticationRouter from "./routes/v1/authentication";

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
const PORT: string = process.env.PORT || "80";

app.use("/api/v1/authentication", AuthenticationRouter);

app.get("*", (req: Request, res: Response) => {
  const reactApp = ReactDOMServer.renderToString(
    <App token={req.session.accessToken} />
  );

  const indexFile = path.resolve("./web/build/index.html");
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      res.status(500);
      res.send("Unable to render view, an unexpected error occurred!");
      return;
    }

    res.status(200);
    res.send(
      data.replace("<div id=\"root\"></div>", `<div id="root">${reactApp}</div>`)
    );
  });
});

app.listen(PORT);
