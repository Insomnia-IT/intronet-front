import "./polyfill";
import {render} from "preact";
import { App } from "./app/app";
import {LogoContainer} from "./pages/main/mainPage";
import {EventListener} from "@cmmn/cell/lib";

window.addEventListener('init', async () => {
  await waitEyeAnimation();
  LogoContainer.logo = document.getElementById('logo');
  const container = document.getElementById("root");
  render(<App />, container);
  document.getElementById("start").remove();
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

async function waitEyeAnimation(){
  const svgEye = document.getElementById('eye');
  const anim = svgEye.querySelector('animate');
  await new EventListener<{repeatEvent: void;}>(anim).onceAsync('repeatEvent');
  svgEye.querySelectorAll('animate').forEach(x => x.setAttribute('repeatCount', '1'));
  const eyeChild = Array.from(svgEye.children);
  const glaz3 = await fetch('/public/images/glaz3.svg').then(x => x.text());
  const div = document.createElement('div');
  div.innerHTML = glaz3;
  const svg = div.querySelector('svg');
  document.querySelector('#start').appendChild(svg);
  document.querySelector('#eye').remove();
  svg.setAttribute('fill', 'white');
  eyeChild.forEach(x => {
    svg.append(x);
    x.querySelector('animate').setAttribute('repeatCount', '0.125')
    x.querySelector('animate').setAttribute('dur', '2s')
  });
  const eyeOpen = svg.querySelector('#eye-open');
  eyeOpen.setAttribute('fill','#0C1035');
  eyeOpen.setAttribute('transform', 'scale(0.8) translate(37, 49)');
  svg.querySelector('#circle').setAttribute('fill','white');
  await new EventListener<{endEvent: void;}>(svg.querySelector('#lights animate')).onceAsync('endEvent');
}
