import { FunctionalComponent } from "preact";
import { PageLayout } from "@components/PageLayout";
import { useState } from "preact/hooks";
import { AddNoteBtn } from "./AddNoteBtn/AddNoteBtn";
import { FilteriesSlider } from "./FilteriesSlider/FilteriesSlider";
import { useNotesRouter } from "./hooks/useNotesRouter";
import { Button, Sheet } from "../../components";
import { MyPage } from "./My/MyPage";
import { NewNoteSwitch } from "./New/NewNoteSwitch";
import { NoteSheet } from "./NoteSheet/NoteSheet";
import { GesturedNotesList } from "./NotesList/GesturedNoteList";
import styles from "./notes.module.css";
import { ModerationPageLink } from "./Moderator/ModerationPageLink/ModerationPageLink";
import { ModerationPage } from "./Moderator/ModerationPage/ModerationPage";
import { NotesSearch } from './search/notes-search'

export const NotesPage: FunctionalComponent = () => {
  const { section, filterId } = useNotesRouter();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const resetActiveNoteId = () => {
    setActiveNoteId(null);
  };

  switch (section) {
    case "search":
      return <NotesSearch />;

    case "new":
      return <NewNoteSwitch />;

    case "my":
      return <MyPage />;

    case "moderation":
      return <ModerationPage />;

    case undefined:
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
              <FilteriesSlider />
              <ModerationPageLink />
              <div className={styles.addNoteBtn}>
                <AddNoteBtn />
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
      );
  }
};
