import { dbCtrl } from "../db-ctrl";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import auth, { GoogleAuth, JWT } from 'google-auth-library';
import process from "node:process";
  import { Database } from "../database";
import { Fn, groupBy } from "@cmmn/core";

export async function importLocations(force = false) {
  const doc = await getDoc();
  await doc.loadInfo(true);
  const mapSheet = doc.sheetsByTitle['гугл карта'];
  const dataSheet = doc.sheetsByTitle['сводочка'];
  // await mapSheet.setHeaderRow([
  //   'id', 'googleName', 'insightName', 'icon', 'descr', 'geometry'
  // ]);
  const mapArray = (await mapSheet.getRows()).map(row => ({
    name: row.get('Название Гугл Карты'),
    figure: geometryToFigure(JSON.parse(row.get('geometry') ?? 'null'))
  }));
  const mapData = groupBy(mapArray, x => x.name);
  console.log(...mapData.entries())
  const data = (await dataSheet.getRows()).flatMap(row => {
    const mapName = row.get('Название Гугл Карты') as string;
    const geo = mapData.get(mapName)?.map(x => x.figure) ?? [];

    const directionId = row.get('directionId') as string;
    const figure: GeoFigure = directionId == 'Зона'
      ? geo.find(Array.isArray)
      : geo.find(x => !Array.isArray(x));
    if (!figure){
      console.error(row.get('Название Insight'));
      return  [];
    }
    return [{
      _id: Fn.ulid(),
      mapName,
      name: row.get('Название Insight') as string,
      description: row.get('Описание') as string,
      figure,
      directionId,
      tags: [],
      work_tags: [],
      priority: row.get('Приоритет') as string,
      details: row.get('Тип деталки') as string,
      groupLink: row.get('Ссылка на группу') as string,
    } as InsomniaLocation];
  });

  const locationsDB = Database.Get<any>("locations");
  const locationsInDB = await locationsDB.getSince();

  if (locationsInDB.length != 0) {
    if (!force) return;
    for (let activity of locationsInDB) {
      await locationsDB.remove(activity._id);
    }
  }

  for (let loc of data) {
    await locationsDB.addOrUpdate({ ...loc, version: Fn.ulid() });
  }
  dbCtrl.versions = undefined;
}

const enabledFigures = [
  /Северо-Восток/g,
  /Северный\sгород/g,
  /Лагерь\sДетской/g,
];


async function getDoc() {
  const privateKeyEnv = process.env.GOOGLE_SHEET_PRIVATE_KEY!;
  if (!privateKeyEnv) {
    throw 'provide GOOGLE_SHEET_PRIVATE_KEY in env';
  }
  let privateKey = '';
  privateKey = '-----BEGIN PRIVATE KEY-----\n';
  for (let i = 0; i < privateKeyEnv.length; i += 64) {
    privateKey += privateKeyEnv.substring(i, i + 64) + '\n';
  }
  privateKey += '-----END PRIVATE KEY-----\n';

  const jwt = new JWT({
    email: process.env.GOOGLE_SHEET_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, jwt);
}

function geometryToFigure(geometry: Array<number> | Array<Array<number>> | Array<Array<Array<number>>>): GeoFigure{
  if (!geometry) return null;
  if (!Array.isArray(geometry[0])){
    const [lon, lat] = geometry as Array<number>;
    return {lat, lon};
  }
  return (geometry as Array<Array<number>> | Array<Array<Array<number>>>).map(geometryToFigure) as GeoFigure;
}
