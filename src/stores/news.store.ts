import {cell, Cell, Fn} from "@cmmn/cell/lib";
import {getDay, getDayText} from "@helpers/getDayText";
import {fromUTC, utc} from "@helpers/utc";
import {h} from "preact";
import {ObservableDB} from "./observableDB";

class NewsStore {
  @cell
  private db = new ObservableDB<NewsItem>("news");

  public State = new Cell(() => {
    const news = this.db.toArray();
    return ({
      news: news.map(x => ({
        ...x,
        time: this.formatTime(x.time)
      }))
    });
  });

  private formatTime(iso: string){
    const utc = new Date(iso);
    const local = fromUTC(utc);
    const hour = local.getHours();
    const day = getDayText(getDay(+local));
    return `${day} ${hour}:00`;
  }

  public async add(){
    if (!this.isAddNewsValid)
      return;
    const item = this.addNewsCell.get() as NewsItem;
    await this.db.addOrUpdate({
      ...item,
      _id: Fn.ulid(),
      time: utc().toISOString()
    });
    this.addNewsCell.set({});
  }

  public addNewsCell = new Cell<Partial<NewsItem>>({});
  public get isAddNewsValid(){
    const item = this.addNewsCell.get() as NewsItem;
    return !!(item.text && item.title)
  }
}

export const newsStore = new NewsStore();
