import { BookmarkPlug } from "../../../components/plugs/bookmark/BookmarkPlug";
import { useCell } from "../../../helpers/cell-state";
import { bookmarksStore } from "../../../stores/bookmarks.store";
import { GesturedNotesList } from "../../notes/NotesList/GesturedNoteList";
import { useState } from "preact/hooks";
import { Sheet } from "../../../components";
import { NoteSheet } from "../../notes/NoteSheet/NoteSheet";

export const BookmarkNotes = () => {
  const notesList = useCell(() => bookmarksStore.Notes);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const resetActiveNoteId = () => {
    setActiveNoteId(null);
  };

  return notesList.length ? (
    <>
      <GesturedNotesList
        notes={notesList}
        notesProps={{
          onClick: setActiveNoteId,
        }}
      />
      <Sheet onClose={resetActiveNoteId} height="auto">
        {activeNoteId && (
          <NoteSheet
            activeNoteId={activeNoteId}
            onClose={resetActiveNoteId}
          ></NoteSheet>
        )}
      </Sheet>
    </>
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
