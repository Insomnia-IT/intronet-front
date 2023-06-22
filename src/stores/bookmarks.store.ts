import {
  Cell,
  Fn,
  ObservableList,
  cell,
  compare,
  debounced,
} from "@cmmn/cell/lib";
import { moviesStore } from "@stores/movies.store";
import { ObservableDB } from "@stores/observableDB";
import { TimerCell } from "@stores/timer";
import { activitiesStore } from "@stores/activities/activities.store";
import { locationsStore } from "@stores/locations.store";

class BookmarksStore {
  @cell
  private db = new ObservableDB<Bookmark>("bookmarks", true);

  addHistory(item: HistoryItem) {
    const last = this.history.get(this.history.length - 1);
    console.log(last);
    if (last?.action !== item.action || last?.type !== item.type) {
      this.history.clear();
    }
    this.history.push(item);
    this.clearHistory();
  }

  @debounced(3000)
  clearHistory() {
    this.history.clear();
  }
  @cell
  public history = new ObservableList<HistoryItem>();

  public lastHistory = new Cell(() => this.history.toArray().slice(), {
    compare,
  });

  @cell
  public get Movies() {
    return this.db
      .toArray()
      .filter((x) => x.type == "movie")
      .map((m) => moviesStore.Movies.find((x) => x.id == m.itemId))
      .filter((x) => x);
  }

  @cell
  public get Activities() {
    return this.db
      .toArray()
      .filter((x) => x.type == "activity")
      .map((m) => activitiesStore.Activities.find((x) => x._id == m.itemId))
      .filter((x) => x);
  }

  @cell
  public get Locations() {
    return this.db
      .toArray()
      .filter((x) => x.type == "locations")
      .map((m) => locationsStore.Locations.find((x) => x._id == m.itemId))
      .filter((x) => x);
  }

  public async removeBookmark(
    type: Bookmark["type"],
    id: string,
    skipHistory = false
  ) {
    const exist = await this.getBookmark(type, id);
    if (!exist) {
      throw new Error(`Bookmark has not been added`);
    }
    !skipHistory &&
      this.addHistory({
        type,
        action: "delete",
        time: new Date(),
        id,
      });
    this.db.remove(exist._id);
  }

  public switchBookmark(
    type: Bookmark["type"],
    id: string,
    skipHistory = false
  ) {
    const exist = this.getBookmark(type, id);
    if (exist) {
      !skipHistory &&
        this.addHistory({
          type,
          action: "delete",
          time: new Date(),
          id,
        });
      this.db.remove(exist._id);
    } else {
      !skipHistory &&
        this.addHistory({
          type,
          action: "add",
          time: new Date(),
          id,
        });
      this.db.addOrUpdate({
        _id: Fn.ulid(),
        type,
        itemId: id,
      });
    }
  }
  public addBookmark(type: Bookmark["type"], id: string, skipHistory = false) {
    if (this.getBookmark(type, id)) {
      throw new Error(`Bookmark already has been added`);
    }
    !skipHistory &&
      this.addHistory({
        type,
        action: "add",
        time: new Date(),
        id,
      });
    return this.db.addOrUpdate({
      _id: Fn.ulid(),
      type,
      itemId: id,
    });
  }

  getBookmark(type: Bookmark["type"], id: string) {
    return this.db.toArray().find((x) => x.type == type && x.itemId == id);
  }
}
export const bookmarksStore = new BookmarksStore();
export type HistoryItem = {
  time: Date;
  action: "add" | "delete";
  type: Bookmark["type"];
  id: string;
};
