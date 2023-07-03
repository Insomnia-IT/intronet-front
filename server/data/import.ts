import {Fn} from "@cmmn/cell/lib";
import fetch from "node-fetch";
import {Database} from "../database";
import locationsJSON from "./locations.json" assert {type: "json"};
import mainPageJSON from "./main-page.json" assert {type: "json"};

export async function importLocations(force = false){
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
                arr.map((x) => ({ lat: x[1], lon: x[0] }))
              ));
        // const mapping = locationsMapping.find(m =>
        //   m.gmaps.replace(regexOnlyWord, '') === x.properties.name.replace(regexOnlyWord, ''));
        const name =  escape(x.properties.name);
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
            work_tags: notionLoc?.work_tags
            // ...geo,
            // x: point.X,
            // y: point.Y,
          } ,
        ];
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
    await db.addOrUpdate({ ...loc, version: Fn.ulid() });
  }
}

export async function importActivities(force = false){
  const notionSchedule:  {
    "location": "string",
    "schedule": Array<{
      "day": 0,
      "auditories": Array<{
        "number": 0,
        "activity": Array<{
          "name": "string",
          "author": "string",
          "type": "string",
          "start_time": "string",
          "end_time": "string",
          "short_description": "string",
          "description": "string"
        }>
      }>
    }>
  }[] = await fetch(`https://srv.rumyantsev.com/api/v1/intranet/schedules`, {
    headers: {
      Authorization: "Basic YWRtaW46YWRtaW4=",
    },
  }).then(x => x.json());
  const locationDB = new Database<any>("locations");
  const locations = await locationDB.getSince();
  if (locations.length == 0) return;
  const db = new Database<any>("activities");
  const activities = await db.getSince();
  // console.log('_____', activities)
  if (activities.length > 0) {
    if (!force) return;
    for (let activity of activities) {
      await db.remove(activity._id);
    }
  }
  for (let notion of notionSchedule) {
    const location = locations.find(x => x.name === notion.location);
    if (!location){
      console.error(`Not found: ${notion.location}`)
      continue;
    }
    for (let schedule of notion.schedule) {
      for (let auditory of schedule.auditories) {
        for (let activity of auditory.activity) {
          await db.addOrUpdate({
            _id: Fn.ulid(),
            version: Fn.ulid(),
            day: schedule.day,
            start: activity.start_time,
            end: activity.end_time,
            author: activity.author,
            description: activity.description,
            title: activity.name,
            locationId: location._id
          })
        }
      }
    }
  }
}


export async function importMainPage(force = false){

  const db = new Database<any>("main");
  const cards = await db.getSince();
  if (cards.length) {
    if (!force) return;
    for (let card of cards) {
      await db.remove(card._id);
    }
    cards.length = 0;
  }
  // console.log('_____', activities)
  if (cards.length > 0) return;
  for (let card of mainPageJSON as Array<any>){
    await db.addOrUpdate({
      ...card,
      version: Fn.ulid()
    });
  }
}
