import { SvgContainer } from "./icons";
import { render } from "preact";
import { App } from "./app/app";
import "./styles.css";

window.addEventListener("init", async () => {
  SvgContainer.logo = document
    .getElementById("logo")
    .cloneNode(true) as SVGElement;
  SvgContainer.eye = document
    .getElementById("eye")
    .cloneNode(true) as SVGElement;
  await document.fonts.ready;
  const container = document.getElementById("root");
  container.style.display = "flex";
  render(<App />, container);
  finishEyeAnimation();
});

function finishEyeAnimation() {
  const eye = document.getElementById("eye");
  if (!eye) return;
  const spin = eye.querySelector("#eyeSpin") as SVGGElement | null;
  if (!spin) return;

  const dots = document.createElementNS("http://www.w3.org/2000/svg", "path");
  dots.id = "eyeDots";
  dots.setAttribute("d", EYE_DOTS_PATH);
  spin.appendChild(dots);

  const t = getComputedStyle(spin).transform;
  let deg = 0;
  if (t && t !== "none") {
    const m = new DOMMatrixReadOnly(t);
    deg = ((((Math.atan2(m.b, m.a) * 180) / Math.PI) % 360) + 360) % 360;
  }
  const target = deg > 50 ? 380 : 20;
  spin.style.animation = "none";
  spin.style.transform = `rotate(${deg}deg)`;
  spin.getBoundingClientRect();
  spin.style.transition = "transform .5s ease";
  spin.style.transform = `rotate(${target}deg)`;

  dots.style.transition = "opacity .4s ease .5s";
  dots.style.opacity = "1";

  // after the settle rotation (.5s) + dots fade-in (.4s), reveal the app
  window.setTimeout(() => {
    const start = document.getElementById("start");
    if (!start) return;
    start.style.transition = "opacity .4s ease";
    start.style.opacity = "0";
    window.setTimeout(() => start.remove(), 400);
  }, 900);
}

const EYE_DOTS_PATH =
  "m156.9 340-2.3-4.3q-.5-1.1-.8-2.6 1.3-.4 1.1-1.6c.1-2.3.7-2.6 2.9-2.4q2.6.3 5.1 1 .6.2 1.1.7c.8.9 1.8 1.7 1.8 3.1l.1.3q1.3 1.8.4 3.8-.4 1.2-1.3 1.7l-1.4.7q-.7.4-1.6.1a5 5 0 0 0-2.7-.2c-.8.2-1.7-.2-2.4-.3m12.8 146.9q-1.4-1.1-1-3.2l-.1-.8q-.2-1.1-.2-2.3c.4-2.3 1-4.4 2.9-6q1.8-1.3 4-1.3c.9-.1 1.5.8 2 1.6q.8 1.4 1.3 2.9.4 1.2-.5 2-1 .7-.8 1.9.1.7-.7 1.1-.8.6-1.2 1.6-.4 1.3-1.5 1.8-.4.4-1 .6l-1.3.3zm-31.6-119.5.3 1.3q-.4.1-.6.4c-.7 1.6-2.1 1.4-3.4 1.4h-1.1q-2 .4-3.6-.8-1.6-1-1.2-2.9l.1-.5q-.2-1.4 1-2c-.2-.9-1-.5-1.5-.7q-.4-.8.5-.8l.9.3.1-.3-1-.7 1.5-1 .5-.5c.5-1.2.8-1.2 2.2-1 .2.4-.1.7.6 1.1q1.2.7 1.2 2.3 0 .4.4.6l2.6 1.1c.5.2 1.3.3 1.4.9q.2 1-.9 1.8m70.1 119.9c.7-.7.2-1.5 0-2.3q-.5-2.2.5-4.3l.2-.3q.4-1.6 1.9-2.2l1.9 1 .2.1c1.1.4.6 1.9 1.5 2.3 1.2.5 1 1.5 1.1 2.4l.2 2.5c-.1 2.1-1.4 3.4-3.1 4.3-1.3.7-3.2-.5-3.6-1.6zM242 467c1.6-.2 1.8 1.2 2.3 2q.4 1 .6 2.1.3 2.1-1.4 3.2-1.3.8-3.1.6c-1.8-.2-2.4-1.4-3.1-2.6l-.7-1.8c-.2-.6-.7-1.3 0-1.9v-2q.2-1.4 1.6-1.7l1.1-.4q1.1-.3 1.6.6.3.5.9.6 1 .4.2 1.4zm-34.9-134.2 3.3-.6c1.3-.2 2.2.6 3.2 1.4-.1.7-.5 1.6-.3 2.2.4 1.3-.2 2.1-.8 3.1q-.3.9-.4 1.9l-.4 1.3q-.7 1.8-2.5 1.1l-1.1-.2-1.4-3.8a3 3 0 0 1 .1-2.3q.4-1 .1-2.1-.1-.8.2-2m25.7 24.9-.4-.7c.8-1.1 2-.9 3.1-.9q.7 0 1.3.6l1.5 1.2q.6.6.3 1.4l-.3 1.5q-.1 1.2-1.2 1.7-.9.4-1.3 1.4-.8 2-3.2 1.6c-.6-.1-1.1.2-1.7-.4-.7-.6-.7-1.5-.9-2.2-.4-1.5.5-2.6 1.4-3.7l.5-.2-.6-.2q-.1-.6 1.5-1.1";
