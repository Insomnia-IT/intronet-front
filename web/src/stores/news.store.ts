import { cell, Cell } from "@cmmn/cell";
import { getDay, getDayText, getTime } from "../helpers/getDayText";
import { fromUTC, utc } from "../helpers/utc";
import { ObservableDB } from "./observableDB";
import { Fn, orderBy } from "@cmmn/core";

class NewsStore {
  @cell
  private db = new ObservableDB<NewsItem>("news");

  public State = new Cell(() => {
    const news = this.db.toArray();
    return {
      news: orderBy(news, (x) => x.time, true)
        .map((x) => ({
          ...x,
          time: this.formatTime(x.time),
        })),
    };
  });

  private formatTime(iso: string) {
    const utc = new Date(iso);
    const local = fromUTC(utc);
    const day = getDayText(getDay(+local), "short").toUpperCase();
    return `${day} ${getTime(local)}`;
  }

  public async add() {
    if (!this.isAddNewsValid) return;
    const item = this.addNewsCell.get() as NewsItem;
    await this.db.addOrUpdate({
      ...item,
      _id: Fn.ulid(),
      time: utc().toISOString(),
    });
    this.addNewsCell.set({});
  }

  public addNewsCell = new Cell<Partial<NewsItem>>({});
  public get isAddNewsValid() {
    const item = this.addNewsCell.get() as NewsItem;
    return !!(item.text && item.title);
  }

  remove(_id: string) {
    return this.db.remove(_id);
  }

  get(id: any) {
    return this.db.get(id);
  }

  async update(newItem: NewsItem) {
    await this.db.addOrUpdate(newItem);
  }
}

export const newsStore = new NewsStore();
