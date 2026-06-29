import { FunctionalComponent } from "preact";
import { PageContainer } from "../../../../../components/Layout/PageContainer/PageContainer";
import { PageSection } from "../../../../../components/Layout/PageSection/PageSection";
import classNames from "classnames";
import { Button, ButtonsBar } from "../../../../../components";
import { useNotesRouter } from "../../../hooks/useNotesRouter";
import styles from "./success-page.module.css";
import { PageHeader } from "@components/PageHeader/PageHeader";


export const SuccessPage: FunctionalComponent = () => {
  const { goToNotes } = useNotesRouter();

  const onBtnClick = () => {
    goToNotes();
  };

  return (
    <PageContainer>
      <div className={styles.page}>
        <PageSection className={styles.notesHeader}>
          <PageHeader titleH2="Готово" />
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
