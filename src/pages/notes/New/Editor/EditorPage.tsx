import { FunctionalComponent } from "preact";
import { NewNoteForm } from "./NewNoteForm/NewNoteForm";
import { PageSection } from "@components/Layout/PageSection/PageSection";

export const EditorPage: FunctionalComponent = () => {
  return (
    <PageSection>
      <NewNoteForm />
    </PageSection>
  );
};
