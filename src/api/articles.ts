import { BaseApi } from "./base";

const articlesRoot = "/api/pages";

const testArticles: IArticle[] = [
  {
    id: 1,
    title: "Наши принципы и ценности",
    text: `### Анимация — главная составляющая фестиваля\n«Бессонница» была и будет фестивалем анимационных фильмов. С наступлением темноты все площадки затихают, все программы сворачиваются, центрами жизни фестиваля становятся экраны.\n### Вдали от цивилизации\nМы считаем, что для правильного восприятия анимации необходимы открытое небо и темнота, образуемая естественным вращением Земли. Только такая темнота может вернуть нас к самим себе, отрывая от иллюзий и суеты цивилизации.`,
  },
];

export class ArticlesApi extends BaseApi {
  public getAllArticles(): Promise<IArticle[]> {
    // return this.fetch(`${articlesRoot}/all`);
    return new Promise((res, rej) => {
      setTimeout(() => res(testArticles), 1500);
    });
  }

  public getArticle(id: IArticle["id"]): Promise<IArticle> {
    return this.fetch(`${articlesRoot}/${id}`);
  }
}

export const articlesApi = new ArticlesApi();
