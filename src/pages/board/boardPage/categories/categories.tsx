import { Observer } from 'cellx-react'
import * as React from 'react'
import { categoriesStore, notesStore } from 'src/stores';
import Loading from 'src/loading/loading';
import { HStack, Tag } from '@chakra-ui/react';
import CategoryCard from './categoryCard/categoryCard';
import { Box } from '@chakra-ui/react';

export interface ICategoriesProps {
  activeCategory: number
  onChangeCategory: (id: number) => void
}

export interface ITab {
  text: string
  id: number
}

@Observer
export default class Categories extends React.Component<{}, {}> {

  componentDidMount() {
    categoriesStore.load()
  }

  handleClick = (id: number) => categoriesStore.activeCategory = id

  render() {
    return (
      <Box display={'flex'} flex={1} overflowX={'auto'}>
        <HStack spacing={2} as='ul' flex={1} minWidth={'max-content'}>
          <Loading isLoading={categoriesStore.isLoading} height={40} width={40}>
            {categoriesStore.allCategory.map(category => {
              return (<CategoryCard categoryObj={category} _onClick={this.handleClick} activeCategory={categoriesStore.activeCategory} >
                {category.name}
              </CategoryCard>)
            })}
          </Loading>
        </HStack>
      </Box>
    )
  }
}
