import * as React from "preact";
import { articlesStore } from "@stores/articles.store";
import { Article } from "./article/article";
import {useCellState} from "@helpers/cell-state";
import {useRouter} from "../../routing";

export const ArticlePage: React.FunctionalComponent = () => {
  const {route} = useRouter();
  const [article] = useCellState(() => articlesStore.getArticle(route[1].toString()), [route[1]]);
  const [isLoading] = useCellState(() => articlesStore.IsLoading);
  return (
    <div></div>
  );
}
