import { Container, Text, VStack } from "@chakra-ui/react";
import { Observer } from "cellx-react";
import * as React from "react";
import { BackRoutButton } from "src/components/backRoutButton/backRoutButton";
import { Heading } from "src/components/heading/heading";
import { withId, WithIdProps } from "src/helpers/AddParams/addParams";
import Loading from "src/loading/loading";
import { articlesStore } from "../../../stores/articles.store";
import { Article } from "./article/article";

export class ArticlePage extends React.Component<WithIdProps> {
  componentDidMount(): void {
    this.updateArticle();
  }

  componentDidUpdate(
    prevProps: Readonly<WithIdProps>,
    prevState: Readonly<{}>,
    snapshot?: any
  ) {
    if (prevProps.id !== this.props.id) {
      this.updateArticle();
    }
  }

  async updateArticle() {
    const id = +this.props.id;
    let existed = articlesStore.getArticle(id);
    if (!existed) {
      this.setState({
        IsLoading: true,
      });
      await articlesStore.load();
      existed = articlesStore.getArticle(id);
    }
    this.setState({
      article: existed,
      IsLoading: false,
    });
  }

  state = {
    IsLoading: true,
    article: null,
  };

  render(): React.ReactNode {
    return (
      <VStack pt={3} h={"100%"} overflowY={"auto"} className={"hide-scrollbar"}>
        <Container pos={"relative"}>
          <BackRoutButton transform={"translateX(-1rem)"} mb={4} />
          <Loading isLoading={this.state.IsLoading}>
            {this.state.article ? (
              <>
                <Heading level={1} mb={4}>
                  {this.state.article.title}
                </Heading>
                <Article md={this.state.article.text}></Article>
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
}

export const ArticlePageWithId = withId(ArticlePage);
