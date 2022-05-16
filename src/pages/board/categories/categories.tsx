import { Observer } from 'cellx-react'
import * as React from 'react'
import styles from './categories.module.scss'
import { Tabs } from 'react-bulma-components'
import { ALL_CATEGORY_ID, categoriesStore, ICategory, notesStore } from 'src/stores';
import Loading from 'src/loading/loading';

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
    console.log('categories is mounted!');

  }

  handleClick = (id: number) => {
    return () => {
      categoriesStore.activeCategory = id
    }
  }

  render() {
    const categoriesList = categoriesStore.allCategory.slice()
    categoriesList.unshift({
      id: ALL_CATEGORY_ID,
      name: 'Все',
      count: 0
    })

    return (
      <Tabs align='center'>
        <Loading isLoading={categoriesStore.isLoading} height={40} className={styles.loading}>
          {categoriesList.map(tab => {
            return (<Tabs.Tab key={tab.id} active={tab.id == categoriesStore.activeCategory} onClick={this.handleClick(tab.id)}>
              {tab.name}
            </Tabs.Tab>)
          })}
        </Loading>
      </Tabs>
    )
  }
}
