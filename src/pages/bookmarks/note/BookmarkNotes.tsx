import { BookmarkPlug } from "@components/plugs/bookmark/BookmarkPlug";
import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import { GesturedNotesList } from "../../notes/NotesList/GesturedNoteList";

export const BookmarkNotes = () => {
  const notesList = useCell(() => bookmarksStore.Notes);

  return notesList.length ? (
    <GesturedNotesList notes={notesList} />
  ) : (
    <BookmarkPlug
      buttonTitle={"К объявлениям"}
      text={[
        `Добавить объявления в избранное можно в разделе Объявления.`,
        `Нажмите на объявление в списке — откроется подробная информация и кнопка «Добавить в избранное».`,
      ]}
      route={"/notes"}
    />
  );
};
