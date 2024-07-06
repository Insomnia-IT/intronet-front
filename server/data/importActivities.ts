import "@cmmn/cell";
import { Fn } from "@cmmn/core";
import { Database } from "../database";
import { dbCtrl } from "../db-ctrl";

import activitiesFromNotion from "./activities/activities2024.json" assert { "type": "json" };

export async function importActivities(force = false) {
  const locationDB = Database.Get<any>("locations");
  const locations = (await locationDB.getSince()).filter((x) => !x.deleted);

  if (locations.length == 0) return;

  const activitiesDB = Database.Get<any>("activities");
  const activitiesInDB = await activitiesDB.getSince();

  if (activitiesInDB.length != 0) {
    if (!force) return;
    for (let activity of activitiesInDB) {
      await activitiesDB.remove(activity._id);
    }
  }

  const activities = activitiesFromNotion.map((activity) => {
    const location = locations.find(
      (x) => escape(x.name) === escape(activity.location ?? '')
    );

    if (!location) {
      console.error(`Not found: ${activity.location}`);
    }

    return {
      _id: Fn.ulid(),
        version: Fn.ulid(),
      locationId: location?._id ?? activity.location,
    ...activity
    }
  });

  for (let item of activities) {
    await activitiesDB.addOrUpdate(item as any);
  }

  dbCtrl.versions = undefined;
}

const regexOnlyWord = /[^a-zA-Zа-яА-ЯёЁ]/g;
const escape = (text) =>
  text
    .trim()
    .replace(/\s/g, "")
    .replace(regexOnlyWord, "")
    .replace(/ё/g, "е")
    .toLowerCase();
