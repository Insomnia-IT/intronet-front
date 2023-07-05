import { FunctionalComponent } from "preact";
import { useIsUserModeratorCell } from "../../hooks/useIsUserModeratorCell";
import { useNotesRouter } from "../../hooks/useNotesRouter";
import { PageSection } from "@components/Layout/PageSection/PageSection";
import { PageContainer } from "@components/Layout/PageContainer/PageContainer";
import { PageHeader } from "@components/Layout/PageHeader/PageHeader";
import notesStyles from "../../notes.module.css";
import { NotesList } from "../../NotesList/NotesList";
import { ConstantFilterIds } from "@stores/notes/filters.store";
import { useState } from "preact/hooks";
import { ModarationNoteSheet } from "../ModarationNoteSheet/ModarationNoteSheet";
import { Sheet } from "@components";

export const ModerationPage: FunctionalComponent = () => {
  const isModerator = useIsUserModeratorCell();
  const { goToNotes } = useNotesRouter();
  const [activeNoteId, setActiveNoteId] = useState<string>(null);
  const resetActiveNoteId = () => {
    setActiveNoteId(null);
  };

  if (!isModerator) {
    goToNotes();
  }

  return (
    <PageContainer>
      <PageSection>
        <PageHeader pageTitleText="Предложка" className={notesStyles.header} />

        <NotesList
          filterIds={[ConstantFilterIds.NoApproved]}
          notesProps={{
            disabled: true,
            withBookmarkIcon: false,
            forceOnClick: setActiveNoteId,
          }}
          fallBack={
            <p className={"sh2 colorMediumBlue"}>
              Нет объявлений, ожидающих модерации
            </p>
          }
        />
      </PageSection>
      <Sheet onClose={resetActiveNoteId} height="auto">
        {activeNoteId && (
          <ModarationNoteSheet
            noteId={activeNoteId}
            onClose={resetActiveNoteId}
          />
        )}
      </Sheet>
    </PageContainer>
  );
};
