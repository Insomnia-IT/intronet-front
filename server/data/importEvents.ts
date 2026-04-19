import "@cmmn/cell";
import fs from "fs";
import console from "console";
import {Schedule} from "./importMovies";

export async function importEvents() {
  const programJSON = await fetch('https://insomniafest.ru/export/program/2025')
    .then(x => x.json()).catch(() => null) as Schedule;
  fs.writeFileSync('./data/events.json', JSON.stringify(programJSON), 'utf8');
  if (!programJSON) {
    console.error('cannot load');
    return;
  }
}
