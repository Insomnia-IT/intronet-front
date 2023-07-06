import {Fn} from "@cmmn/cell/lib";
import fetch from "node-fetch";
import {Database} from "../database";
import mainPageJSON from "./main-page.json" assert {type: "json"};

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
