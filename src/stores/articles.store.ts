import { Observable } from "cellx-decorators";
import { articlesApi } from "src/api/articles";
import { ObservableDB } from "./observableDB";

class ArticlesStore {
  constructor() {
    this.load();
  }

  @Observable
  Articles = new ObservableDB<IArticle>("articles");

  @Observable
  IsLoading = true;

  public load = async () => {
    this.IsLoading = true;

    try {
      const newArticles = await articlesApi.getAllArticles();

      this.Articles.clear();
      this.Articles.addRange(newArticles);
    } catch {
      console.warn("Синхронизация Articles не удалась");
    }

    this.IsLoading = false;
  };

  get articles(): IArticle[] {
    return this.Articles.toArray();
  }

  public getArticle(id: IArticle["id"]): IArticle {
    return this.articles.find((article) => article.id === id);
  }
}

export const articlesStore = new ArticlesStore();
