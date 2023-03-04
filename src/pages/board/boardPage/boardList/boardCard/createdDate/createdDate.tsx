import * as React from "preact/compat";
import { Text } from "@chakra-ui/react";
import { parseDate } from "@helpers/parseDate";

type TCreatedDateProps = {
  date: string;
};

export const CreatedDate: React.FC<TCreatedDateProps> = ({ date }) => {
  return (
    <Text fontSize={"14px"} color={"gray.400"}>
      {parseDate(date)}
    </Text>
  );
};
