import { FunctionalComponent, Ref } from "preact";
import { useMemo } from "preact/hooks";
import cx from 'classnames';
import { Gesture } from "@helpers/Gestures";
import { useCell } from "@helpers/cell-state";
import { categoriesStore } from "@stores";
import { ConstantFilterIds, FilteredNotesStore } from "@stores/notes/filters.store";
import classNames from "classnames";
import { NoteGesturedCard } from "./NoteCard/NoteGesturedCard";
import styles from "./styles.module.css";
import { INoteCardStylesProps, NoteCard } from "./NoteCard/NoteCard";

export type INotesListProps = {
  className?: string;
  onNoteClick?: (noteId: string) => void;
  filterIds?: (ConstantFilterIds | string)[];
  notesProps?: INoteCardStylesProps;
  withGesture?: boolean;
  gesture?: Gesture;
  setRef?: Ref<HTMLDivElement>;
  title?: string;
};

export const NotesList: FunctionalComponent<INotesListProps> = ({
  className,
  filterIds = ['all'],
  withGesture,
  gesture,
  setRef,
  notesProps,
  title,
}) => {
  const store = useMemo(() => new FilteredNotesStore(filterIds), [...filterIds]);
  const { filteredNotes } = useCell(store.state);

  const NoteCardComponent = withGesture
    ? NoteGesturedCard
    : NoteCard;

  return (
    <>
      {Boolean(filteredNotes.length) && (
        <div className={classNames("textSmall", className)} ref={setRef}>
          {title && (
            <h3 className={cx('sh2', 'colorMediumBlue', styles.title)}>{title}</h3>
          )}

          <div className={styles.list}>
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
        </div>
      )}
    </>
  );
};
