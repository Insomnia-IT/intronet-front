import { dbCtrl } from "../db-ctrl";
import process from "node:process";
import { Database } from "../database";
import { Fn, groupBy } from "@cmmn/core";
import locationsGoogle from "./locations/locations2024google.json" assert { "type": "json" };
import mapJson from "./locations/locations2024.json" assert { "type": "json" };
import fs from "fs";

export async function importLocations(force = false) {
  const locationsDB = Database.Get<any>("locations");
  const locationsInDB = await locationsDB.getSince();

  if (locationsInDB.length != 0) {
    if (!force) return;
    for (let activity of locationsInDB) {
      await locationsDB.remove(activity._id);
    }
  }
  const data = process.env.GOOGLE_SHEET_PRIVATE_KEY
    ? await getLocationsFromGoogleSheet()
    : (locationsGoogle as any);

  for (let loc of data) {
    await locationsDB.addOrUpdate({ ...loc, version: Fn.ulid() });
  }
  dbCtrl.versions = undefined;
}

export async function getLocationsFromGoogleSheet() {
  const doc = await getDoc();
  await doc.loadInfo(true);
  const dataSheet = doc.sheetsByTitle["свод финалка"];
  // await mapSheet.setHeaderRow([
  //   'id', 'googleName', 'insightName', 'icon', 'descr', 'geometry'
  // ]);
  const mapArray = mapJson.features.map((row) => ({
    name: row.properties.name,
    figure: geometryToFigure(
      row.geometry.coordinates ??
        row.geometry.geometries.flatMap((x) => x.coordinates)
    ),
  }));
  const mapData = groupBy(mapArray, (x) => x.name.toLowerCase());
  const data = (await dataSheet.getRows()).flatMap((row) => {
    const mapName = row.get("Название Гугл Карты") as string;
    const geo = mapData.get(mapName.toLowerCase())?.map((x) => x.figure) ?? [];

    const directionId = row.get("directionId") as string;
    const figure: GeoFigure =
      directionId == "Зона"
        ? geo.find(Array.isArray)
        : geo.find((x) => !Array.isArray(x));
    if (!figure) {
      console.error(row.get("Название Insight"));
      return [];
    }
    return [
      {
        _id: Fn.ulid(),
        mapName,
        name: row.get("Название Insight") as string,
        description: row.get("Описание") as string,
        figure,
        directionId,
        tags: [],
        work_tags: [row.get("Капшеринг")].filter((x) => x),
        priority: !!(row.get("Приоритет") as string)?.match(/приоритет/i),
        details: row.get("Тип деталки") as string,
        groupLink: row.get("Ссылка на группу") as string,
      } as InsomniaLocation,
    ];
  });
  fs.writeFileSync(
    "./data/locations/locations2024google.json",
    JSON.stringify(data),
    "utf8"
  );
  return data;
}

const enabledFigures = [
  /Северо-Восток/g,
  /Северный\sгород/g,
  /Лагерь\sДетской/g,
];

async function getDoc() {
  const { GoogleSpreadsheet } = await import("google-spreadsheet");
  const { JWT } = await import("google-auth-library");
  const privateKeyEnv = process.env.GOOGLE_SHEET_PRIVATE_KEY!;
  if (!privateKeyEnv) {
    throw "provide GOOGLE_SHEET_PRIVATE_KEY in env";
  }
  let privateKey = "";
  privateKey = "-----BEGIN PRIVATE KEY-----\n";
  for (let i = 0; i < privateKeyEnv.length; i += 64) {
    privateKey += privateKeyEnv.substring(i, i + 64) + "\n";
  }
  privateKey += "-----END PRIVATE KEY-----\n";

  const jwt = new JWT({
    email: process.env.GOOGLE_SHEET_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, jwt);
}

function geometryToFigure(
  geometry: Array<number> | Array<Array<number>> | Array<Array<Array<number>>>
): GeoFigure {
  if (!geometry) return null;
  if (!Array.isArray(geometry[0])) {
    const [lon, lat] = geometry as Array<number>;
    return { lat, lon };
  }
  return (geometry as Array<Array<number>> | Array<Array<Array<number>>>).map(
    geometryToFigure
  ) as GeoFigure;
}
