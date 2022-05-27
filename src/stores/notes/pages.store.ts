import { Computed, Observable } from "cellx-decorators"
import { categoriesStore, notesStore } from 'src/stores';

export const COUNT_NOTES_OF_PAGE = 5
const INITIAL_PAGE = 1

class PagesStore {
  @Observable
  Page = INITIAL_PAGE

  @Observable
  CountPages: number = 3

  isLastPage = this.page == this.countPages

  get page() {
    return this.Page
  }

  get countPages() {
    return this.CountPages
  }

  // Вычисление кол-ва страниц из кол-ва объявлений (путём деления количества объявлений на количество объявлений на одной страницы, и округлением полученного в большую сторону)
  setCountPages = (countOfNotes: number) => {
    this.CountPages = Math.ceil(countOfNotes / COUNT_NOTES_OF_PAGE)
  }

  nextPage = async () => {
    this.Page++

    const from = this.calculateFrom()
    if (categoriesStore.notes.length <= from) {
      categoriesStore.loadNewNotes(this.page, COUNT_NOTES_OF_PAGE)
    }
  }

  prevPage = () => {
    this.Page--
  }

  resetPages = () => {
    this.Page = INITIAL_PAGE
  }

  @Computed
  get notes() {
    const from = this.calculateFrom()
    const to = categoriesStore.isAll ? undefined : from + COUNT_NOTES_OF_PAGE
    return categoriesStore.notes.slice(from, to)
  }

  private calculateFrom = (): number => (this.Page - 1) * COUNT_NOTES_OF_PAGE
}

export const pagesStore = new PagesStore()
