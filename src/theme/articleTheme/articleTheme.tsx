import { Heading, Text } from "@chakra-ui/react";
import React from "react";

export const articleTheme = {
  h3: (props) => {
    const { children } = props;
    return (
      <Heading pt={4} pb={3} fontSize={"24px"} lineHeight={"1.08em"}>
        {children}
      </Heading>
    );
  },
  p: (props) => {
    const { children } = props;
    return (
      <Text mb={4} fontSize={"14px"} lineHeight={"1.5em"}>
        {children}
      </Text>
    );
  },
};
