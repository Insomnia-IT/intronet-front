import { FunctionalComponent } from "preact";
import classNames from "classnames";
import { useNotesRouter } from "../hooks/useNotesRouter";
import { useEffect, useMemo } from "preact/hooks";
import { FilteredNotesStore } from "@stores/notes/filters.store";
import { useCell } from "@helpers/cell-state";
import { NoteCard } from "./NoteCard/NoteCard";
import { categoriesStore } from "@stores";
import styles from "./styles.module.css";

export type INotesListProps = {
  className?: string;
  onNoteClick?: (noteId: string) => void;
};

export const NotesList: FunctionalComponent<INotesListProps> = ({
  className,
  onNoteClick,
}) => {
  const notesRouter = useNotesRouter();
  const { filterId } = notesRouter;
  const store = useMemo(() => new FilteredNotesStore(filterId), [filterId]);
  const { filteredNotes } = useCell(store.state);

  return (
    <ul className={classNames("textSmall", styles.list, className)}>
      {filteredNotes.map((note) => {
        const noteCategory = {
          name: categoriesStore.getCategory(note.categoryId)?.name,
          color: categoriesStore.getCategoryColor(note.categoryId),
        };

        return (
          <li key={note._id}>
            <NoteCard
              {...note}
              categoryName={noteCategory.name}
              categoryColor={noteCategory.color}
              onClick={onNoteClick}
            />
          </li>
        );
      })}
    </ul>
  );
};
