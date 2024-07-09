import { changesStore } from "../changes.store";
import { ObservableDB } from "../observableDB";
import { cell, Cell } from "@cmmn/cell";
import { bookmarksStore } from "../bookmarks.store";
import {
  getCurrentDay,
  getTime,
  getTimeComparable,
  parseTime,
} from "../../helpers/getDayText";

class ActivitiesStore {
  @cell public db = new ObservableDB<Activity>("activities");

  Loading = this.db.isLoaded;

  @cell
  public get Activities(): Activity[] {
    return this.db
      .toArray()
      .map((activity) => ({
        ...activity,
        start: parseTime(activity.start),
        end: parseTime(activity.end),
      }))
      .map((x) => changesStore.withChanges(x, x._id));
  }

  getCurrentActivity(locationId: string) {
    let time = getTimeComparable(getTime(new Date()));
    return this.Activities.filter((x) => x.locationId === locationId)
      .filter((x) => x.day == getCurrentDay())
      .filter(
        (x) =>
          getTimeComparable(x.start) <= time && getTimeComparable(x.end) >= time
      )[0]?.title;
  }

  async updateActivity(activity: Activity) {
    await this.Loading;
    await this.db.addOrUpdate(activity);
  }

  async deleteActivity(activity: Activity) {
    await this.Loading;
    await this.db.remove(activity._id);
  }
}

export const activitiesStore = new ActivitiesStore();
globalThis["activitiesStore"] = activitiesStore;

export class ActivityStore {
  constructor(private id: string) {}

  @cell
  get activity(): Activity {
    return activitiesStore.Activities.find(
      (activity) => activity._id === this.id
    );
  }

  public state = new Cell<{
    activity: Activity;
    hasBookmark: boolean;
  }>(() => ({
    activity: this.activity,
    hasBookmark: !!bookmarksStore.getBookmark("activity", this.activity?._id),
  }));
}
