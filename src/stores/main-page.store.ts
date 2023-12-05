import { cell, Cell } from "@cmmn/cell";
import { ObservableDB } from "./observableDB";
import {groupBy, orderBy} from "@cmmn/core";

class MainPageStore {
  @cell
  private db = new ObservableDB<MainPageCard>("main");

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
        const grouped = groupBy(items.filter((x) => x.section === s.section), (x) => x.row) as Map<number, MainPageCard[]>;
        const rows = Array.from(grouped.entries())
          .map(([row, cards]) => ({ row, cards: orderBy(cards, (x) => x.col) }))
        return {
          ...s,
          rows: orderBy(rows, (x) => x.row),
        };
      }),
    };
  });
}

const SectionNames: Record<MainPageCard["section"], string> = {
  about: "О фестивале",
  activity: "как тусим",
  warning: "если чп",
  other: "Тоже важное",
};

const Sections = Object.entries(SectionNames).map(([k, v]) => ({
  section: k as MainPageCard["section"],
  title: v,
}));

export const mainPageStore = new MainPageStore();
