import { FunctionalComponent } from "preact";
import { NewNoteForm } from "./new-note-form/new-note-form";
import { useNotesRouter } from "../../hooks/useNotesRouter";

export const EditorPage: FunctionalComponent = () => {
  const { goToNew } = useNotesRouter();
  const onAddNote = (success: boolean) => {
    if (success) {
      goToNew("success");
    }
  };

  return (
      <NewNoteForm onAddNote={onAddNote} />
  );
};
