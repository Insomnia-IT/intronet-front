import { Container, VStack } from "@chakra-ui/react";
import * as React from "react";
import { BackRoutButton } from "src/components/backRoutButton/backRoutButton";
import { Heading } from "src/components/heading/heading";
import Loading from "src/loading/loading";
import { articlesStore } from "../../../stores/articles.store";
import { Article } from "./article/article";
import { useParams } from "react-router-dom";

export const ArticlePage: React.FC = () => {
  React.useEffect(() => {
    if (articlesStore.IsLoading) {
      articlesStore.load();
    }
  }, []);

  const { id } = useParams();

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
