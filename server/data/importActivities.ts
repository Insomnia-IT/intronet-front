import "@cmmn/cell";
import { Fn } from "@cmmn/core";
import { Database } from "../database";
import { dbCtrl } from "../db-ctrl";

import events from "./events.json" assert { "type": "json" };
import { getDay, getTime } from "./importMovies";

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

  const activities = events.places.flatMap((place) => {
    const location = locations.find(
      (x) => escape(x.name) === escape(place.placeName ?? "")
    );

    if (!location) {
      console.error(`Not found: ${place.placeName}`);
    }
    return place.placeEvents.map((activity) => {
      return {
        _id: Fn.ulid(),
        version: Fn.ulid(),
        locationId: location?._id,
        title: activity.eventTitle,
        description: activity.eventDescription,
        start: getTime(activity.eventStart * 1000),
        end: getTime(activity.eventEnd * 1000),
        authors: activity.eventParticipants.map((p) => ({
          name: p.participantName,
          description: p.participantBio,
          photo: p.participantPhoto.full,
        })),
        day: getDay(activity.eventStart * 1000),
      } as Activity;
    });
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
