import "@cmmn/cell";
import { Fn } from "@cmmn/core";
import fetch from "node-fetch";
import { Database } from "../database";
import { dbCtrl } from "../db-ctrl";
import json from "./vurchel.json" assert { "type": "json" };
import { writeFileSync } from "fs";
import process from "node:process";

export async function importVurchel(force = false) {
  const vurchelDB = Database.Get<any>("vurchel");
  const films = await vurchelDB.getSince();
  // console.log(movies);
  if (films.length != 0) {
    if (!force) return;
    for (let movie of films) {
      await vurchelDB.remove(movie._id);
    }
  }
  if (process.env.IMPORT_VURCHEL) {
    const moviesDB = Database.Get<MovieBlock>("movies");
    const movies = await moviesDB.getSince();
    const vurchelData = [];
    for (let movie of movies.flatMap((x) => x.movies)) {
      console.log(movie.vurchelId, movie.name);
      if (!movie.vurchelId) {
        continue;
      }
      if (json.some((x) => x._id == movie.vurchelId)) continue;
      const info: VurchelFilm = (await fetch(
        `https://vurchel.com/export/filminfo/${movie.vurchelId}`
      )
        .then((x) => x.json())
        .catch(() => null)) as any;
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log(info ? "+" : "-", movie.vurchelId);

      if (!info) continue;
      vurchelData.push({
        _id: info.entryID.toString(),
        version: Fn.ulid(),
        ...info,
      });
      writeFileSync("./vurchel.json", JSON.stringify(vurchelData), "utf-8");
    }

    for (let item of vurchelData) {
      await vurchelDB.addOrUpdate(item as any);
    }
  } else {
    for (let item of json) {
      await vurchelDB.addOrUpdate(item as any);
    }
  }
  dbCtrl.versions = undefined;
}
