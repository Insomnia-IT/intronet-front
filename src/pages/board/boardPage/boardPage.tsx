import React from "react";
import styles from "./boardPage.module.scss";
import { Container } from '@chakra-ui/react';
import BoardList from "./boardList/boardList";
import Categories from "./categories/categories";
import Pageing from "./pageing/pageing";
import Header from './header/header';
import { Box } from '@chakra-ui/react';

export function BoardPage() {
  return (
    <Container className={styles.container}>
      <Box pt={'16px'}>
        <Header />
      </Box>
      <Box my={4}>
        <Categories />
      </Box>
      <Box className={"mb-5 " + styles.boardListCont}>
        <BoardList></BoardList>
      </Box>
      <Pageing />
    </Container>
  );
}
