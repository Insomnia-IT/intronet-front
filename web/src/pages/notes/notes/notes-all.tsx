import { Button, Sheet } from '@components'
import { PageLayout } from "@components/PageLayout";
import { useState } from "preact/hooks";
import { NotesSearch } from '../search/notes-search'
import { FiltersSlider } from '../filters-slider/filters-slider'
import { NoteSheet } from '../note-sheet/note-sheet'
import { GesturedNotesList } from '../notes-list/GesturedNoteList'
import { useNotesRouter } from '../hooks/useNotesRouter'
import styles from './notes-all.module.css';
import { ModerationPageLink } from '../moderator/moderation-page-link/moderation-page-link'

export function NotesAll() {
  const { filterId } = useNotesRouter();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const resetActiveNoteId = () => {
    setActiveNoteId(null);
  };

  return (
    <PageLayout
      withTapBar
      withCloseButton
      title="Объявления"
      search={NotesSearch}
      buttons={(
      <Button type="blue" goTo="/notes/my">
        Мои объявления
      </Button>
    )}>
        <>
          <FiltersSlider />
          <ModerationPageLink />
          <div className={styles.addNoteBtn}>
            <Button className={styles.btn} goTo={`/notes/new`}>
              + НАПИСАТЬ ОБЪЯВЛЕНИЕ
            </Button>
          </div>
          <GesturedNotesList
            className={styles.notesList}
            notesProps={{
              onClick: setActiveNoteId,
            }}
            filterIds={[filterId]}
          />
          <Sheet onClose={resetActiveNoteId} height="auto">
            {activeNoteId && <NoteSheet activeNoteId={activeNoteId} onClose={resetActiveNoteId} />}
          </Sheet>
        </>
    </PageLayout>
  )
};
