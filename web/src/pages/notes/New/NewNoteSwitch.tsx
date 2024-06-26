import { PageContainer } from "../../../components/Layout/PageContainer/PageContainer";
import { PageHeader } from "../../../components/Layout/PageHeader/PageHeader";
import { PageSection } from "../../../components/Layout/PageSection/PageSection";
import { FunctionalComponent } from "preact";
import { useEffect } from "preact/hooks";
import { useNotesRouter } from "../hooks/useNotesRouter";
import noteStyles from "../notes.module.css";
import { EditorPage } from "./Editor/EditorPage";
import { SuccessPage } from "./Result/SuccessPage/SuccessPage";
import { RulesPage } from "./Rules/RulesPage/RulesPage";
import newStyles from "./new.module.css";
import { PageLayout } from "@components";

export const NewNoteSwitch: FunctionalComponent = () => {
  const { subSection, goToNew } = useNotesRouter();

  useEffect(() => {
    if (!subSection) {
      goToNew();
    }
  }, [subSection]);

  const getPage = () => {
    switch (subSection) {
      case "rules": {
        return <RulesPage />;
      }

      case "editor": {
        return <EditorPage />;
      }
    }
  };

  switch (subSection) {
    case "success": {
      return <SuccessPage />;
    }

    default: {
      return (
        <PageLayout title="Написать объявление" withCloseButton gap={4}>
            {getPage()}
        </PageLayout>
      );
    }
  }
};
