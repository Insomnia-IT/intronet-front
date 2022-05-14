import { Observer } from 'cellx-react'
import * as React from 'react'
import styles from './categories.module.scss'
import { Tabs } from 'react-bulma-components'
import { categoriesStore, notesStore } from 'src/stores';
import Loading from 'src/loading/loading';

export interface ICategoriesProps {
  activeCategory: number
  onChangeCategory: (id: number) => void
}

export interface ITab {
  text: string
  id: number
}

const tabList: ITab[] = [
  {
    id: 1,
    text: 'Все'
  },
  {
    id: 2,
    text: 'Интересное'
  },
  {
    id: 3,
    text: 'Потеряшки'
  }
]

@Observer
export default class Categories extends React.Component<{}, {}> {

  componentDidMount() {
    categoriesStore.load()
  }

  handleClick = (id: number) => {
    return () => {
      categoriesStore.activeCategory = id
    }
  }

  render() {
    return (
      <Tabs align='center'>
        <Loading isLoading={categoriesStore.isLoading} height={40} className={styles.loading}>
          {tabList.map(tab => {
            return (<Tabs.Tab key={tab.id} active={tab.id == categoriesStore.activeCategory} onClick={this.handleClick(tab.id)}>
              {tab.text}
            </Tabs.Tab>)
          })}
        </Loading>
      </Tabs>
    )
  }
}
