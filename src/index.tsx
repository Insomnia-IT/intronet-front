import "./polyfill";
import {render} from "preact";
import { App } from "./app/app";
window.addEventListener('init', () => {
  const container = document.getElementById("root");
  render(<App />, document.querySelector('#root'));
  document.getElementById("start").remove();
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
