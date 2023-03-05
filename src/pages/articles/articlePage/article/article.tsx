import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import * as React from "preact/compat";
import ReactMarkdown from "react-markdown";
import { articleTheme } from "../../../../theme/articleTheme/articleTheme";

type TArticleProps = {
  md: string;
};

export const Article: React.FC<TArticleProps> = ({ md }) => {
  return (
    <ReactMarkdown components={ChakraUIRenderer(articleTheme)} children={md} />
  );
};
