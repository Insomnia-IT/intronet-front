import {FunctionalComponent} from "preact";

type TArticleProps = {
  md: string;
};

export const Article: FunctionalComponent<TArticleProps> = ({ md }) => {
  return (
    <></>
    // <ReactMarkdown components={ChakraUIRenderer(articleTheme)} children={md} />
  );
};
