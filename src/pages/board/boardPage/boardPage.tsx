import React from "react";
import styles from "./boardPage.module.scss";
import { Container, VStack } from '@chakra-ui/react';
import BoardList from "./boardList/boardList";
import Categories from "./categories/categories";
import Pageing from "./pageing/pageing";
import Header from './header/header';
import { Box } from '@chakra-ui/react';

export function BoardPage() {
  return (
    <Container
      h={'100%'}
    //  maxH={'calc(100vh - 64px)'} 
    >
      <VStack
        pt={8}
        align={'flex-start'}
        spacing={4}
        w={'100%'}
        maxH={'100%'}
      >
        <Box>
          <Header />
        </Box>
        <Box
          minW={'100%'}
        >
          <Categories />
        </Box>
        <Box
          minH={1}
          overflowY={'auto'}
          w='100%'
          className={' hide-scrollbar'}
        >
          <BoardList></BoardList>
        </Box>
        <Box
          alignSelf={'center'}
        >
          <Pageing />
        </Box>
      </VStack>
    </Container>
  );
}
