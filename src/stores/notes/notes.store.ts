import { Computed, Observable } from 'cellx-decorators';
import { Dexie, Table } from 'dexie';
import NotesApi from '../../api/notes';
import { ObservableList } from 'cellx-collections';

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
  public loadNewNotes = async (categoryId: number, page: number, count: number) => {
    this.IsLoading = true
    const newNotes = await this.api.getNotes(page, count, [categoryId])
    this.Notes.addRange(newNotes)
    this.IsLoading = false
  }

  // Отдаёт стор с объявлениями
  get notes() {
    return this.Notes
  }
}

export const notesStore = new NotesStore()
