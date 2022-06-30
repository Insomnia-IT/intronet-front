import { Box, Container, VStack } from "@chakra-ui/react";
import React from "react";
import { BoardList } from "./boardList/boardList";
import Categories from "./categories/categories";
import Header from "./header/header";

export function BoardPage() {
  return (
    <Container h={"100%"}>
      <VStack pt={8} align={"flex-start"} spacing={4} w={"100%"} maxH={"100%"}>
        <Box>
          <Header />
        </Box>
        <Box minW={"100%"}>
          <Categories />
        </Box>
        <Box
          minH={1}
          overflowY={"auto"}
          w={"100%"}
          className={" hide-scrollbar"}
        >
          <BoardList></BoardList>
        </Box>
      </VStack>
    </Container>
  );
}
