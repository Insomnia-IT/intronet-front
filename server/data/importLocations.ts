import {Fn} from "@cmmn/cell/lib";
import fetch from "node-fetch";
import {Database} from "../database";
import locationsJSON from "./locations.json" assert {"type": "json"};
import contentBlocks from "./location-blocks.json" assert {"type": "json"};

export async function importLocations(force = false) {
  const regexOnlyWord = /[^a-zA-Zа-яА-ЯёЁ]/g;
  const escape = text => text.trim()
    .replace(/\s/g, '')
    .replace(regexOnlyWord, '')
    .replace(/ё/g, 'е')
    .toLowerCase()
  const notionLocations: Array<{
    uuid: string;
    name: string;
    map_name: string;
    description: string;
    tags: string[];
    work_tags: string[];
    menu: string;
    directionId: string;
  }> = await fetch(`https://srv.rumyantsev.com/api/v1/intranet/locations`, {
    headers: {
      Authorization: "Basic YWRtaW46YWRtaW4=",
    },
  }).then((x) => x.json());

  const db = new Database("locations");
  const existed = await db.getSince();

  if (existed.length != 0) {
    if (!force) return;
    for (let insomniaLocation of existed) {
      await db.remove(insomniaLocation._id);
    }
  }
  const notMatched = [];
  const data = locationsJSON.features.flatMap((x) => {
    const figure = x.geometry.type == "Point"
      ? {
        lat: x.geometry.coordinates[1] as number,
        lon: x.geometry.coordinates[0] as number,
      }
      : ((x.geometry.coordinates as number[][][]).map((arr) =>
        arr.map((x) => ({lat: x[1], lon: x[0]}))
      ));
    // const mapping = locationsMapping.find(m =>
    //   m.gmaps.replace(regexOnlyWord, '') === x.properties.name.replace(regexOnlyWord, ''));
    const name = escape(x.properties.name);
    const notionLoc = notionLocations.find(n =>
      (escape(n.name) === name) || (n.map_name && escape(n.map_name) === name)
    );
    if (!!notionLoc === Array.isArray(figure)) {
      notMatched.push(x.properties.name);
      return [];
    }
    return [
      {
        _id: Fn.ulid(),
        directionId: notionLoc?.directionId,
        notionId: notionLoc?.uuid,
        name: notionLoc?.name ?? x.properties.name,
        tags: notionLoc?.tags ?? [],
        description: notionLoc?.description ?? x.properties.description,
        figure,
        menu: notionLoc?.menu,
        work_tags: notionLoc?.work_tags ?? contentBlocks.find(x => x.notionId === notionLoc?.uuid)?.work_tags,
        contentBlocks: notionLoc?.uuid ? contentBlocks.find(x => x.notionId === notionLoc?.uuid)?.contentBlocks ?? [] : [],
        // ...geo,
        // x: point.X,
        // y: point.Y,
      }
    ] ;
  });
  console.log(
    notMatched.join("\n"),
    "\n-------------------\n",
    notionLocations
      .filter((x) => !data.some((y) => y.name === x.name))
      .map((x) => x.map_name || x.name)
      .join("\n")
  );
  for (let loc of data) {
    await db.addOrUpdate({...loc, version: Fn.ulid()});
  }
}
