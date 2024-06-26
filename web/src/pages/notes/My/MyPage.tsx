import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { Button, ButtonsBar, PageLayout, Sheet } from "../../../components";
import { PageContainer } from "../../../components/Layout/PageContainer/PageContainer";
import { PageHeader } from "../../../components/Layout/PageHeader/PageHeader";
import { PageSection } from "../../../components/Layout/PageSection/PageSection";
import styles from "./my-page.module.css";
import { NotesList } from "../NotesList/NotesList";
import { INoteCardStylesProps } from "../NotesList/NoteCard/NoteCard";
import { ConstantFilterIds } from "../../../stores/notes/filters.store";
import { MyNoteSheet } from "./MyNoteSheet/MyNoteSheet";
import { useNotesRouter } from "../hooks/useNotesRouter";

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

// TODO: Сделать заглужку
export const MyPage: FunctionalComponent = () => {
  const { goToNew } = useNotesRouter();
  const [activeNoteId, setActiveNoteId] = useState<string>(null);
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
          {sections.map((section, idx) => (
            <NotesList
              filterIds={section.notes.filters}
              title={section.name}
              className={styles.section}
              notesProps={{
                ...commonNotesProps,
                withTTL: section.notes.withTTL,
                disabled: section.notes.disabled,
                onClick: idx === 1 ? onActualNoteClick : undefined,
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
          <MyNoteSheet noteId={activeNoteId} onClose={resetActiveNoteId} />
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
