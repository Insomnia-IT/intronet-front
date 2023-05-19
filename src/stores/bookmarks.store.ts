import { cell, Fn, ObservableList, Cell, compare } from "@cmmn/cell/lib";
import { ObservableDB } from "@stores/observableDB";
import { moviesStore } from "@stores/movies.store";
import { TimerCell } from "@stores/timer";

class BookmarksStore {
  constructor() {
    setInterval(() => {
      const time = +new Date() - 1000 * 3;
      for (let item of this.history.toArray()) {
        if (+item.time < time) {
          this.history.remove(item);
        }
      }
    }, 100);
  }

  @cell
  private db = new ObservableDB<Bookmark>("bookmarks", true);

  @cell
  public history = new ObservableList<{
    time: Date;
    action: "add" | "delete";
    type: Bookmark["type"];
    id: string;
  }>();

  public lastHistory = new Cell(
    () => {
      if (this.history.length === 0) return [];
      const arr = this.history.toArray();
      const last = arr[arr.length - 1];
      return arr
        .filter((x) => x.action === last.action)
        .filter((x) => x.type === last.type);
    },
    { compare }
  );

  @cell
  public get Movies() {
    return this.db
      .toArray()
      .filter((x) => x.type == "movie")
      .map((m) => moviesStore.Movies.find((x) => x.id == m.itemId))
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
      this.history.push({
        type,
        action: "delete",
        time: new Date(),
        id,
      });
    this.db.remove(exist._id);
  }
  public async switchBookmark(
    type: Bookmark["type"],
    id: string,
    skipHistory = false
  ) {
    const exist = await this.getBookmark(type, id);
    if (exist) {
      !skipHistory &&
        this.history.push({
          type,
          action: "delete",
          time: new Date(),
          id,
        });
      this.db.remove(exist._id);
    } else {
      !skipHistory &&
        this.history.push({
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
      this.history.push({
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
