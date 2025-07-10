import { FunctionalComponent } from "preact";
import { Button } from "../../../../components";
import { useCell } from "../../../../helpers/cell-state";
import { noApprovedNotesStore } from "../../../../stores/notes/filters.store";
import { useIsUserModeratorCell } from "../../hooks/useIsUserModeratorCell";

const Link: FunctionalComponent = () => {
  const noApprovedNotesCount = useCell(() => {
    return noApprovedNotesStore.filteredNotes.length;
  });

  return (
    <Button
      type={"text"}
      style={{ alignSelf: "flex-start", width: "auto" }}
      goTo={"/notes/moderation"}
    >
      Предложка {noApprovedNotesCount ? `(${noApprovedNotesCount})` : ""} →
    </Button>
  );
};

export const ModerationPageLink: FunctionalComponent = () => {
  const isModerator = useIsUserModeratorCell();

  if (!isModerator) {
    return null;
  }

  return <Link />;
};
