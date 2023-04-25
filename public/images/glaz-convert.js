import fs from "fs";
const glaz = fs.readFileSync("./glaz2.svg", 'utf8');
import {DOMParser, parseHTML} from 'linkedom';

const from = 0.5;
const to = 0.94;

const {document} = parseHTML(glaz);


const anim = document.querySelectorAll('animate,animateMotion,animateTransform');
anim.forEach(convert)
console.log(anim.length);
fs.writeFileSync('./glaz3.svg', document.toString(), "utf8");

function convert(animate){
  animate.setAttribute('dur', '2.8s');
  animate.setAttribute('repeatCount','0.9');
  const keyTimes = animate.getAttribute('keyTimes').split(';');
  const values = animate.getAttribute('values')?.split(';');
  const splines = animate.getAttribute('keySplines')?.split(';');
  const newKeyTimes = keyTimes.map(x => Math.max(0, Math.min(1,(x-from)/(to-from))));
  const oneCount = newKeyTimes.filter(x => x == 1);
  if (oneCount > 1){
    animate.setAttribute('values', values.slice(0, -(oneCount - 1)).join(';'));
    splines && animate.setAttribute('splines', splines.slice(0, -(oneCount - 1)).join(';'));
  }
  animate.setAttribute('keyTimes', newKeyTimes.join(';'));
}
