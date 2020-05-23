import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import * as Groups from "../../controllers/groups";
import { Group } from "../../lib/v1";
import App from "../../App";

const router = Router();

router.get("*", async (req: Request, res: Response) => {
  const { user } = req.cookies;
  let groups: Group[] = [];
  switch (req.path) {
    case "/":
      if (user != null) {
        groups = await Groups.getForUser(user);
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

export default router;
