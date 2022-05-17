import * as React from 'react'
import ArrowRight from 'src/icons/arrowRight'
import styles from './pageing.module.scss'
import { pagesStore } from 'src/stores';
import { Observer } from 'cellx-react';

@Observer
export default class Pageing extends React.Component<{}, {}> {
  render() {
    return (
      <div className={styles.container}>
        <button className={styles.button + ' button-clear'} onClick={pagesStore.prevPage} disabled={pagesStore.page == 1}>
          <ArrowRight className={styles.arrowBack + ' ' + styles.arrow}></ArrowRight>
          Назад
        </button>
        <button className={styles.button + ' button-clear'} onClick={pagesStore.nextPage} disabled={pagesStore.page == pagesStore.countPages}>
          Вперёд
          <ArrowRight className={styles.arrow}></ArrowRight>
        </button>
      </div>
    )
  }
}
