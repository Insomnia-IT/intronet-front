import { articlesStore } from "@stores/articles.store";
import { Article } from "./article/article";
import {useCell} from "@helpers/cell-state";
import {useRouter} from "../../routing";
import {FunctionalComponent} from "preact";

export const ArticlePage: FunctionalComponent = () => {
  const {route} = useRouter();
  const article = useCell(() => articlesStore.getArticle(route[1].toString()), [route[1]]);
  const isLoading = useCell(() => articlesStore.IsLoading);
  return (
    <div></div>
  );
}
