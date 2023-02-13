import { Link, Text, VStack } from "@chakra-ui/react";
import * as React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Heading } from "@src/components/heading/heading";
import { useCellState } from "../../../../helpers/cell-state";
import { locationsStore } from "../../../../stores/locations.store";

export default function Header() {
  const [info] = useCellState(() => locationsStore.Infocenter);
  const infoRoute = `/map/${info?.id}`;
  return (
    <VStack align={"start"} spacing={[0, null, 1]}>
      <Heading maxWidth={["250px", null, "none"]} level={1}>
        Доска Объявлений
      </Heading>
      <Text as="p" fontSize="sm" color={"gray.400"}>
        Объявление можно опубликовать в{" "}
        <Link
          as={ReactRouterLink}
          to={infoRoute}
          variant={"brandLinkClickable"}
        >
          инфоцентре
        </Link>
      </Text>
    </VStack>
  );
}
