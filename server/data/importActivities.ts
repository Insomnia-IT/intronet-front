import "@cmmn/cell/lib";
import { Fn } from "@cmmn/cell/lib";
import fetch from "node-fetch";
import { Database } from "../database";
import json from "./activity-v3.json" assert {"type": "json"};
import * as console from "console";

const importFromNotion = true;
export async function importActivities(force = false) {
  const locationDB = new Database<any>("locations");
  const locations = await locationDB.getSince();
  if (locations.length == 0) return;

  const activitiesDB = new Database<any>("activities");
  const activities = await activitiesDB.getSince();

  if (activities.length != 0) {
    if (!force) return;
    for (let activity of activities) {
      await activitiesDB.remove(activity._id);
    }
  }

  if (importFromNotion) {
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

    for (let notion of notionSchedule) {
      const location = locations.find(x => x.name === notion.location);

      console.log(location);

      if (!location){
        console.error(`Not found: ${notion.location}`)
        continue;
      }
      for (let schedule of notion.schedule) {
        for (let auditory of schedule.auditories) {
          for (let activity of auditory.activity) {
            await activitiesDB.addOrUpdate({
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
  } else {
    for (let item of json){
      await activitiesDB.addOrUpdate(item as any);
    }
  }
}
