import { FunctionalComponent, Ref } from "preact";
import { useMemo } from "preact/hooks";
import { Gesture } from "@helpers/Gestures";
import { useCell } from "@helpers/cell-state";
import { categoriesStore } from "@stores";
import { FilteredNotesStore } from "@stores/notes/filters.store";
import classNames from "classnames";
import { NoteGesturedCard } from "./NoteCard/NoteGesturedCard";
import styles from "./styles.module.css";
import { INoteCardStylesProps, NoteCard } from "./NoteCard/NoteCard";

export type INotesListProps = {
  className?: string;
  onNoteClick?: (noteId: string) => void;
  filterId?: string;
  notesProps?: INoteCardStylesProps;
  withGesture?: boolean;
  gesture?: Gesture;
  setRef?: Ref<HTMLDivElement>;
};

export const NotesList: FunctionalComponent<INotesListProps> = ({
  className,
  filterId = 'all',
  withGesture,
  gesture,
  setRef,
  notesProps,
}) => {
  const store = useMemo(() => new FilteredNotesStore(filterId), [filterId]);
  const { filteredNotes } = useCell(store.state);

  const NoteCardComponent = withGesture
    ? NoteGesturedCard
    : NoteCard;

  return (
    <div className={classNames("textSmall", styles.list, className)} ref={setRef}>
      {filteredNotes.map((note) => {
        const noteCategory = {
          name: categoriesStore.getCategory(note.categoryId)?.name,
          color: categoriesStore.getCategoryColor(note.categoryId),
        };

        return (
          <NoteCardComponent
            {...note}
            categoryName={noteCategory.name}
            categoryColor={noteCategory.color}
            {...notesProps}
            {...(gesture ? {gesture} : {})}
          />
        );
      })}
    </div>
  );
};
