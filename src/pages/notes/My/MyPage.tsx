import { FunctionalComponent } from "preact";
import cx from 'classnames'
import { Button, ButtonsBar } from "@components";
import { PageContainer } from "@components/Layout/PageContainer/PageContainer";
import { PageHeader } from "@components/Layout/PageHeader/PageHeader";
import { PageSection } from "@components/Layout/PageSection/PageSection";
import styles from './my-page.module.css';
import { FilteredNotesStore, myNotesStore } from "@stores/notes/filters.store";
import { useCell } from "@helpers/cell-state";

export const MyPage: FunctionalComponent = () => {
  const { filteredNotes: myNotes } = useCell(myNotesStore.state);

  return (
  <PageContainer>
    <PageSection>
      <PageHeader pageTitleText="Мои объявления" className={styles.header} />



    </PageSection>
    <ButtonsBar>
      <Button type={"vivid"} goTo="/notes/new" className={styles.newNoteBtn}>
        Написать объявление
      </Button>
    </ButtonsBar>
  </PageContainer>
  )
}
