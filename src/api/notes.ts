import { INotes } from './../stores/notes.store';
import { AdminApi } from './admin';

const notesRout = '/api/notes'

export default class NotesApi extends AdminApi {
  constructor() {
    super()
  }

  public getNote(id: number): Promise<INotes> {
    return this.fetch(`${notesRout}/${id}`)
  }

  public getNotes(page?: number, count?: number): Promise<INotes[]> {
    const params = (page ? `?Page=${page}` : '') + (count ? `&Count=${count}` : '')
    return this.fetch(`${notesRout}/filter${params}`)
  }

  public getNotesAll(): Promise<INotes[]> {
    return this.fetch(`${notesRout}/all`)
  }

  public createNote(name: string, description: string): Promise<null> {
    return this.adminFetch(`${notesRout}/add`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        description
      })
    })
  }

  public editNote(id: number, name?: string, description?: string): Promise<null> {
    return this.adminFetch(`${notesRout}/edit`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        name,
        description
      })
    })
  }

  public deleteNote(id: number): Promise<null> {
    return this.adminFetch(`${notesRout}/delete/${id}`)
  }
}
