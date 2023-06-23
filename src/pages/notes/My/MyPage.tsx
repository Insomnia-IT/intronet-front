import { FunctionalComponent } from "preact";
import cx from 'classnames'
import { Button, ButtonsBar } from "@components";
import { PageContainer } from "@components/Layout/PageContainer/PageContainer";
import { PageHeader } from "@components/Layout/PageHeader/PageHeader";
import { PageSection } from "@components/Layout/PageSection/PageSection";
import styles from './my-page.module.css';
import { NotesList } from "../NotesList/NotesList";
import { INoteCardStylesProps } from "../NotesList/NoteCard/NoteCard";

const sections = [
  'На модерации',
  'Опубликованные',
  'Снятые с публикации',
]

export const MyPage: FunctionalComponent = () => {

  const commonNotesProps: INoteCardStylesProps = {
    withBookmarkIcon: false,
  }

  return (
  <PageContainer>
    <PageSection>
      <PageHeader pageTitleText="Мои объявления" className={styles.header} />
      <div className={styles.content}>
        {sections.map((section) => (
          <div className={cx(styles.section)}>
            <h3 className={cx('sh2', 'colorMediumBlue', styles.sectionName)}>{section}</h3>
            <NotesList filterId="my" notesProps={commonNotesProps} />
          </div>
        ))}
      </div>

    </PageSection>
    <ButtonsBar>
      <Button type={"vivid"} goTo="/notes/new" className={styles.newNoteBtn}>
        Написать объявление
      </Button>
    </ButtonsBar>
  </PageContainer>
  )
}
