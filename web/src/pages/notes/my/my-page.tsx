import { useState } from "preact/hooks";
import { Button, ButtonsBar, PageLayout, Sheet } from "../../../components";
import { NotesList } from "../notes-list/NotesList";
import { ConstantFilterIds } from "../../../stores/notes/filters.store";
import { MyNotes } from "./my-notes/my-notes";
import { useNotesRouter } from "../hooks/useNotesRouter";
import styles from "./my-page.module.css";
import { INoteCardStylesProps } from '../notes-list/note-card/note-card'

const baseFilters: ConstantFilterIds[] = [ConstantFilterIds.My];
const sections: IMyPageSection[] = [
  {
    name: "На модерации",
    notes: {
      filters: [...baseFilters, ConstantFilterIds.NoApproved],
      disabled: true,
    },
  },
  {
    name: "Опубликованные",
    notes: {
      filters: baseFilters,
      withTTL: true,
    },
  },
  {
    name: "Снятые с публикации",
    notes: {
      filters: [...baseFilters, ConstantFilterIds.NoActual],
      withTTL: true,
      disabled: true,
    },
  },
];

export const MyPage = () => {
  const { goToNew } = useNotesRouter();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const onActualNoteClick = (noteId: string) => {
    setActiveNoteId(noteId);
  };

  const resetActiveNoteId = () => {
    setActiveNoteId(null);
  };

  const commonNotesProps: INoteCardStylesProps = {
    withBookmarkIcon: false,
  };

  return (
    <PageLayout title="Мои объявления" withCloseButton>
      <div className={styles.content}>
        {sections.map((section, index) => (
          <NotesList
            key={index}
            filterIds={section.notes.filters}
            title={section.name}
            className={styles.section}
            notesProps={{
              ...commonNotesProps,
              withTTL: section.notes.withTTL,
              disabled: section.notes.disabled,
              onClick: index === 1 ? onActualNoteClick : undefined,
            }}
          />
        ))}
      </div>

      <ButtonsBar>
        <Button
          type="blue"
          onClick={() => goToNew()}
          className={styles.newNoteBtn}
        >
          Написать объявление
        </Button>
      </ButtonsBar>

      <Sheet height="auto" onClose={resetActiveNoteId}>
        {activeNoteId && (
          <MyNotes noteId={activeNoteId} onClose={resetActiveNoteId} />
        )}
      </Sheet>
    </PageLayout>
  );
};

type IMyPageSection = {
  name: string;
  notes: {
    filters: ConstantFilterIds[];
    withTTL?: boolean;
    disabled?: boolean;
  };
};
