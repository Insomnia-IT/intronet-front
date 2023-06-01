import { Fn, cell } from "@cmmn/cell/lib";
import { ObservableDB } from "../observableDB";

class NotesStore {
  @cell
  private db = new ObservableDB<INote>("notes");

  @cell
  IsLoading: boolean = false;

  get isLoading() {
    return this.IsLoading;
  }

  toggleLoading = () => {
    this.IsLoading = !this.isLoading;
  };

  /**
   * Добавляет объявление
   */
  public addNote = async (newNote: INoteLocal) => {
    await this.db.addOrUpdate(this.createNoteEntity(newNote));
  };

  /**
   * Обновляет объявление, но оно обязательно
   * должно уже существовать.
   */
  public updateNote = async ({
    id,
    updatedNote,
  }: {
    id: string;
    updatedNote: INoteUpdated;
  }) => {
    const note = this.getNote(id);

    if (!note) {
      throw new Error("Объявления не существует!");
    }

    await this.db.addOrUpdate({
      ...note,
      ...updatedNote,
      updatedAt: Date.now(),
    });
  };

  /**
   * Удаляет объявление по id
   */
  public removeNote = async (id: string) => {
    this.db.remove(id);
  };

  // Отдаёт стор с объявлениями
  @cell
  get notes() {
    return this.db.toArray().sort((a, b) => {
      return this.getLatestNoteDate(a) - this.getLatestNoteDate(b);
    });
  }

  public getNotesByFilterId(categoryId: string): INote[] | [] {
    return this.notes.filter((note) => {
      return note.categoryId === categoryId;
    });
  }

  public getNote(id: string) {
    return this.db.get(id);
  }

  private createNoteEntity(localNote: INoteLocal): INote {
    return {
      ...localNote,
      _id: Fn.ulid(),
      createdAt: Date.now(),
    };
  }

  public getLatestNoteDate(note: INote): number {
    return note.updatedAt || note.createdAt;
  }
}

export const notesStore = new NotesStore();

const mocks: INoteLocal[] = [
  {
    title: "Ищу попутчика!",
    text: "Привет! Кто подбросит двух девушек в субботу вечером до Калуги? Вещей немного, заплатим денег, если надо.",
    author: "Юля Петрова",
    categoryId: "blablacar",
  },
  {
    title: "Ищу попутчика!",
    text: "Привет! Кто подбросит двух девушек в субботу вечером до Калуги? Вещей немного, заплатим денег, если надо.",
    author: "Юля Петрова",
    categoryId: "blablacar",
  },
];

// mocks.forEach((mock) => {
//   notesStore.addNote(mock);
// });
