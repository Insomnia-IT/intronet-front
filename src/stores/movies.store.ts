import { Fn, cell, Cell } from "@cmmn/cell/lib";
import { ObservableDB } from "./observableDB";
import { locationsStore } from "@stores/locations.store";
import { getCurrentDay, getDayText } from "@helpers/getDayText";

class MoviesStore {
  @cell
  db = new ObservableDB<MovieBlock>("movies");

  IsLoaded = this.db.isLoaded;

  public get Movies(): MovieBlock[] {
    return this.db.toArray();
  }
}

export const moviesStore = new MoviesStore();

export class MovieBlockStore {
  constructor(public id: string) {}

  get block() {
    return moviesStore.Movies.find((x) => x._id == this.id);
  }

  get changes() {
    return [];
  }

  get duplicate() {
    const duplicate = moviesStore.Movies.find(
      (x) =>
        x !== this.block &&
        x.info.Title?.trim() === this.block.info.Title?.trim() &&
        x.info.SubTitle?.trim() === this.block.info.SubTitle?.trim() &&
        x.info.Part === this.block.info.Part
    );
    if (!duplicate) return undefined;
    const isAfter = duplicate.day >= getCurrentDay();
    const screen =
      locationsStore
        .getName(duplicate.locationId)
        .toLowerCase()
        .replace("ой", "ом") + "е";
    if (isAfter) {
      return `Покажем этот блок ещё раз ${getDayText(duplicate.day, "at")} в ${
        duplicate.info.Start
      } на ${screen}`;
    }
    return `Этот блок шёл ${getDayText(duplicate.day, "at")} в ${
      duplicate.info.Start
    } на ${screen}`;
  }

  public state = new Cell(() => ({
    block: this.block,
    duplicate: this.duplicate,
  }));
}

export class MovieStore {
  constructor(private id: string) {}

  @cell
  get movie(): MovieInfo {
    return moviesStore.Movies.flatMap((x) => x.movies).find(
      (x) => x.id == this.id
    );
  }

  @cell
  get blocks(): MovieBlock[] {
    return moviesStore.Movies.filter((x) =>
      x.movies.some((x) => x.name == this.movie.name)
    );
  }

  public state = new Cell(() => ({
    movie: this.movie,
    blocks: this.blocks,
  }));
}
