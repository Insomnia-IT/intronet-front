import * as React from 'react'
import styles from './boardList.module.scss'
import { BoardCard } from './boardCard/boardCard';
import { Observer } from 'cellx-react';
import { notesStore, pagesStore, categoriesStore } from 'src/stores';
import Loading from 'src/loading/loading';
import { VStack } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

@Observer
export default class BoardList extends React.Component<{}, {}> {
  private searchParams: URLSearchParams
  private activeNote: React.RefObject<HTMLLIElement>

  constructor(props) {
    super(props)
    this.searchParams = new URLSearchParams(window.location.search)
    this.activeNote = React.createRef()
  }

  componentDidMount() {
    notesStore.load()
    if (this.activeNote.current) this.activeNote.current.scrollIntoView({ behavior: 'smooth' })
    console.log(this.activeNote.current)
  }

  componentDidUpdate(): void {
    if (this.activeNote.current) this.activeNote.current.scrollIntoView()
    console.log(this.activeNote.current)
  }

  render() {
    return (
      <Box
        w={'100%'}
        className={notesStore.isLoading ? styles.isLoading : ''}
      >
        <Loading isLoading={notesStore.isLoading}>
          {pagesStore.notes.length === 0 && (<h2 style={{ textAlign: 'center' }}>Объявлений пока нет!</h2>)}
          <VStack
            as={'ul'}
            align={'streach'}
            spacing={4}
          >
            {pagesStore.notes.map(note => {
              const activeNote = parseInt(this.searchParams.get('id'))
              const ref = note.id === activeNote ? this.activeNote : null

              return (
                <li
                  key={note.id}
                  ref={ref}
                >
                  <BoardCard
                    notesInfoObj={note}
                    activeColor={categoriesStore.getCategoryColor(note.categoryId)}
                  />
                </li>
              )
            })}
          </VStack>
        </Loading>
      </Box>
    )
  }
}
