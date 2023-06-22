import {changesStore} from "../changes.store";
import { ObservableDB } from "../observableDB";
import { cell, Cell } from "@cmmn/cell/lib";
import { bookmarksStore } from "@stores/bookmarks.store";
import { parseTime } from "@helpers/getDayText";

class ActivitiesStore {
  @cell
  public db = new ObservableDB<Activity>("activities");

  @cell
  public get Activities(): Activity[] {
    return this.db.toArray().map((activity) => ({
      ...activity,
      start: parseTime(activity.start),
      end: parseTime(activity.end)
    })).map(x => changesStore.withChanges(x, x._id));
  }

}

export const activitiesStore = new ActivitiesStore();
globalThis["activitiesStore"] = activitiesStore;

export class ActivityStore {
  constructor(private id: string) {}

  @cell
  get activity(): Activity {
    return  activitiesStore.Activities.find((activity) => activity._id === this.id);
  }

  public state = new Cell<{
    activity: Activity;
    hasBookmark: boolean;
  }>(() => ({
    activity: this.activity,
    hasBookmark: !!bookmarksStore.getBookmark('activity', this.activity?._id),
  }));
}
