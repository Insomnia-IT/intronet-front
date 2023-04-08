import * as React from "preact";

type TArticleProps = {
  md: string;
};

export const Article: React.FunctionalComponent<TArticleProps> = ({ md }) => {
  return (
    <></>
    // <ReactMarkdown components={ChakraUIRenderer(articleTheme)} children={md} />
  );
};
