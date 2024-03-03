import { Button } from "../../../components";
import { useCell } from "../../../helpers/cell-state";
import { notesStore } from "../../../stores";
import { FunctionalComponent } from "preact";
import styles from "./note-sheet.module.css";
import { SvgIcon } from "../../../icons";
import { useIsBookmarkCell } from "../hooks/useIsBookmarkCell";
import { bookmarksStore } from "../../../stores/bookmarks.store";
import { NoteSheetContent } from "./NoteSheetContent/NoteSheetContent";
import { useIsUserModeratorCell } from "../hooks/useIsUserModeratorCell";
import { BookmarkIcon } from "@components/BookmarkGesture/bookmark-icon";

export type INoteSheetProps = {
  activeNoteId: string;
  onClose?: () => void;
};

export const NoteSheet: FunctionalComponent<INoteSheetProps> = ({
  activeNoteId,
  onClose,
}) => {
  const activeNote = useCell(() => {
    return notesStore.getNote(activeNoteId);
  }, [activeNoteId]);
  const isModerater = useIsUserModeratorCell();

  if (!activeNote || !notesStore.checkIsNoteActual(activeNote)) {
    onClose();
    return null;
  }

  const { _id: id } = activeNote;
  const isBookmark = useIsBookmarkCell(id);
  const addToBookmark = () => {
    bookmarksStore.switchBookmark("note", id);
  };
  const deleteNote = () => {
    notesStore.deleteNote(activeNoteId);
  };
  const bookmarkActionText = isBookmark
    ? "Удалить из избранного"
    : "Сохранить в избранное";

  return (
    <div className={styles.container}>
      <NoteSheetContent note={activeNote} onClose={onClose} />

      <div className={styles.actions}>
        {isModerater ? (
          <>
            <Button
              type={"text"}
              onClick={addToBookmark}
              className={styles.moderaterSaveBtn}
            >
              {bookmarkActionText}
            </Button>
            <Button type={"orange"} onClick={deleteNote}>
              Снять с публикации
            </Button>
          </>
        ) : (
          <Button
            className={styles.button}
            type="vivid"
            onClick={addToBookmark}
          >
            <BookmarkIcon size={13} />
            {bookmarkActionText}
          </Button>
        )}
      </div>
    </div>
  );
};
