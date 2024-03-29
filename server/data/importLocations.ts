import { Fn } from "@cmmn/core";
import fetch from "node-fetch";
import { Database } from "../database";
import { dbCtrl } from "../db-ctrl";
import locationsJSON from "./locations.json" assert { "type": "json" };
import notionLocationsJSON from "./notion/locations.json" assert { "type": "json" };
import contentBlocks from "./location-blocks.json" assert { "type": "json" };
import * as process from "process";

export async function importLocations(force = false) {
  const regexOnlyWord = /[^a-zA-Zа-яА-ЯёЁ]/g;
  const escape = (text) =>
    text
      .trim()
      .replace(/\s/g, "")
      .replace(regexOnlyWord, "")
      .replace(/ё/g, "е")
      .toLowerCase();
  const notionLocations: Array<{
    uuid: string;
    name: string;
    map_name: string;
    description: string;
    tags: string[];
    work_tags: string[];
    menu: string;
    directionId: string;
  }> = process.env.NOTION_API
    ? await fetch(`${process.env.NOTION_API}/api/v1/intranet/locations`, {
        headers: {
          Authorization: "Basic YWRtaW46YWRtaW4=",
        },
      }).then((x) => x.json())
    : notionLocationsJSON as any;
  // fs.writeFileSync('./server/data/notion-locations.csv', `
  //   ${Object.keys(notionLocations[0]).join('\t')}
  //   ${notionLocations.map(x => Object.values(x).map(x => typeof x === "object" ? JSON.stringify(x) : x).join('\t')).join('\n')}
  // `, "utf-8")

  const db = Database.Get("locations");
  const existed = await db.getSince();

  if (existed.length != 0) {
    if (!force) return;
    for (let insomniaLocation of existed) {
      await db.remove(insomniaLocation._id);
    }
  }
  const notMatched = [];
  const data = locationsJSON.features.flatMap((x) => {
    const figure =
      x.geometry.type == "Point"
        ? {
            lat: x.geometry.coordinates[1] as number,
            lon: x.geometry.coordinates[0] as number,
          }
        : x.geometry.type == "LineString"
        ? (x.geometry.coordinates as number[][]).map((x) => ({
            lat: x[1],
            lon: x[0],
          }))
        : (x.geometry.coordinates as number[][][]).map((arr) =>
            arr.map((x) => ({ lat: x[1], lon: x[0] }))
          );
    // const mapping = locationsMapping.find(m =>
    //   m.gmaps.replace(regexOnlyWord, '') === x.properties.name.replace(regexOnlyWord, ''));
    function readGoogleMapsName(name: string) {
      if (name.includes("детский сад")) return "Детский Сад";
      if (name.includes("малый шатер")) return "Малый шатер мастер-классов";
      if (name.includes("большой шатер")) return "Большой шатер мастер-классов";
      if (name.includes("шамбала")) return "Шамбала №3";
      if (name.includes("парус")) return "Тент “Парус”";
      if (name.includes("луна") && name.includes("арт"))
        return "Арт-объект Луна";
      if (name.includes("тауматроп")) return "Тауматроп";
      if (name.startsWith("wc")) return "WC";
      if (name.includes("экран")) {
        if (name.includes("речной")) return "Речной экран";
        if (name.includes("полевой")) return "Полевой экран";
      }
      return name;
    }
    function readNotionName(name: string) {
      if (name.includes("детский сад")) return "Детский Сад";
      if (name.includes("глаз да глаз")) return "Детское кафе “Глаз да глаз”";
      if (name.includes("луна") && name.includes("арт"))
        return "Арт-объект Луна";
      if (name.includes("тауматроп")) return "Тауматроп";
      return name;
    }
    const notionName = escape(readGoogleMapsName(x.properties.name.toLowerCase()));
    const notionLoc = notionLocations.find(
      (n) =>
        escape(readNotionName(n.name.toLowerCase())) === notionName ||
        (n.map_name &&
          escape(readNotionName(n.map_name.toLowerCase())) === notionName)
    );
    const name = getName(notionLoc?.name ?? x.properties.name);
    if (Array.isArray(figure) && !enabledFigures.some(x => x.test(name))){
      return [];
    }
    if (Array.isArray(figure))
      console.log(name)
    if (!notionLoc) {
      notMatched.push(x.properties.name);
      return [];
    }
    function getName(name: string) {
      if (name.toLowerCase().includes("детская поляна."))
        return name.substring("детская поляна.".length);
      if (name.toLowerCase().includes("музыкальная"))
        return "Музыкальная сцена";
      if (name.toLowerCase().includes("затмение."))
        return name.substring("затмение.".length);
      if (name.toLowerCase().includes("цуэ")) {
        if (name.toLowerCase().includes("полевой")) return "Полевой экран";
        if (name.toLowerCase().includes("детский")) return "Детский экран";
        if (name.toLowerCase().includes("речной")) return "Речной экран";
      }
      return name;
    }
    const contentBlock = notionLoc?.uuid
      ? contentBlocks.find((x) => x.notionId === notionLoc?.uuid)
      : null;
    // console.log(notionLoc?.description || (contentBlock?.description ?? ""));
    return [
      {
        _id: Fn.ulid(),
        directionId: notionLoc?.directionId,
        notionId: notionLoc?.uuid,
        name,
        tags: notionLoc?.tags ?? [],
        description:
          notionLoc?.description || (contentBlock?.description ?? ""),
        figure,
        menu: notionLoc?.menu,
        work_tags: contentBlock?.work_tags,
        contentBlocks: contentBlock?.contentBlocks ?? [],
        // ...geo,
        // x: point.X,
        // y: point.Y,
      },
    ];
  });
  // console.log(
  //   notMatched.join("\n"),
  //   "\n-------------------\n",
  //   notionLocations
  //     .filter((x) => !data.some((y) => y.name === x.name))
  //     .map((x) => `${x.map_name}(${x.name})`)
  //     .join("\n")
  // );
  for (let loc of data) {
    await db.addOrUpdate({ ...loc, version: Fn.ulid() });
  }
  dbCtrl.versions = undefined;
}

const enabledFigures = [
  /Северо-Восток/g,
  /Северный\sгород/g,
  /Лагерь\sДетской/g,
];
