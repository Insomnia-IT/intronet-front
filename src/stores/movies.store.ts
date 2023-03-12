import { Fn, cell } from "@cmmn/cell/lib";
import { ObservableDB } from "./observableDB";

class MoviesStore {
  @cell
  db = new ObservableDB<MovieBlock>("movies");

  IsLoaded = this.db.isLoaded;

  public get Movies(): MovieBlock[] {
    return this.db.toArray();
  }

}

export const moviesStore = new MoviesStore();
