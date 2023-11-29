import { cell, Cell } from "@cmmn/cell";
import { ObservableDB } from "./observableDB";

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
      sections: Sections.map((s) => ({
        ...s,
        rows: Array.from(
          items
            .filter((x) => x.section === s.section)
            .groupBy((x) => x.row)
            .entries()
        )
          .map(([row, cards]) => ({ row, cards: cards.orderBy((x) => x.col) }))
          .orderBy((x) => x.row),
      })),
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
