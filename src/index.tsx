import "./polyfill";
import {render} from "preact";
import { App } from "./app/app";
import {LogoContainer} from "./pages/main/mainPage";

window.addEventListener('init', () => {
  LogoContainer.logo = document.getElementById('logo');
  const container = document.getElementById("root");
  render(<App />, container);
  document.getElementById("start").remove();
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
