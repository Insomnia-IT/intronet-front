import { cell } from "@cmmn/cell/lib";
import { ObservableDB } from "./observableDB";

class MoviesStore {
  @cell
  private db = new ObservableDB<Movie>("movies");

  public get Movies(): Movie[] {
    return this.db.toArray();
  }

  constructor() {
    this.db.isLoaded.then(() => {
      this.load();
    });
  }

  load() {
    Promise.reject<Movie[]>("api not found")
      .catch(
        (x) =>
          [
            {
              title: "Крестный отец",
              author: "Скорсезе",
              id: 1,
            },
            {
              title: "Королевство полной луны",
              author: "Андерсон",
              id: 2,
            },
            {
              title: "Титаник",
              author: "Кэмерон",
              id: 3,
            },
          ] as Movie[]
      )
      .then((x) => this.db.merge(x, "server"));
  }
}

export const moviesStore = new MoviesStore();
