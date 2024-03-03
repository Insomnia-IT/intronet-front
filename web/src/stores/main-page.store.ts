import { cell, Cell } from "@cmmn/cell";
import { ObservableDB } from "./observableDB";
import { groupBy, orderBy } from "@cmmn/core";

class MainPageStore {
  @cell
  private db = new ObservableDB<MainPageCard>("main");

  @cell
  private items = this.db.toArray();

  public State = new Cell<{
    sections: {
      section: MainPageCard["section"];
      title: string;
      rows: {
        row: number;
        cards: MainPageCard[];
      }[];
    }[];
  }>(() => {
    const items = this.db.toArray();

    return {
      sections: Sections.map((s) => {
        const grouped = groupBy(
          items.filter((x) => x.section === s.section),
          (x) => x.row
        ) as Map<number, MainPageCard[]>;
        const rows = Array.from(grouped.entries()).map(([row, cards]) => ({
          row,
          cards: orderBy(cards, (x) => x.col),
        }));
        return {
          ...s,
          rows: orderBy(rows, (x) => x.row),
        };
      }),
    };
  });
}
const SectionNames: Record<MainPageCard["section"], string> = {
  main: "",
  about: "О фестивале",
  warning: "если чп",
};

const Sections = (
  ["main", "about", "warning"] as MainPageCard["section"][]
).map((k) => ({
  section: k as MainPageCard["section"],
  title: SectionNames[k],
}));

export const mainPageStore = new MainPageStore();
