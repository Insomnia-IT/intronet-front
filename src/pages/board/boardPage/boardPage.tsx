import React from "react";
import styles from "./boardPage.module.scss"
import { Container } from "react-bulma-components";
import BoardList from "./boardList/boardList";
import Categories from "./categories/categories";
import Pageing from "./pageing/pageing";

export function BoardPage() {
  return (
    <Container>
      <Categories />
      <div className={'mb-5 ' + styles.boardListCont}>
        <BoardList></BoardList>
      </div>
      <Pageing />
    </Container >
  )
}
