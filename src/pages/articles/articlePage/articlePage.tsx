import { Container, VStack, Text } from "@chakra-ui/react";
import { Observer } from "cellx-react";
import * as React from "react";
import { BackRoutButton } from "src/components/backRoutButton/backRoutButton";
import { Heading } from "src/components/heading/heading";
import { withId, WithIdProps } from "src/helpers/AddParams/addParams";
import Loading from "src/loading/loading";
import { articlesStore } from "../../../stores/articles.store";
import { Article } from "./article/article";

@Observer
export class ArticlePage extends React.Component<WithIdProps> {
  componentDidMount(): void {
    articlesStore.load();
  }

  render(): React.ReactNode {
    return (
      <VStack pt={3} h={"100%"} overflowY={"auto"} className={"hide-scrollbar"}>
        <Container pos={"relative"}>
          <BackRoutButton transform={"translateX(-1rem)"} mb={4} />
          <Loading isLoading={articlesStore.IsLoading}>
            {!articlesStore.IsLoading &&
              (articlesStore.getArticle(parseInt(this.props.id)) ? (
                <>
                  <Heading level={1} mb={4}>
                    {articlesStore.getArticle(parseInt(this.props.id)).title}
                  </Heading>
                  <Article
                    md={articlesStore.getArticle(parseInt(this.props.id)).text}
                  ></Article>
                </>
              ) : (
                <Text as={"h1"} fontSize={"1rem"} textAlign={"center"}>
                  Не получилось загрузить статью, или её не существует
                </Text>
              ))}
          </Loading>
        </Container>
      </VStack>
    );
  }
}

export const ArticlePageWithId = withId(ArticlePage);
