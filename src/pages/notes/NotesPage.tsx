import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { PageContainer } from "@components/Layout/PageContainer/PageContainer";
import { PageHeader } from "@components/Layout/PageHeader/PageHeader";
import { PageSection } from "@components/Layout/PageSection/PageSection";
import { AddNoteBtn } from "./AddNoteBtn/AddNoteBtn";
import { FilteriesSlider } from "./FilteriesSlider/FilteriesSlider";
import { useNotesRouter } from "./hooks/useNotesRouter";
import { Button, ButtonsBar, CloseButton, Sheet } from "@components";
import { SvgIcon } from "@icons";
import { MyPage } from "./My/MyPage";
import { NewNoteSwitch } from "./New/NewNoteSwitch";
import { NoteSheet } from "./NoteSheet/NoteSheet";
import { GesturedNotesList } from "./NotesList/GesturedNoteList";
import styles from "./notes.module.css";

export const NotesPage: FunctionalComponent = () => {
  const router = useNotesRouter();
  const [activeNoteId, setActiveNoteId] = useState(null);
  const resetActiveNoteId = () => {
    setActiveNoteId(null);
  };

  switch (router.section) {
    case "search":
      return <div>Notes search</div>;

    case "new":
      return <NewNoteSwitch />;

    case "my":
      return <MyPage />

    case undefined:
      return (
        <PageContainer>
          <div className={styles.page}>
            <PageSection>
              <div className={styles.header}>
                <PageHeader pageTitleText="Объявления" />
              </div>
            </PageSection>
            <div className={styles.filters}>
              <FilteriesSlider />
            </div>
            <PageSection>
              <div className={styles.addNoteBtn}>
                <AddNoteBtn />
              </div>
              <GesturedNotesList
                className={styles.notesList}
                onNoteClick={setActiveNoteId}
              />
            </PageSection>
            <ButtonsBar at="bottom">
              {/* <Button type="vivid" goTo="/notes/search">
                <SvgIcon id="#search" size={15} />
              </Button> */}
              <Button type="vivid" goTo="/notes/my">
                Мои объявления
              </Button>
            </ButtonsBar>
            <Sheet onClose={resetActiveNoteId} height="auto">
              {activeNoteId && (
                <>
                  <NoteSheet
                    activeNoteId={activeNoteId}
                  />
                  <CloseButton onClick={resetActiveNoteId} />
                </>
              )}
            </Sheet>
          </div>
        </PageContainer>
      );
  }
};
