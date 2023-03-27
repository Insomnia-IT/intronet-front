import "./polyfill";
import React, {render} from "preact/compat";
import { App } from "./app/app";
window.addEventListener('init', () => {
  const container = document.getElementById("root");
  for (let child of Array.from(container.children)) {
    child.remove();
  }
  render(<App />, document.querySelector('#root'));
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
