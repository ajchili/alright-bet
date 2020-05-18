import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// @ts-ignore
const { __INITIAL__DATA__: data = {} } = windowData;

ReactDOM.hydrate(
  <React.StrictMode>
    <BrowserRouter>
      <App me={data.me} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);