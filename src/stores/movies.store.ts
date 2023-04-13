import { Fn, cell, Cell } from "@cmmn/cell/lib";
import { ObservableDB } from "./observableDB";
import { locationsStore } from "@stores/locations.store";
import { getCurrentDay, getDayText } from "@helpers/getDayText";
import { bookmarksStore } from "@stores/bookmarks.store";

class MoviesStore {
  @cell
  db = new ObservableDB<MovieBlock>("movies");

  IsLoaded = this.db.isLoaded;

  @cell
  public get MovieBlocks(): MovieBlock[] {
    return this.db.toArray();
  }

  @cell
  public get Movies(): MovieInfo[] {
    return this.MovieBlocks.flatMap((x) => x.movies);
  }
}

export const moviesStore = new MoviesStore();
globalThis["moviesStore"] = moviesStore;
export class MovieBlockStore {
  constructor(
    public id: string,
    public day: number,
    public locationId: string
  ) {}

  get block() {
    return moviesStore.MovieBlocks.find((x) => x._id == this.id);
  }

  get changes() {
    return [];
  }

  get duplicate() {
    const duplicate = this.block.views.find(
      (x) => x.day !== this.day || x.locationId !== this.locationId
    );
    if (!duplicate) return undefined;
    const isAfter = duplicate.day >= getCurrentDay();
    const screen =
      locationsStore
        .getName(duplicate.locationId)
        ?.toLowerCase()
        .replace("ой", "ом") + "е";
    if (isAfter) {
      return `Покажем этот блок ещё раз ${getDayText(duplicate.day, "at")} в ${
        duplicate.start
      } на ${screen}`;
    }
    return `Этот блок шёл ${getDayText(duplicate.day, "at")} в ${
      duplicate.start
    } на ${screen}`;
  }

  public state = new Cell(() => ({
    block: this.block,
    duplicate: this.duplicate,
    view: this.block.views.find(
      (x) => x.day == this.day && x.locationId == this.locationId
    ),
  }));
}

export class MovieStore {
  constructor(private id: string) {}

  @cell
  get movie(): MovieInfo {
    return moviesStore.MovieBlocks.flatMap((x) => x.movies).find(
      (x) => x.id == this.id
    );
  }

  @cell
  get block(): MovieBlock {
    return moviesStore.MovieBlocks.find((x) =>
      x.movies.some((x) => x.name == this.movie.name)
    );
  }

  public state = new Cell<{
    movie: MovieInfo;
    block: MovieBlock;
    hasBookmark: boolean;
  }>(() => ({
    movie: this.movie,
    block: this.block,
    hasBookmark: !!bookmarksStore.getBookmark("movie", this.movie?.id),
  }));
}
