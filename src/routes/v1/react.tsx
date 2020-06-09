import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Bets, Groups, Users } from "../../controllers";
import { Bet, DetailedUser, Group } from "../../lib/v1";
import App from "../../web/App";

export const render = async (req: Request, res: Response) => {
  const { user } = req.cookies;
  let groups: Group[] = [];
  let bet: Bet;
  let detailedUserData: DetailedUser;
  try {
    if (user != null) {
      groups = await Groups.getForUser(user);
    }
    if (req.path.startsWith("/bets/")) {
      const id = req.path.substr(req.path.lastIndexOf("/") + 1);
      const betId = parseInt(id, 10);
      if (!isNaN(betId)) {
        bet = await Bets.get(betId);
      }
    } else if (req.path.startsWith("/users/")) {
      const id = req.path.substr(req.path.lastIndexOf("/") + 1);
      detailedUserData = await Users.getDetailedData(id);
    }
  } catch (err) {
    // Ignore error
    console.error("React SSR error:", err);
  }

  const reactApp = ReactDOMServer.renderToString(
    <StaticRouter location={req.url}>
      <App
        bet={bet}
        groups={groups}
        me={user}
        usersPageData={detailedUserData}
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
        bet,
        groups,
        me: user
      })};
      </script>`)
      .replace("<script src=\"main.js\"></script>", "<script src=\"/main.js\"></script>")
      .replace("<div id=\"root\"></div>", `<div id="root">${reactApp}</div>`);
    res.send(html);
  });
};
