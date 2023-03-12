import * as React from "preact/compat";
import { BackRoutButton } from "@components/backRoutButton/backRoutButton";
import { Loading } from "@components";
import { articlesStore } from "../../../stores/articles.store";
import { Article } from "./article/article";
import { useCellState } from "../../../helpers/cell-state";
import { useRouter } from "../../routing";
import styles from "./articlePage.module.css";

export const ArticlePage: React.FC = () => {
  const {route} = useRouter();
  const [ article ] = useCellState(() => articlesStore.getArticle(route[1].toString()), [ route[1] ]);
  const [ isLoading ] = useCellState(() => articlesStore.IsLoading);
  return (
    <div className={ styles.container }>
      <BackRoutButton transform={ "translateX(-1rem)" } mb={ 4 }/>
      <Loading isLoading={ isLoading }>
        { article ? (
          <>
            <h1>{ article.title }</h1>
            <Article md={ article.text }></Article>
          </>
        ) : (
          <h1 className={ styles.plug }>
            Не получилось загрузить статью, или её не существует
          </h1>
        ) }
      </Loading>
    </div>
  );
}
