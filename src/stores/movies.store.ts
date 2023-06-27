import { Fn, cell, Cell, DeepPartial } from "@cmmn/cell/lib";
import {changesStore} from "./changes.store";
import { ObservableDB } from "./observableDB";
import { locationsStore } from "@stores/locations.store";
import { getCurrentDay, getDayText } from "@helpers/getDayText";
import { bookmarksStore } from "@stores/bookmarks.store";

class MoviesStore {
  @cell
  public db = new ObservableDB<MovieBlock>("movies");

  IsLoaded = this.db.isLoaded;

  @cell
  public get MovieBlocks(): MovieBlock[] {
    return this.db.toArray().map(b => ({
      ...b,
      views: b.views.map((view, index) => changesStore.withChanges(view, `${b._id}.${index}`))
    }));
  }

  @cell
  public get Movies(): MovieInfo[] {
    return this.MovieBlocks.flatMap((x) => x.movies);
  }

  getCurrentMovieBlock(id: string) {
    const block = this.MovieBlocks.filter(x => x.views.some(v => v.day === getCurrentDay() && v.locationId == id))[0];
    if (!block) return undefined;
    return block.info.Title + '\n' + block.info.SubTitle;
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
    movie: {
      ...this.movie,
      description: `Future. A spaceliner from Earth arrives in orbit on an undiscovered planet. A group of hunters, thrill-seekers, disembark from the ship. Life is discovered on the planet’s surface: animals and plants that are caricatures of their Earth counterparts. The frivolous extermination of the local fauna and flora by the earthlings begins.`
    },
    block: this.block,
    hasBookmark: !!bookmarksStore.getBookmark("movie", this.movie?.id),
  }));
}
