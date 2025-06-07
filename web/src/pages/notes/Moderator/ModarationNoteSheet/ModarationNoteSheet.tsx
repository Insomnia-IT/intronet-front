import { useCell } from "../../../../helpers/cell-state";
import { notesStore } from "../../../../stores";
import { FunctionalComponent } from "preact";
import { NoteSheetContent } from "../../NoteSheet/NoteSheetContent/NoteSheetContent";
import styles from "./modaration-note-sheet.module.css";
import { OnlineButton } from '@components/buttons/online-button'

type IModarationNoteSheetProps = {
  noteId: string;
  onClose?: () => void;
};

export const ModarationNoteSheet: FunctionalComponent<
  IModarationNoteSheetProps
> = ({ noteId, onClose }) => {
  const note = useCell(() => notesStore.getNote(noteId), [noteId]);
  const onApprove = () => {
    notesStore.approveNote(noteId);
  };
  const onReject = () => {
    notesStore.rejectNote(noteId);
  };

  if (!note || note.isApproved) {
    onClose();
    return null;
  }

  return (
    <>
      <NoteSheetContent note={note} onClose={onClose} />

      <div className={styles.actionsBlock}>
        <OnlineButton type={"orange"} onClick={onReject}>
          Отклонить
        </OnlineButton>
        <OnlineButton type={"blue"} onClick={onApprove}>
          Опубликовать
        </OnlineButton>
      </div>
    </>
  );
};
