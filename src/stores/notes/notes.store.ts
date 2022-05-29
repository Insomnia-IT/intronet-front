import { Observable } from 'cellx-decorators';
import NotesApi from '../../api/notes';
import { ObservableDB } from '../observableDB';

class NotesStore {
  private api = new NotesApi

  @Observable
  Notes = new ObservableDB<INotes>('notes');

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
    let notes: INotes[]
    try {
      notes = await this.api.getAllNotes()
      this.Notes.clear()
      this.Notes.addRange(notes)
      this.IsLoading = false
    } catch {
      this.IsLoading = false
    }
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
    return this.Notes.toArray()
  }

  getNote(id: number) {
    return this.notes.find(note => note.id === id)
  }
}

export const notesStore = new NotesStore()
