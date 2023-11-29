import "@cmmn/cell";
import { Fn } from "@cmmn/core";
import fetch from "node-fetch";
import { Database } from "../database";
import { dbCtrl } from "../db-ctrl";
import json from "./vurchel.json" assert { "type": "json" };

const importFromVurchel = false;
export async function importVurchel(force = false) {
  const vurchelDB = new Database<any>("vurchel");
  const films = await vurchelDB.getSince();
  // console.log(movies);
  // writeFileSync('./vurchel.json', JSON.stringify(films), 'utf-8')
  if (films.length != 0) {
    if (!force) return;
    for (let movie of films) {
      await vurchelDB.remove(movie._id);
    }
  }
  if (importFromVurchel) {
    const moviesDB = new Database<MovieBlock>("movies");
    const movies = await moviesDB.getSince();
    for (let movie of movies.flatMap((x) => x.movies)) {
      if (!movie.vurchelId) {
        continue;
      }
      const info: VurchelFilm = await fetch(
        `https://vurchel.com/export/filminfo/${movie.vurchelId}`
      )
        .then((x) => x.json())
        .catch(() => null);
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (!info) continue;
      await vurchelDB.addOrUpdate({
        _id: info.entryID.toString(),
        version: Fn.ulid(),
        ...info,
      });
    }
  } else {
    for (let item of json) {
      await vurchelDB.addOrUpdate(item as any);
    }
  }
  dbCtrl.versions = undefined;
}
