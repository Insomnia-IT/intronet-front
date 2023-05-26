import { FunctionalComponent } from "preact";
import { useNotesRouter } from "../hooks/useNotesRouter";
import { useEffect, useMemo } from "preact/hooks";
import { FilteredNotesStore } from "@stores/notes/filters.store";
import { useCell } from "@helpers/cell-state";
import { Card } from "@components/cards";

export const NotesList: FunctionalComponent = () => {
  const notesRouter = useNotesRouter();
  const { filterId } = notesRouter;
  const store = useMemo(() => new FilteredNotesStore(filterId), [filterId]);
  const { filteredNotes } = useCell(store.state);

  useEffect(() => {
    console.debug("NotesList", filteredNotes);
  }, [filteredNotes]);

  return (
    <div>
      {filteredNotes.map((note) => {
        return (
          <Card background="Vivid">
            <h3>{note.title}</h3>
            <span>{note.text}</span>
          </Card>
        );
      })}
    </div>
  );
};
