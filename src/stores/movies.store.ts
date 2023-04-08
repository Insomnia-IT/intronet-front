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

export class MovieBlockStore {
  constructor(public id: string) {
  }

  get block(){
    return moviesStore.Movies.find(x => x._id == this.id)
  }

  get changes(){
    return [];
  }

  get duplicate(){
    return moviesStore.Movies.filter(x => x !== this.block
      && x.info.Title.trim() === this.block.info.Title.trim()
      && x.info.Part === this.block.info.Part
    )
  }

}
