import * as React from 'react'
import { Tag, TagProps } from '@chakra-ui/react'
import { categoriesStore } from 'src/stores';

interface ICategoryCard extends TagProps {
  categoryObj: ICategory
  isActive?: boolean
}

export function CategoryCard({ categoryObj, isActive, children, ...rest }: React.PropsWithChildren<ICategoryCard>) {
  const color = categoriesStore.getCategoryColor(categoryObj.id)

  return (
    <Tag
      py={2}
      px={4}
      borderRadius={'2rem'}
      bg={isActive ? color : 'transparent'}
      color={isActive ? 'white' : color}
      cursor={'pointer'}
      flexShrink={1}
      flexBasis={'content'}
      fontSize={'md'}
      lineHeight={1.5}
      {...rest}
    >
      {categoryObj.name}
    </ Tag>
  )
}
