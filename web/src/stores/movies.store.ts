import { Fn, DeepPartial, distinct } from "@cmmn/core";
import { cell, Cell } from "@cmmn/cell";
import { changesStore } from "./changes.store";
import { ObservableDB } from "./observableDB";
import { locationsStore } from "./locations.store";
import {
  getCurrentDay,
  getDayText,
  getTime,
  getTimeComparable,
} from "../helpers/getDayText";
import { bookmarksStore } from "./bookmarks.store";
import { votingStore } from "./votingStore";

class MoviesStore {
  @cell public db = new ObservableDB<MovieBlock>("movies");
  @cell private vurchelDB = new ObservableDB<VurchelFilm>("vurchel");

  IsLoaded = this.db.isLoaded && this.vurchelDB.isLoaded;

  @cell
  public get MovieBlocks(): MovieBlock[] {
    return this.db.toArray().map((b) => ({
      _id: b._id,
      info: Fn.deepAssign({}, b.info, this.patches.get(b._id) ?? {}),
      views: b.views.map((view, index) =>
        changesStore.withChanges(view, `${b._id}.${index}`)
      ),
      movies: b.movies.map((m) => {
        const info = this.vurchelDB.get(m.vurchelId?.toString());
        if (!info)
          return m;
        return {
          ...m,
          name: m.name ?? info.filmOrigTitle ?? info.filmEnTitle,
          description: m.plot ?? info.filmEnPlot,
          country: info.countries.join(", ") || "",
          author: info.credits
              .flatMap((x) => x.directors.map((d) => d.name))
              .filter((x) => x)
              .join(", "),
        };
      }),
    }));
  }

  @cell
  public get Movies(): MovieInfo[] {
    return distinct(
      this.MovieBlocks.flatMap((x) => x.movies),
      (x) => x.id
    );
  }

  @cell
  public get VotingMovies(): MovieInfo[] {
    return distinct(
      this.MovieBlocks.filter(
        (x) =>
          x.info.Title.toLowerCase().includes(
          "национальный конкурс"
        ) || x.info.Title.toLowerCase().includes(
          "национального конкурса"
        )
      ).flatMap((x) => x.movies)
    );
  }

  getCurrentMovieBlock(id: string) {
    let time = getTimeComparable(getTime(new Date()));
    const block = this.MovieBlocks.filter((x) =>
      x.views.some(
        (v) =>
          v.day === getCurrentDay() &&
          v.locationId == id &&
          getTimeComparable(v.start) <= time &&
          getTimeComparable(v.end) >= time
      )
    )[0];
    if (!block) return undefined;
    return block.info.Title + "\n" + (block.info.SubTitle ?? "");
  }

  @cell
  private patches = new Map<string, DeepPartial<MovieBlock["info"]>>();

  public patchBlockInfo(_id: string, patch: DeepPartial<MovieBlock["info"]>) {
    this.patches = new Map([
      ...this.patches.entries(),
      [_id, Fn.deepAssign({}, this.patches.get(_id) ?? {}, patch)],
    ]);
  }

  public async applyChanges() {
    for (let _id of this.patches.keys()) {
      const block = this.MovieBlocks.find((x) => x._id === _id);
      await this.db.addOrUpdate(block);
    }
    this.discardChanges();
  }

  public discardChanges() {
    this.patches = new Map();
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
    const screen = locationsStore.getName(duplicate.locationId);
    const screenAt = ((screen) => {
      if (!screen) return "";
      console.log(screen);
      if (screen.toLowerCase().includes("поле")) return "Полевом экране";
      if (screen.toLowerCase().includes("речн")) return "Речном экране";
      if (screen.toLowerCase().includes("детск")) return "Дестком экране";
      return "Марсе";
    })(screen);
    if (isAfter) {
      return `Покажем этот блок ещё раз ${getDayText(duplicate.day, "at")} в ${
        duplicate.start
      } на ${screenAt}`;
    }
    return `Этот блок шёл ${getDayText(duplicate.day, "at")} в ${
      duplicate.start
    } на ${screenAt}`;
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

  @cell get movie(): MovieInfo {
    return moviesStore.MovieBlocks.flatMap((x) => x.movies).find(
      (x) => x.id == this.id
    );
  }

  get blocks(): MovieBlock[] {
    return moviesStore.MovieBlocks.filter((x) =>
      x.movies.some((m) => m.id == this.id)
    );
  }

  public state = new Cell<{
    movie: MovieInfo;
    hasBookmark: boolean;
    canVote: boolean;
    views: Array<MovieBlock["views"][number] & { block: MovieBlock }>;
  }>(() => ({
    canVote:
      votingStore.state.get().canVote &&
      moviesStore.VotingMovies.includes(this.movie),
    movie: this.movie,
    views: this.blocks.flatMap((x) => x.views.map((v) => ({ ...v, block: x }))),
    hasBookmark: !!bookmarksStore.getBookmark("movie", this.movie?.id),
  }));
}
