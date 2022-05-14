import { Observable } from 'cellx-decorators';
import { Dexie, Table } from 'dexie';
import NotesApi from '../../api/notes';
import { ObservableList } from 'cellx-collections';
import { COUNT_NOTES_OF_PAGE, pagesStore } from './pages.store';
import { ALL_CATEGORY, categoriesStore } from './categories.store';

export interface INotes {
  id: number
  title: string
  text: string
  categoryId: number
}

class NotesDBInit extends Dexie {
  notes!: Table<INotes>

  constructor() {
    super('Notes')
    this.version(1).stores({
      notes: 'id, name, description, categoryId'
    })
  }
}

class NotesStore {
  private db = new NotesDBInit
  private api = new NotesApi

  @Observable
  Notes = new ObservableList<INotes>();

  @Observable
  IsLoading: boolean = true

  get isLoading() {
    return this.IsLoading
  }

  toggleLoading = () => {
    this.IsLoading = !this.isLoading
  }

  // Загрузка первых 20 объявлений каждой категории
  public load = async () => {
    this.IsLoading = true
    const notes = await this.api.getNotes()
    this.Notes.clear()
    this.Notes.addRange(notes)
    this.IsLoading = false
  }

  // Загрузка новых объявлений выбранной категории
  public loadNewNotes = async (page: number = pagesStore.page) => {
    this.IsLoading = true
    const newNotes = await this.api.getNotes(page, COUNT_NOTES_OF_PAGE, [categoriesStore.activeCategory])
    this.Notes.addRange(newNotes)
    this.IsLoading = false
  }

  // Отдаёт COUNT_NOTES_OF_PAGE объявлений переданной категории
  public getNotes = (categoryId: number): INotes[] => {
    const from = (pagesStore.page - 1) * COUNT_NOTES_OF_PAGE
    const res = (categoriesStore.activeCategory === ALL_CATEGORY ? this.Notes.toArray() : this.Notes.filter((item) => item.categoryId == categoriesStore.activeCategory)).slice(from, from + COUNT_NOTES_OF_PAGE)
    console.log(`notes list id - ${Math.random()}, res - `, res)
    return res
  }
}

export const notesStore = new NotesStore()
