import { FunctionalComponent } from "preact";
import cx from "classnames";
import { NoteSheetContent } from "../../note-sheet/note-sheet-content/note-sheet-content";
import { SvgIcon } from "../../../../icons";
import { getNoteTTLText } from "../../helpers/getNoteTTLText";
import { notesStore } from "../../../../stores";
import { useCell } from "../../../../helpers/cell-state";
import { OnlineButton } from "../../../../components/buttons/online-button";
import styles from "./my-notes.css";

export type MyNotes = {
  noteId: string;
  onClose?: () => void;
};

export const MyNotes: FunctionalComponent<MyNotes> = ({
  noteId,
  onClose,
}) => {
  const note = useCell(() => notesStore.getNote(noteId), [noteId]);

  const onDeleteClick = () => {
    notesStore.deleteNote(noteId);
  };

  if (!notesStore.checkIsNoteActual(note)) {
    onClose();
  }

  const { isDeleted, deletedAt, TTL } = note;

  return (
    <>
      <NoteSheetContent
        note={note}
        className={styles.content}
        onClose={onClose}
      />

      <div className={cx(styles.deletingTimeContainer, "sh3", "colorMediumBlue")}>
        <SvgIcon
          id="#warinigCircle"
          style={{ flexShrink: 0 }}
          width={24}
          height={24}
        />
        <span>{getNoteTTLText({ isDeleted, deletedAt, TTL })}</span>
      </div>

      <OnlineButton type="vivid" onClick={onDeleteClick}>
        Снять с публикации
      </OnlineButton>
    </>
  );
};
