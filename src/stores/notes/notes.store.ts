import { Fn, cell } from "@cmmn/cell/lib";
import { ObservableDB } from "../observableDB";
import { authStore } from "@stores/auth.store";
import { getCurrentDate, getCurrentUtc } from "@helpers/date";

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
      updatedAt: getCurrentUtc(),
      deletedAt: updatedNote.isDeleted ? getCurrentDate() : note.deletedAt,
    });
  };

  /**
   * Помечает объявление как удалённое, показывается только в архиве
   */
  public deleteNote = async (id: string) => {
    this.updateNote({
      id,
      updatedNote: {
        isDeleted: true,
      },
    });
  };

  /**
   * Делаем объявление общедоступным.
   * Если пользователь не имеет прав - вернёт ошибку.
   */
  public approveNote(noteId: string) {
    if (!this.isUserModerator) {
      return new Error("Current user doesn`t have permission to approve notes");
    }

    this.updateNote({
      id: noteId,
      updatedNote: {
        isApproved: true,
        restricted: false,
      },
    });
  }

  /**
   * Полностью удаляем объявление
   * Если пользователь не имеет прав - вернёт ошибку.
   */
  public rejectNote(noteId: string) {
    if (!this.isUserModerator) {
      return new Error("Current user doesn`t have permission to reject notes");
    }

    this.removeNote(noteId);
  }

  /**
   * Удаляет (полностью) объявление по id
   */
  public removeNote = async (id: string) => {
    this.db.remove(id);
  };

  /**
   * Проверяет, можно ли обычным пользователям показывать объявление
   */
  public checkIsNoteActual = (note: INote) => {
    return !note.isDeleted && note.TTL > getCurrentDate();
  };

  // Отдаёт стор с объявлениями
  @cell
  get notes() {
    return this.db.toArray().sort((a, b) => {
      return this.getLatestNoteDate(b) - this.getLatestNoteDate(a);
    });
  }

  @cell
  get isUserModerator() {
    return authStore.isAdmin;
  }

  public getNotesByFilterId(categoryId: string): INote[] | [] {
    return this.notes.filter((note) => {
      // В рантайме почему то после полной очистке может быть
      // undefined
      return note?.categoryId === categoryId;
    });
  }

  public getNote(id: string) {
    return this.db.get(id) || null;
  }

  private createNoteEntity(localNote: INoteLocal): INote {
    return {
      ...localNote,
      author: {
        ...localNote.author,
        id: authStore.uid,
      },
      _id: Fn.ulid(),
      createdAt: getCurrentUtc(),
      isApproved: false,
    };
  }

  public getLatestNoteDate(note: INote): number {
    return note.updatedAt || note.createdAt;
  }
}

export const notesStore = new NotesStore();

// const mocks: INoteLocal[] = [
//   {
//     title: "Ищу попутчика!",
//     text: "Послушайте! Ведь, если звезды зажигают — значит — это кому-нибудь нужно? Значит — кто-то хочет, чтобы они были? Значит — кто-то называет эти плево́чки жемчужиной? И, надрываясь в метелях полу́денной пыли, врывается к богу, боится, что опоздал, плачет, целует ему жилистую руку, просит — чтоб обязательно была звезда! — клянется — не перенесет эту беззвездную муку! А после ходит тревожный, но спокойный наружно. Говорит кому-то: «Ведь теперь тебе ничего? Не страшно? Да?!» Послушайте! Ведь, если звезды зажигают — значит — это кому-нибудь нужно? Значит — это необходимо, чтобы каждый вечер над крышами загоралась хоть одна звезда?!",
//     author: "Владимир Маяковский",
//     categoryId: "searchFriends",
//   },
//   {
//     title: "Ищу попутчика!",
//     text: "Вашу мысль, мечтающую на размягченном мозгу, как выжиревший лакей на засаленной кушетке, буду дразнить об окровавленный сердца лоскут: досыта изъиздеваюсь, нахальный и едкий. У меня в душе ни одного седого волоса, и старческой нежности нет в ней! Мир огромив мощью голоса, иду — красивый, двадцатидвухлетний. Нежные! Вы любовь на скрипки ложите. Любовь на литавры ложит грубый. А себя, как я, вывернуть не можете, чтобы были одни сплошные губы! Приходите учиться — из гостиной батистовая, чинная чиновница ангельской лиги. И которая губы спокойно перелистывает, как кухарка страницы поваренной книги. Хотите — буду от мяса бешеный — и, как небо, меняя тона — хотите — буду безукоризненно нежный, не мужчина, а — облако в штанах! Не верю, что есть цветочная Ницца! Мною опять славословятся мужчины, залежанные, как больница, и женщины, истрепанные, как пословица. ",
//     author: "Длииииииииное Имяяяяяя",
//     categoryId: "",
//   },
// ];

// mocks.forEach((mock) => {
//   notesStore.addNote(mock);
// });
