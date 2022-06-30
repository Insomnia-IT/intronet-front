import { Container, VStack } from "@chakra-ui/react";
import * as React from "react";
import { BackRoutButton } from "src/components/backRoutButton/backRoutButton";
import { Heading } from "src/components/heading/heading";
import Loading from "src/loading/loading";
import { articlesStore } from "../../../stores/articles.store";
import { Article } from "./article/article";

type TArticlePageProps = {
  id: string;
};

export const ArticlePage: React.FC<TArticlePageProps> = ({ id }) => {
  React.useEffect(() => {
    if (articlesStore.IsLoading) {
      articlesStore.load();
    }
  }, []);
  return (
    <VStack
      // align={"flex-start"}
      pt={3}
      h={"100%"}
      overflowY={"auto"}
      className={"hide-scrollbar"}
    >
      <BackRoutButton alignSelf={"flex-start"} />
      <Container>
        <Loading isLoading={articlesStore.IsLoading}>
          {articlesStore.IsLoading && (
            <Article md={articlesStore.getArticle(parseInt(id)).text}></Article>
          )}
        </Loading>
      </Container>
    </VStack>
  );
};
