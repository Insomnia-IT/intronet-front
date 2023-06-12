import { PageHeader } from "@components/Layout/PageHeader/PageHeader";
import { PageSection } from "@components/Layout/PageSection/PageSection";
import { FunctionalComponent } from "preact";
import { useEffect } from "preact/hooks";
import { INewNoteSections, useNotesRouter } from "../hooks/useNotesRouter";
import { RulesPage } from "./Rules/RulesPage/RulesPage";
import { PageContainer } from "@components/Layout/PageContainer/PageContainer";
import newStyles from "./new.module.css";
import noteStyles from "../notes.module.css";
import { EditorPage } from "./Editor/EditorPage";

export const NewNoteSwitch: FunctionalComponent = () => {
  const { subSection, goToNew } = useNotesRouter();

  useEffect(() => {
    if (!subSection) {
      goToNew();
    }
  }, [subSection]);

  const getPage = () => {
    switch (subSection as INewNoteSections) {
      case "rules": {
        return <RulesPage />;
      }

      case "editor": {
        return <EditorPage />;
      }
    }
  };
  console.debug("new switch");
  return (
    <PageContainer>
      <div className={noteStyles.page}>
        <PageSection className={newStyles.rulesHeader}>
          <PageHeader pageTitleText="Написать объявление" />
        </PageSection>
        {getPage()}
      </div>
    </PageContainer>
  );
};
