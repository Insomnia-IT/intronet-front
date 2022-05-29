import { AdminApi } from './admin';
import { ALL_CATEGORY_ID } from './../stores';
import { COUNT_NOTES_OF_PAGE } from 'src/stores';

const notesRout = '/api/notes'
const categoriesRout = 'categories'

export default class NotesApi extends AdminApi {
  constructor() {
    super()
  }

  getNote(id: number): Promise<INotes> {
    return this.fetch(`${notesRout}/${id}`)
  }

  getAllNotes(): Promise<INotes[]> {
    return this.fetch(`${notesRout}/all`)
  }

  getNotes(page = 1, count = COUNT_NOTES_OF_PAGE, categoriesIds: number[] = []): Promise<INotes[]> {
    // Если в переданном categoriesIds есть общая категория,
    // то нужно заменить массив с категориями на пустой массив,
    // что бы в запросе не было категории, и сервер вернул их все.
    let smartFilter = true
    if (categoriesIds.includes(ALL_CATEGORY_ID)) {
      categoriesIds = []
      smartFilter = false
    }

    const url = `${notesRout}/filter?Page=${page}&Count=${count}&${categoriesIds.length > 0 ? (`CategoriesIds=` + categoriesIds.join('&CategoriesIds=')) : `IsSmartFilter=${smartFilter}`}`
    return this.fetch(url)
  }

  getNotesAll(): Promise<INotes[]> {
    return this.fetch(`${notesRout}/all`)
  }

  createNote(name: string, description: string): Promise<null> {
    return this.adminFetch(`${notesRout}/add`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        description
      })
    })
  }

  editNote(id: number, name?: string, description?: string): Promise<null> {
    return this.adminFetch(`${notesRout}/edit`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        name,
        description
      })
    })
  }

  deleteNote(id: number): Promise<null> {
    return this.adminFetch(`${notesRout}/delete/${id}`)
  }

  getCategory = (id: number): Promise<ICategory> => {
    return this.fetch(`${notesRout}/category/${id}`)
  }

  getAllCategories = (): Promise<ICategory[]> => {
    return this.fetch(`${notesRout}/${categoriesRout}`)
  }

  createNewCategory = (name: string): Promise<null> => {
    return this.adminFetch(`${notesRout}/${categoriesRout}/add`, {
      method: 'POST',
      body: JSON.stringify({
        name
      })
    })
  }

  editCategory = (id: number, newName: string): Promise<null> => {
    return this.adminFetch(`${notesRout}/${categoriesRout}/edit`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        name: newName
      })
    })
  }
}
