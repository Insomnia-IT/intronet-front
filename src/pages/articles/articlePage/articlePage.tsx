import { Container, Text, VStack } from "@chakra-ui/react";
import * as React from "react";
import { BackRoutButton } from "@components/backRoutButton/backRoutButton";
import {Loading} from "@components";
import { articlesStore } from "../../../stores/articles.store";
import { Article } from "./article/article";
import {useCellState} from "../../../helpers/cell-state";
import {useRouter} from "../../routing";

export const ArticlePage: React.FC = () => {
  const {route} = useRouter();
  const [article] = useCellState(() => articlesStore.getArticle(route[1].toString()), [route[1]]);
  const [isLoading] = useCellState(() => articlesStore.IsLoading);
  return (
    <VStack pt={3} h={"100%"} overflowY={"auto"} className={"hide-scrollbar"}>
      <Container pos={"relative"}>
        <BackRoutButton transform={"translateX(-1rem)"} mb={4} />
        <Loading isLoading={isLoading}>
          {article ? (
            <>
              <h1>{article.title}</h1>
              <Article md={article.text}></Article>
            </>
          ) : (
            <Text as={"h1"} fontSize={"1rem"} textAlign={"center"}>
              Не получилось загрузить статью, или её не существует
            </Text>
          )}
        </Loading>
      </Container>
    </VStack>
  );
}
