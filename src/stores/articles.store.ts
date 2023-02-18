import { cell } from "@cmmn/cell/lib";
import { ObservableDB } from "./observableDB";

class ArticlesStore {
  constructor() {
  }

  @cell
  Articles = new ObservableDB<IArticle>("articles");

  @cell
  IsLoading = true;

  get articles(): IArticle[] {
    return this.Articles.toArray();
  }

  public getArticle(id: IArticle["_id"]): IArticle {
    return this.articles.find((article) => article._id === id);
  }
}

export const articlesStore = new ArticlesStore();
