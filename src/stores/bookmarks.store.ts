import { cell, Fn } from "@cmmn/cell/lib";
import { ObservableDB } from "@stores/observableDB";
import { moviesStore } from "@stores/movies.store";

class BookmarksStore {
  @cell
  private db = new ObservableDB<Bookmark>("bookmarks", true);

  @cell
  public get Movies() {
    return this.db
      .toArray()
      .filter((x) => x.type == "movie")
      .map((m) => moviesStore.Movies.find((x) => x.id == m.itemId))
      .filter((x) => x);
  }
  public async removeBookmark(type: Bookmark["type"], id: string) {
    const exist = await this.getBookmark(type, id);
    if (exist) {
      this.db.remove(exist._id);
    } else {
      throw new Error(`Bookmark has not been added`);
    }
  }
  public async switchBookmark(type: Bookmark["type"], id: string) {
    const exist = await this.getBookmark(type, id);
    if (exist) {
      this.db.remove(exist._id);
    } else {
      this.db.addOrUpdate({
        _id: Fn.ulid(),
        type,
        itemId: id,
      });
    }
  }
  public addBookmark(type: Bookmark["type"], id: string) {
    if (this.getBookmark(type, id)) {
      throw new Error(`Bookmark already has been added`);
    }
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
