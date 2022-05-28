import * as React from 'react'
import styles from './boardCard.module.scss'
import { Link } from 'wouter';
import { Box, VStack, Heading } from '@chakra-ui/react';
import { categoriesStore } from 'src/stores';
import { NoteText } from './noteText/noteText';


export type INotesCard = {
  notesInfoObj: INotes
}

export const BoardCard = ({ notesInfoObj }: INotesCard) => {
  const { title, text, categoryId } = notesInfoObj
  const color = categoriesStore.getCategoryColor(categoryId) || 'gray.200'

  return (
    <VStack
      align={'flex-start'}
      px={4}
      py={5}
      spacing={2}
      border={'1px solid'}
      borderColor={color}
      borderRadius={'2xl'}
    >
      <Heading
        as='h3'
        size={'md'}
      >
        {title}
      </Heading>
      <NoteText text={text} />
    </VStack>
  )
}
