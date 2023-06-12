import { FunctionalComponent } from "preact";
import { PageContainer } from "@components/Layout/PageContainer/PageContainer";
import { PageHeader } from "@components/Layout/PageHeader/PageHeader";
import { PageSection } from "@components/Layout/PageSection/PageSection";
import { FilteriesSlider } from "./FilteriesSlider/FilteriesSlider";
import { useNotesRouter } from "./hooks/useNotesRouter";
import { NotesList } from "./NotesList/NotesList";
import { AddNoteBtn } from "./AddNoteBtn/AddNoteBtn";

import styles from "./notes.module.css";
import { NewNoteSwitch } from "./New/NewNoteSwitch";

export const NotesPage: FunctionalComponent = () => {
  const router = useNotesRouter();

  switch (router.section) {
    case "search":
      return <div>Notes search</div>;

    case "new":
      return <NewNoteSwitch />;

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
              <NotesList className={styles.notesList} />
            </PageSection>
          </div>
        </PageContainer>
      );
  }
};
