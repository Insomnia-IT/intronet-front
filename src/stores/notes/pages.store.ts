import { Observable } from "cellx-decorators"
import { notesStore } from 'src/stores';

export const COUNT_NOTES_OF_PAGE = 5

class PagesStore {
  @Observable
  Page = 1

  @Observable
  CountPages: number = 2

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
    await notesStore.loadNewNotes(this.Page + 1)
    this.Page++
  }

  prevPage = () => {
    this.Page--
    console.log(this.Page)
  }
}

export const pagesStore = new PagesStore
