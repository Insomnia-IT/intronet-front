import { Button } from "@components";
import { useCell } from "@helpers/cell-state";
import { notesStore } from "@stores";
import { FunctionalComponent } from "preact";
import styles from "./note-sheet.module.css";
import { SvgIcon } from "@icons";
import { useIsBookmarkCell } from "../hooks/useIsBookmarkCell";
import { bookmarksStore } from "@stores/bookmarks.store";
import { NoteSheetContent } from "./NoteSheetContent/NoteSheetContent";

export type INoteSheetProps = {
  activeNoteId: string;
};

export const NoteSheet: FunctionalComponent<INoteSheetProps> = ({
  activeNoteId,
}) => {
  const activeNote = useCell(() => {
    return notesStore.getNote(activeNoteId);
  }, [activeNoteId]);

  if (!activeNote) {
    return null;
  }

  const { _id: id } = activeNote;
  const isBookmark = useIsBookmarkCell(id);
  const onBtnClick = () => {
    bookmarksStore.switchBookmark("note", id);
  };

  return (
    <div className={styles.container}>
      <NoteSheetContent note={activeNote} />

      <Button className={styles.button} type="vivid" onClick={onBtnClick}>
        <SvgIcon id="#bookmark" size={13} />
        {isBookmark ? "Удалить из избранного" : "Сохранить в избранное"}
      </Button>
    </div>
  );
};
