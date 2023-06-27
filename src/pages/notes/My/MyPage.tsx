import { FunctionalComponent } from "preact";
import cx from 'classnames'
import { Button, ButtonsBar } from "@components";
import { PageContainer } from "@components/Layout/PageContainer/PageContainer";
import { PageHeader } from "@components/Layout/PageHeader/PageHeader";
import { PageSection } from "@components/Layout/PageSection/PageSection";
import styles from './my-page.module.css';
import { NotesList } from "../NotesList/NotesList";
import { INoteCardStylesProps } from "../NotesList/NoteCard/NoteCard";
import { ConstantFilterIds } from "@stores/notes/filters.store";


const baseFilters: ConstantFilterIds[] = [ConstantFilterIds.My]
const sections: IMyPageSection[] = [
  {
    name: 'На модерации',
    notes: {
      filters: [...baseFilters, ConstantFilterIds.NoApproved],
      disabled: true,
    }
  },
  {
    name: 'Опубликованные',
    notes: {
      filters: baseFilters,
      withTTL: true,
    }
  },
  {
    name: 'Снятые с публикации',
    notes: {
      filters: [...baseFilters, ConstantFilterIds.NoActual],
      withTTL: true,
      disabled: true,
    }
  },
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

            <NotesList
              filterIds={section.notes.filters}
              title={section.name}
              notesProps={{
                ...commonNotesProps,
                withTTL: section.notes.withTTL,
                disabled: section.notes.disabled,
              }}
            />
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

type IMyPageSection = {
  name: string;
  notes: {
    filters: ConstantFilterIds[];
    withTTL?: boolean;
    disabled?: boolean;
  }
}
