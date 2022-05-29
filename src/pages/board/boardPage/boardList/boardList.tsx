import * as React from 'react'
import styles from './boardList.module.scss'
import { BoardCard } from './boardCard/boardCard';
import { Observer } from 'cellx-react';
import { notesStore, pagesStore } from 'src/stores';
import Loading from 'src/loading/loading';
import { VStack } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

@Observer
export default class BoardList extends React.Component<{}, {}> {
  componentDidMount() {
    notesStore.load()
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
              return (
                <BoardCard
                  key={note.id}
                  _last={{ mb: 4 }}
                  notesInfoObj={note}
                />
              )
            })}
          </VStack>
        </Loading>
      </Box>
    )
  }
}
