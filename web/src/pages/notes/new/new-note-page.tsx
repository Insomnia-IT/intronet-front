import { useEffect } from "preact/hooks";
import { useNotesRouter } from "../hooks/useNotesRouter";
import { EditorPage } from "./editor/editor-page";
import { SuccessPage } from "./result/success-page/success-page";
import { RulesPage } from "./rules/rules-page/rules-page";
import { PageLayout } from "@components";

export const NewNotePage = () => {
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
