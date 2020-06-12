import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// @ts-ignore
const { __INITIAL__DATA__: data = {} } = window;

ReactDOM.hydrate(
  <React.StrictMode>
    <BrowserRouter>
      <App
        bet={data.bet}
        groups={data.groups}
        me={data.me}
        usersPageData={data.usersPageData}
      />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);