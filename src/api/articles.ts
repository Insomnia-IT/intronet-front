import { BaseApi } from './base';

const articlesRoot = 'api/pages'

const testArticles: IArticle[] = [
  {
    id: 1,
    title: 'Название',
    text:  `## Features

    - Import a HTML file and watch it magically convert to Markdown
    - Drag and drop images (requires your Dropbox account be linked)
    - Import and save files from GitHub, Dropbox, Google Drive and One Drive
    - Drag and drop markdown and HTML files into Dillinger
    - Export documents as Markdown, HTML and PDF`
  }
]

export class ArticlesApi extends BaseApi {
  constructor() {
    super()
  }

  public getAllArticles(): Promise<IArticle[]> {
    // return this.fetch(`${articlesRoot}/all`)
    return new Promise((res, rej) => {
      // setTimeout((res(testArticles)), 2000)
      res(testArticles)
    })
  }

  public getArticle(id: IArticle['id']): Promise<IArticle> {
    return this.fetch(`${articlesRoot}/${id}`)
  }
}

export const articlesApi = new ArticlesApi()
