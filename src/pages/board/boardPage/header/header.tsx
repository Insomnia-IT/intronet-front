import { Heading, Link, Text, VStack } from "@chakra-ui/react";
import * as React from "react";
import { Link as ReactRouterLink } from "react-router-dom";

export default function Header() {
  return (
    <VStack align={"start"} spacing={[0, null, 1]}>
      <Heading
        as="h1"
        maxWidth={["250px", null, "none"]}
        size={"xl"}
        color={"gray.700"}
        lineHeight={"none"}
      >
        Доска Объявлений
      </Heading>
      <Text as="p" fontSize="sm" color={"gray.400"}>
        Объявление можно опубликовать в{" "}
        <Link as={ReactRouterLink} to="/" variant={"brandLinkClickable"}>
          инфоцентре
        </Link>
      </Text>
    </VStack>
  );
}
