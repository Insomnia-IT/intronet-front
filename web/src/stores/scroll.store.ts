import { Cell, cell, ObservableMap } from "@cmmn/cell";
import { routerCell } from "../pages/routing";

class ScrollStore {
  constructor() {
    Cell.OnChange(() => this.scrollTops, console.log);
  }
  @cell
  scrollTops = new ObservableMap<string, number>();

  // for each route history should be different
  @cell
  key = new Cell(() => routerCell.get().route.join("/"));
}
export const scrollStore = new ScrollStore();
