import { Observable } from "cellx-decorators";
import { GenericRequest } from "src/api/base";
import NotesApi from "../../api/notes";
import { ObservableDB } from "../observableDB";

class NotesStore {
  private api = new NotesApi();

  @Observable
  Notes = new ObservableDB<INotes>("notes");

  @Observable
  IsLoading: boolean = false;

  get isLoading() {
    return this.IsLoading;
  }

  toggleLoading = () => {
    this.IsLoading = !this.isLoading;
  };

  // Загрузка первых 20 объявлений каждой категории
  public load = async () => {
    this.IsLoading = true;
    let notes: INotes[];
    try {
      notes = await this.api.getAllNotes();
      this.Notes.clear();
      this.Notes.addRange(notes);
      this.IsLoading = false;
    } catch {
      this.IsLoading = false;
    }
  };

  // Загрузка новых объявлений выбранной категории
  public loadNewNotes = async (
    categoryId: number,
    page: number,
    count: number
  ) => {
    this.IsLoading = true;
    const newNotes = await this.api.getNotes(page, count, [categoryId]);
    this.Notes.addRange(newNotes);
    this.IsLoading = false;
  };

  /**
   * Добавляет запись
   */
  public addNote = async (request: GenericRequest<null, null, INotes>) => {
    this.IsLoading = true;
    await this.api.createNote(request.body.title, request.body.text);
    this.load();
    this.IsLoading = false;
  };

  /**
   * Изменяет запись по id
   * @param {INote} body Тело реквеста
   */
  public editNote = async (request: GenericRequest<null, null, INotes>) => {
    this.IsLoading = true;
    await this.api.editNote(
      request.body.id,
      request.body.title,
      request.body.text
    );
    this.Notes.update(request.body);
    this.IsLoading = false;
  };

  /**
   * Удаляет запись по id
   */
  public removeNote = async (
    request: GenericRequest<{ id: number }, null, null>
  ) => {
    this.IsLoading = true;
    await this.api.deleteNote(request.path.id);
    this.Notes.remove(request.path.id);
    this.IsLoading = false;
  };

  // Отдаёт стор с объявлениями
  get notes() {
    return this.Notes.toArray().sort((a, b) => b.id - a.id);
  }

  getNote(id: number) {
    return this.notes.find((note) => note.id === id);
  }
}

export const notesStore = new NotesStore();
