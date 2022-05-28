import { Observer } from 'cellx-react'
import * as React from 'react'
import { categoriesStore } from 'src/stores';
import Loading from 'src/loading/loading';
import { HStack } from '@chakra-ui/react';
import { CategoryCard } from './categoryCard/categoryCard';
import { Box } from '@chakra-ui/react';

export interface ICategoriesProps {
  activeCategory: number
  onChangeCategory: (id: number) => void
}

@Observer
export default class Categories extends React.Component<{}, {}> {

  componentDidMount() {
    categoriesStore.load()
  }

  handleClick = (id: number) => categoriesStore.activeCategory = id

  render() {
    return (
      <Box
        display={'flex'}
        maxW={'100vw'}
        // mr={'2rem'}
        flex={1}
        overflowX={'auto'}
        className='hide-scrollbar'
      >
        <HStack
          spacing={2}
          as='ul'
          flex={1}
          minWidth={'max-content'}
        >
          <Loading
            // isLoading={true}
            isLoading={categoriesStore.isLoading}
            height={40}
            width={40}
          >
            {categoriesStore.allCategory.map(category => {
              return (<CategoryCard as={'li'} categoryObj={category} _last={{ marginRight: '2rem' }} _onClick={this.handleClick} activeCategory={categoriesStore.activeCategory} >
                {category.name}
              </CategoryCard>)
            })}
          </Loading>
        </HStack>
      </Box>
    )
  }
}
