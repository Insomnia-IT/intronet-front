import { Fn, cell, Cell } from "@cmmn/cell/lib";
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
    const duplicate = moviesStore.Movies.find(x => x !== this.block
      && x.info.Title?.trim() === this.block.info.Title?.trim()
      && x.info.SubTitle?.trim() === this.block.info.SubTitle?.trim()
      && x.info.Part === this.block.info.Part
    );
    if (!duplicate) return undefined;
    const isAfter = duplicate.day > this.block.day;
    if (isAfter){
      return `Покажем этот блок ещё раз в ${duplicate.day} в ${duplicate.info.Start} на ${duplicate.locationId}`;
    }
    return `Этот блок шёл в ${duplicate.day} в ${duplicate.info.Start} на ${duplicate.locationId}`;
  }

  public state = new Cell(() => ({
      block: this.block,
      duplicate: this.duplicate
  }));

}
