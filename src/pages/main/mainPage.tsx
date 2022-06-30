import { Container, VStack } from "@chakra-ui/react";
import * as React from "react";
import { Heading } from "../../components/heading/heading";
import { CardList } from "./cardList/cardList";

export const MainPage = () => {
  return (
    <Container h={"100%"} overflowY={"auto"} className={"hide-scrollbar"}>
      <VStack spacing={4} align={"flex-start"} w={"100%"} maxH={"100%"} pt={16}>
        <Heading level={1} pb={5}>
          Главная
        </Heading>
        <CardList></CardList>
      </VStack>
    </Container>
  );
};
