import { FunctionalComponent } from "preact";
import { PageContainer } from "../../../../../components/Layout/PageContainer/PageContainer";
import { PageSection } from "../../../../../components/Layout/PageSection/PageSection";
import { PageHeader } from "../../../../../components/Layout/PageHeader/PageHeader";
import noteStyles from "../../../notes.module.css";
import newStyles from "../../new.module.css";
import classNames from "classnames";
import { Button, ButtonsBar } from "../../../../../components";
import styles from "./success-page.module.css";
import { useNotesRouter } from "../../../hooks/useNotesRouter";

export const SuccessPage: FunctionalComponent = () => {
  const { goToNotes } = useNotesRouter();

  const onBtnClick = () => {
    goToNotes();
  };

  return (
    <PageContainer>
      <div className={noteStyles.page}>
        <PageSection className={newStyles.notesHeader}>
          <PageHeader pageTitleText="Готово" />
        </PageSection>
        <PageSection className={styles.content}>
          <span className={classNames("text colorMediumBlue")}>
            Объявление отправлено на&nbsp;проверку.
            <br />
            <br />
            Днём это занимает примерно 30&nbsp;минут. Ночью модераторы могут
            отдыхать и&nbsp;опубликуют ваше объявление только утром.
          </span>

          <ButtonsBar>
            <Button type={"vivid"} className={styles.btn} onClick={onBtnClick}>
              назад к объявлениям
            </Button>
          </ButtonsBar>
        </PageSection>
      </div>
    </PageContainer>
  );
};
