import * as React from 'react'
import { Tag } from '@chakra-ui/react'

interface ITag {
  categoryObj: ICategory
  key?: number | string;
  activeCategory: ICategory['id']
  onClick?: (id?: ICategory['id']) => void
  children: string | React.ReactNode
}

export default function CategoryCard({ categoryObj, key = categoryObj.id, activeCategory, onClick, children }: ITag) {
  const color = categoryObj.color || 'gray.400'
  const isActive = activeCategory === categoryObj.id

  return (
    <Tag
      key={key}
      py={2}
      px={4}
      border={'1px'}
      borderColor={color}
      borderRadius={'2rem'}
      bg={isActive ? color : 'transparent'}
      color={isActive ? 'white' : color}
      onClick={() => onClick(categoryObj.id)}
    >
      {children}
    </ Tag>
  )
}
