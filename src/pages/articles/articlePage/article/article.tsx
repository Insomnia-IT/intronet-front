import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import * as React from "react";
import ReactMarkdown from "react-markdown";

type TArticleProps = {
  md: string;
};

export const Article: React.FC<TArticleProps> = ({ md }) => {
  return <ReactMarkdown components={ChakraUIRenderer()} children={md} />;
};
