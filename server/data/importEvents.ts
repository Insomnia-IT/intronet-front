import "@cmmn/cell";
import fs from "fs";
import console from "console";
import {Schedule} from "./importMovies";

export async function importEvents() {
  const moviesJSON = await fetch('https://insomniafest.ru/export/program/2025')
    .then(x => x.json()).catch(() => null) as Schedule;
  fs.writeFileSync('./data/events.json', JSON.stringify(moviesJSON), 'utf8');
  if (!moviesJSON) {
    console.error('cannot load');
    return;
  }
}
