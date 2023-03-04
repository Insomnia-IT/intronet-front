import { Link, Text, VStack } from "@chakra-ui/react";
import * as React from "react";
import { useCellState } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import {useRouter} from "../../../routing";

export default function Header() {
  const {goTo} = useRouter();
  const [info] = useCellState(() => locationsStore.Infocenter);
  return (
    <VStack align={"start"} spacing={[0, null, 1]}>
      <h1>Доска Объявлений</h1>
      <Text as="p" fontSize="sm" color={"gray.400"}>
        Объявление можно опубликовать в{" "}
        <Link
          onClick={() => goTo(['map', info?._id])}
          variant={"brandLinkClickable"}
        >
          инфоцентре
        </Link>
      </Text>
    </VStack>
  );
}
