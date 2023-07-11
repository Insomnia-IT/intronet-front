import "@cmmn/cell/lib";
import { Fn } from "@cmmn/cell/lib";
import fs from "fs";
import fetch from "node-fetch";
import { Database } from "../database";
import {dbCtrl} from "../db-ctrl";
import hattifnarium from "./activities/hattifnarium.json" assert {"type": "json"};
import shambala from "./activities/shambala.json" assert {"type": "json"};
import music from "./activities/music-stage.json" assert {"type": "json"};
import child from "./activities/child.json" assert {"type": "json"};
import elStaico from "./activities/el-staico.json" assert {"type": "json"};
import notionActivities from "./notion/activities.json" assert {"type": "json"};

const importFromNotion = false;
export async function importActivities(force = false) {
  const locationDB = new Database<any>("locations");
  const locations = await locationDB.getSince();
  if (locations.length == 0) return;

  const activitiesDB = new Database<any>("activities");
  const activitiesInDB = await activitiesDB.getSince();

  if (activitiesInDB.length != 0) {
    if (!force) return;
    for (let activity of activitiesInDB) {
      await activitiesDB.remove(activity._id);
    }
  }

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
  }[] = importFromNotion ? await fetch(`https://srv.rumyantsev.com/api/v1/intranet/schedules`, {
    headers: {
      Authorization: "Basic YWRtaW46YWRtaW4=",
    },
  }).then(x => x.json()) : notionActivities;
  if (importFromNotion) {
    fs.writeFileSync('./server/data/notion/activities.json', JSON.stringify(notionSchedule), 'utf8')
  }
  const activities = [];

  for (let notion of notionSchedule) {
    const location = locations.find(x => x.name === notion.location);

    if (!location){
      console.error(`Not found: ${notion.location}`)
      continue;
    }
    for (let schedule of notion.schedule) {
      for (let auditory of schedule.auditories) {
        for (let activity of auditory.activity) {
          activities.push({
            _id: Fn.ulid(),
            version: Fn.ulid(),
            day: schedule.day,
            start: activity.start_time,
            end: activity.end_time,
            author: activity.author,
            authorDescription: activity.description,
            description: activity.short_description,
            title: activity.name,
            locationId: location._id
          })
        }
      }
    }
  }

  for (let item of hattifnarium) {
    const location = locations.find(x => x.notionId === item.notionLocationId);

    activities.push({
      ...item,
      _id: Fn.ulid(),
      version: Fn.ulid(),
      locationId: location._id
    })
  }

  for (let item of shambala) {
    const location = locations.find(x => x.notionId === item.notionLocationId);

    activities.push({
      ...item,
      _id: Fn.ulid(),
      version: Fn.ulid(),
      locationId: location._id
    })
  }

  for (let item of music) {
    const location = locations.find(x => x.notionId === item.notionLocationId);

    activities.push({
      ...item,
      _id: Fn.ulid(),
      version: Fn.ulid(),
      locationId: location._id
    })
  }

  for (let item of child) {
    const location = locations.find(x => x.notionId === item.notionLocationId);

    activities.push({
      ...item,
      _id: Fn.ulid(),
      version: Fn.ulid(),
      locationId: location._id
    })
  }

  for (let item of elStaico) {
    const location = locations.find(x => x.notionId === item.notionLocationId);

    activities.push({
      ...item,
      _id: Fn.ulid(),
      version: Fn.ulid(),
      locationId: location._id
    })
  }

  for (let item of activities) {
    await activitiesDB.addOrUpdate(item as any);
  }
  dbCtrl.versions = undefined;

}
