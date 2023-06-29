import { CloseButton } from "@components";
import { FunctionalComponent } from "preact";
import cx from "classnames";
import { NoteSheetContent } from "../../NoteSheet/NoteSheetContent/NoteSheetContent";
import styles from "./my-note-sheet.css";
import { SvgIcon } from "@icons";
import { getNoteTTLText } from "../../helpers/getNoteTTLText";
import { notesStore } from "@stores";
import { useCell } from "@helpers/cell-state";
import { OnlineButton } from "@components/buttons/online-button";

export type MyNoteSheet = {
  noteId: string;
  onClose?: () => void;
};

export const MyNoteSheet: FunctionalComponent<MyNoteSheet> = ({
  noteId,
  onClose,
}) => {
  const note = useCell(() => {
    return notesStore.getNote(noteId);
  }, [noteId]);
  const { isDeleted, deletedAt, TTL } = note;
  const onDeleteClick = () => {
    notesStore.deleteNote(noteId);
  };

  if (!notesStore.checkIsNoteActual(note)) {
    onClose();
  }

  return (
    <div>
      <CloseButton />
      <NoteSheetContent note={note} className={styles.content} />
      <div
        className={cx(styles.deletingTimeContainer, "sh3", "colorMediumBlue")}
      >
        <SvgIcon
          id={"#warinigCircle"}
          style={{ flexShrink: 0 }}
          width={24}
          height={24}
        />
        <span>{getNoteTTLText({ isDeleted, deletedAt, TTL })}</span>
      </div>

      <OnlineButton type={"orange"} onClick={onDeleteClick}>
        Снять с публикации
      </OnlineButton>
    </div>
  );
};
