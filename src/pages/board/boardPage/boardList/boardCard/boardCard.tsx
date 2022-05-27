import * as React from 'react'
import styles from './boardCard.module.scss'
import { Link } from 'wouter';
import { Button } from 'react-bulma-components';

export type INotesCard = Omit<INotes, 'categoryId'>

export default function BoardCard({ title, text, id }: INotesCard) {
  return (
    <div className={styles.card + ' p-5'}>
      <h3 className='mb-2 is-size-4'>
        {title}
      </h3>
      <p className={styles.desc}>
        {text}
      </p>
      <div className={styles.shadow + ' mb-4'}></div>
      <Button color='primary' renderAs={Link} to={`/board/note?id=${id}`}>
        Подробнее
      </Button>
    </div>
  )
}
