import { Observer } from "cellx-react";
import React from "react";
import styles from "./boardPage.module.scss"
import { Container } from "react-bulma-components";
import { notesStore } from "src/stores";
import { INotesCard } from "./boardList/boardCard/boardCard";
import BoardList from "./boardList/boardList";
import Categories from "./categories/categories";
import Pageing from "./pageing/pageing";

// const notesList: INotesCard[] = [
//   {
//     name: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
//     description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos, quibusdam doloribus aspernatur numquam, maiores ipsam iste distinctio fugit est nostrum enim dolor nemo sapiente id autem culpa quidem illum doloremque.',
//     id: 123
//   },
//   {
//     name: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
//     description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos, quibusdam doloribus aspernatur numquam, maiores ipsam iste distinctio fugit est nostrum enim dolor nemo sapiente id autem culpa quidem illum doloremque.',
//     id: 124
//   },
//   {
//     name: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
//     description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos, quibusdam doloribus aspernatur numquam, maiores ipsam iste distinctio fugit est nostrum enim dolor nemo sapiente id autem culpa quidem illum doloremque.',
//     id: 125
//   }
// ]

interface IBoardPageState {
  page: number
  categoryId: number
  isLoading: boolean
}

export class BoardPage extends React.Component<{}, IBoardPageState> {
  render() {
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
}
