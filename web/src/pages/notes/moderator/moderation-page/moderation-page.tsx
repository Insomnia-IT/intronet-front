import { FunctionalComponent } from "preact";
import { useIsUserModeratorCell } from "../../hooks/useIsUserModeratorCell";
import { useNotesRouter } from "../../hooks/useNotesRouter";
import { PageSection } from "../../../../components/Layout/PageSection/PageSection";
import { PageContainer } from "../../../../components/Layout/PageContainer/PageContainer";
import { NotesList } from "../../notes-list/NotesList";
import { ConstantFilterIds } from "../../../../stores/notes/filters.store";
import { useState } from "preact/hooks";
import { ModerationNoteSheet } from "../modaration-note-sheet/moderation-note-sheet";
import { Sheet } from "../../../../components";
import { PageHeader } from "@components/PageHeader/PageHeader";

export const ModerationPage: FunctionalComponent = () => {
  const isModerator = useIsUserModeratorCell();
  const { goToNotes } = useNotesRouter();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const resetActiveNoteId = () => {
    setActiveNoteId(null);
  };

  if (!isModerator) {
    goToNotes();
    return null;
  }

  return (
    <PageContainer>
      <PageSection>
        <PageHeader titleH2="Предложка" />

        <NotesList
          filterIds={[ConstantFilterIds.NoApproved]}
          notesProps={{
            disabled: true,
            withBookmarkIcon: false,
            forceOnClick: setActiveNoteId,
          }}
          fallBack={
            <p className="sh2 colorMediumBlue">
              Нет объявлений, ожидающих модерации
            </p>
          }
        />
      </PageSection>
      <Sheet onClose={resetActiveNoteId} height="auto">
        {activeNoteId && (
          <ModerationNoteSheet
            noteId={activeNoteId}
            onClose={resetActiveNoteId}
          />
        )}
      </Sheet>
    </PageContainer>
  );
};
