import React from "react";
import "./index.sass";
import { App } from "./app/app";
import { render } from "react-dom";

const container = document.getElementById("root");
render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  container
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
