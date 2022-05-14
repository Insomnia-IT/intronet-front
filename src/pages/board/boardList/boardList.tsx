import * as React from 'react'
import styles from './boardList.module.scss'
import BoardCard from './boardCard/boardCard';
import { Observer } from 'cellx-react';
import { notesStore, categoriesStore } from 'src/stores';
import Loading from 'src/loading/loading';

@Observer
export default class BoardList extends React.Component<{}, {}> {
  componentDidMount() {
    notesStore.load()
  }

  render() {
    return (
      <div className={styles.container}>
        <Loading isLoading={false}>
          <ul className={styles.list}>
            {notesStore.getNotes(categoriesStore.activeCategory).map(note => {
              return (
                <li key={note.id} className={styles.card}>
                  <BoardCard title={note.title} id={note.id} text={note.text} />
                </li>
              )
            })}
          </ul>
        </Loading>
      </div>
    )
  }
}
