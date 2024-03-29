import { FunctionalComponent } from "preact";
import { PageLayout } from "@components/PageLayout";
import { useState } from "preact/hooks";
import { PageHeader } from "../../components/Layout/PageHeader/PageHeader";
import { PageSection } from "../../components/Layout/PageSection/PageSection";
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

export const NotesPage: FunctionalComponent = () => {
  const { section, filterId } = useNotesRouter();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const resetActiveNoteId = () => {
    setActiveNoteId(null);
  };

  switch (section) {
    case "search":
      return <div>Notes search</div>;

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
          buttons={(
          <Button type="vivid" goTo="/notes/my">
            Мои объявления
          </Button>
        )}>
          <div className={styles.page}>
            <PageSection>
              <div className={styles.header}>
                <PageHeader pageTitleText="Объявления" />
              </div>
            </PageSection>
            <div className={styles.filters}>
              <FilteriesSlider />
            </div>
            <PageSection className={styles.myPageContent}>
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
            </PageSection>
            <Sheet onClose={resetActiveNoteId} height="auto">
              {activeNoteId && <NoteSheet activeNoteId={activeNoteId} onClose={resetActiveNoteId} />}
            </Sheet>
          </div>
        </PageLayout>
      );
  }
};
