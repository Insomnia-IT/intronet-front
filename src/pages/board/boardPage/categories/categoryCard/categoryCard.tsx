import * as React from 'react'
import { Tag, TagProps } from '@chakra-ui/react'

interface ICategoryCard extends TagProps {
  categoryObj: ICategory
  key?: number | string;
  activeCategory: ICategory['id']
  _onClick?: (id?: ICategory['id']) => void
  children: string | React.ReactNode
}

export function CategoryCard({ categoryObj, key = categoryObj.id, activeCategory, _onClick, children, ...rest }: React.PropsWithChildren<ICategoryCard>) {
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
      onClick={() => _onClick(categoryObj.id)}
      cursor={'pointer'}
      flexShrink={1}
      flexBasis={'content'}
      fontSize={'md'}
      lineHeight={1.5}
      {...rest}
    >
      {children}
    </ Tag>
  )
}
