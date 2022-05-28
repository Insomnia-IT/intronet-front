import * as React from 'react'
import { Text, TextProps } from '@chakra-ui/react';
import { ToggleBtn } from './toggleBtn/toggleBtn';

export type INoteText = {
  text: INotes['text']
}

const COUNT_CHAR_OF_SHORT_TEXT = 176

const WrapText = ({ children, ...res }: React.PropsWithChildren<TextProps>) => (<Text as={'p'} size={'sm'} {...res}>{children}</Text>)

export const NoteText = ({ text }: INoteText) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const toggleOpen = () => setIsOpen(prev => !prev)

  const isBig = text.length > COUNT_CHAR_OF_SHORT_TEXT
  if (!isBig) return (<WrapText>{text}</WrapText>)

  const ending = '...'
  const shortText = text.slice(0, COUNT_CHAR_OF_SHORT_TEXT - ending.length) + ending

  return (
    <WrapText
      as='p'
      fontSize='sm'
    >
      {!isOpen ? shortText : text}
      {' '}
      <ToggleBtn onClick={toggleOpen}>
        {isOpen ? 'Свернуть' : 'Подробнее'}
      </ToggleBtn>
    </WrapText>
  )
}
