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
import { SuccessPage } from "./Result/SuccessPage/SuccessPage";

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

  switch (subSection as INewNoteSections) {
    case "success": {
      return <SuccessPage />;
    }

    default: {
      return (
        <PageContainer>
          <div className={noteStyles.page}>
            <PageSection className={newStyles.notesHeader}>
              <PageHeader pageTitleText="Написать объявление" />
            </PageSection>
            {getPage()}
          </div>
        </PageContainer>
      );
    }
  }
};
