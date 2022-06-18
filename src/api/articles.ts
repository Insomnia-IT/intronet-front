import { BaseApi } from './base';

const articlesRoot = 'api/pages'

export class ArticlesApi extends BaseApi {
  constructor() {
    super()
  }

  public getAllArticles(): Promise<IArticle[]> {
    return this.fetch(`${articlesRoot}/all`)
  }

  public getArticle(id: IArticle['id']): Promise<IArticle> {
    return this.fetch(`${articlesRoot}/${id}`)
  }
}

export const articlesApi = new ArticlesApi()
