import "@cmmn/cell/lib";
import {Fn} from "@cmmn/cell/lib";
import * as console from "console";
import { writeFileSync } from "fs";
import fetch from "node-fetch";
import {Database} from "../database";
import {dbCtrl} from "../db-ctrl";
import moviesXLS from "./movies.json" assert {"type": "json"};

export async function importMovies(force = false) {
  const locationsDb = new Database<any>("locations");
  const locations = await locationsDb.getSince();
  if (locations.length == 0) return;
  const moviesDB = new Database<any>("movies");
  const movies = await moviesDB.getSince();
  // console.log(movies);
  if (movies.length != 0) {
    if (!force) return;
    for (let movie of movies) {
      await moviesDB.remove(movie._id);
    }
  }
  const moviesJSON: Schedule = await fetch('https://insomniafest.ru/export/schedule').then(x => x.json()).catch(() => null);
  if (!moviesJSON){
    console.error('cannot load');
    return;
  }
  const screenNameMap = {
    'Полевой Экран (ЦУЭ 1)': locations.filter(x => x.directionId == 'Экран').find(x => x.name?.toLowerCase().includes('полевой'))?._id,
    'Полевой экран': locations.filter(x => x.directionId == 'Экран').find(x => x.name?.toLowerCase().includes('полевой'))?._id,
    'Речной Экран (ЦУЭ 2)': locations.filter(x => x.directionId == 'Экран').find(x => x.name?.toLowerCase().includes('речной'))?._id,
    'Речной экран': locations.filter(x => x.directionId == 'Экран').find(x => x.name?.toLowerCase().includes('речной'))?._id,
    'Детский экран': locations.filter(x => x.directionId == 'Экран').find(x => x.name?.toLowerCase().includes('детский'))?._id,
  };
  const blocksXls = moviesXLS
      .flatMap(x => x.Blocks.map(b => ({
        block: b,
        day: x.Day,
        locationId: screenNameMap[x.Screen],
        start: b.Start,
        end: b.End
      }))).filter(x => x);
  const blocks = Array.from(
    moviesJSON
      .flatMap((x) =>
        x.screenPrograms.map((b) => ({
          block: b,
          day: getDay(toMoscow(b.programStart*1000)),
          start: getTime(toMoscow(b.programStart*1000)),
          end: getTime(toMoscow(b.programEnd*1000)),
          locationId: screenNameMap[x.screenName],
          programStart: b.programStart
        }))
      )
      .groupBy((x) => `${x.block.programTitle}`)
      .values()
  );
  writeFileSync('./movies_api.json', JSON.stringify(moviesJSON), 'utf-8')
  const results = [] as Array<MovieBlock>;
  for (let x of blocks) {
    const title = x[0].block.programTitle;
    const en = title.match(/.*\((.*)\)/)?.[1]?.match(/(.*)[,.\s]*part\s+(\d*)/i) ?? [];
    const ru = title.match(/(.*)\((.*)\)/)?.[1]?.match(/(.*)[,.\s]*часть\s+(\d*)/i) ?? [];
    const xlsx = blocksXls.filter(b =>
      b.day == x[0].day
      && b.locationId == x[0].locationId
      && b.start == x[0].start
      && b.end == x[0].end
    );
    if (xlsx.length !== 1){
      console.log('error mapping movies', x[0], xlsx);
      continue;
    }
    const block: MovieBlock = {
      _id: Fn.ulid(),
      views: x.map(b => ({
        locationId: b.locationId,
        day: b.day,
        start: b.start,
        end: b.end
      })),
      info: xlsx[0].block ? {
        Title: xlsx[0].block.Title,
        SubTitle: xlsx[0].block.SubTitle,
        TitleEn: xlsx[0].block.TitleEn,
        SubTitleEn: xlsx[0].block.SubTitleEn,
        MinAge: xlsx[0].block.MinAge,
        Part: xlsx[0].block.Part,
      } : {
        Title: ru[1] ?? title,
        TitleEn: en[1],
        MinAge: x[0].block.programAge,
        Part: en[2] ?? ru[2],
      },
      movies: []
    } as any;
    for (let i = 0; i < x[0].block.programFilms.length; i++){
      let f = x[0].block.programFilms[i];
      const xls = xlsx[0].block.Movies[i];
      const movie: MovieInfo = {
        id: Fn.ulid(),
        name: xls.Name ?? f.title,
        author: xls.Author,
        country: xls.Country,
        year: xls.Year,
        duration: xls.Duration,
        image: f.image,
        description: f.plot,
        vurchelId: f.vurchelID?.toString()
      } as any;
      block.movies.push(movie);
    }
    results.push(block);
  }
  //
  for (let movie of results) {
    await moviesDB.addOrUpdate({
      ...movie,
      version: Fn.ulid(),
    });
  }
  dbCtrl.versions = undefined;
}

export type Schedule = Screen[];

export interface Screen {
  screenName: string;
  screenPrograms: ScreenProgram[];
}

export interface ScreenProgram {
  programTitle: string;
  programAge: string;
  programStart: number;
  programEnd: number;
  programFilms: ProgramFilm[];
}

export interface ProgramFilm {
  title: string;
  plot: string | null;
  image: string | null;
  vurchelID: number | null;
}


export function getDay(local: number): number {
  const day = (new Date(local - 12*60*60*1000).getDay() + 3) % 7; // четверг = 0
  if (day > 4) return 0;
  return day;
}

export function getTime(local: number): string{
  const date = new Date(local);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${hour < 10 ?'0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`;
}

function toMoscow(unix: number): number{
  return unix + (new Date().getTimezoneOffset()+3*60)*60000;
}
