import { cell } from "@cmmn/cell/lib";
import { GenericRequest } from "@api";
import { ObservableDB } from "../observableDB";

class NotesStore {

  @cell
  Notes = new ObservableDB<INote>("notes");

  @cell
  IsLoading: boolean = false;

  get isLoading() {
    return this.IsLoading;
  }

  toggleLoading = () => {
    this.IsLoading = !this.isLoading;
  };

  /**
   * Добавляет запись
   */
  public addNote = async (request: GenericRequest<null, null, INote>) => {
    await this.Notes.addOrUpdate(request.body);
  };

  /**
   * Изменяет запись по id
   * @param {INote} body Тело реквеста
   */
  public editNote = async (request: GenericRequest<null, null, INote>) => {
    await this.Notes.addOrUpdate(request.body);
  };

  /**
   * Удаляет запись по id
   */
  public removeNote = async (
    request: GenericRequest<{ id: string }, null, null>
  ) => {
    this.IsLoading = true;
    // await this.api.deleteNote(request.path.id);
    this.Notes.remove(request.path.id);
    this.IsLoading = false;
  };

  // Отдаёт стор с объявлениями
  get notes() {
    return this.Notes.toArray().sort((a, b) => b._id > a._id ? 1 : (b._id == a._id ? 0 : -1));
  }

  getNote(id: string) {
    return this.notes.find((note) => note._id === id);
  }
}

export const notesStore = new NotesStore();
