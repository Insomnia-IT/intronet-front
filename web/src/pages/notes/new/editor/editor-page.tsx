import { FunctionalComponent } from "preact";
import { NewNoteForm } from "./new-note-form/new-note-form";
import { PageSection } from "../../../../components/Layout/PageSection/PageSection";
import { useNotesRouter } from "../../hooks/useNotesRouter";

export const EditorPage: FunctionalComponent = () => {
  const { goToNew } = useNotesRouter();
  const onAddNote = (success: boolean) => {
    if (success) {
      goToNew("success");
    }
  };

  return (
    <PageSection>
      <NewNoteForm onAddNote={onAddNote} />
    </PageSection>
  );
};
