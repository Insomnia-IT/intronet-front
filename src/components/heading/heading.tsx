import * as React from "react";
import { HeadingProps, Heading as ChakraHeading } from "@chakra-ui/react";

interface IHeadingProps extends HeadingProps {
  level: 1 | 2 | 3;
}

export const Heading = ({
  level,
  children,
  ...res
}: React.PropsWithChildren<IHeadingProps>) => {
  const chakraHeadingProps: HeadingProps = {
    color: "gray.700",
    fontWeight: "700",
    ...res,
  };

  switch (level) {
    case 1:
      chakraHeadingProps.as = "h1";
      chakraHeadingProps.fontSize = "4xl";
      chakraHeadingProps.lineHeight = "none";
      break;

    case 2:
      chakraHeadingProps.as = "h2";
      chakraHeadingProps.fontSize = "xl";
      chakraHeadingProps.lineHeight = "1.2em";
      break;

    case 3:
      chakraHeadingProps.as = "h3";
      chakraHeadingProps.fontSize = "md";
      chakraHeadingProps.lineHeight = "1.18em";
      break;
  }
  return <ChakraHeading {...chakraHeadingProps}>{children}</ChakraHeading>;
};
