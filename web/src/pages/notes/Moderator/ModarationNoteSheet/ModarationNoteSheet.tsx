import { useCell } from "../../../../helpers/cell-state";
import { notesStore } from "../../../../stores";
import { FunctionalComponent } from "preact";
import { NoteSheetContent } from "../../NoteSheet/NoteSheetContent/NoteSheetContent";
import styles from "./modaration-note-sheet.module.css";
import { Button } from "../../../../components";
import { useOnlineState } from "../../../../helpers/useOnlineState";

type IModarationNoteSheetProps = {
  noteId: string;
  onClose?: () => void;
};

export const ModarationNoteSheet: FunctionalComponent<
  IModarationNoteSheetProps
> = ({ noteId, onClose }) => {
  const note = useCell(() => notesStore.getNote(noteId), [noteId]);
  const { isOnline } = useOnlineState();
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
        <Button type={"orange"} disabled={!isOnline} onClick={onReject}>
          Отклонить
        </Button>
        <Button type={"blue"} disabled={!isOnline} onClick={onApprove}>
          Опубликовать
        </Button>
      </div>
    </>
  );
};
