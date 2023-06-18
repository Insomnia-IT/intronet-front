import { Button, ButtonsBar, Sheet } from "@components";
import { useCell } from "@helpers/cell-state";
import { notesStore } from "@stores";
import { FunctionalComponent } from "preact";
import { getNoteDate } from "../helpers/getNoteDate";
import styles from './note-sheet.module.css'
import classNames from "classnames";
import { SvgIcon } from "@icons";
import { useIsBookmarkCell } from "../hooks/useIsBookmarkCell";
import { bookmarksStore } from "@stores/bookmarks.store";

export type INoteSheetProps = {
  activeNoteId: string;
};

export const NoteSheet: FunctionalComponent<INoteSheetProps> = ({
  activeNoteId,
}) => {
  const activeNote = useCell(() => {
    return notesStore.getNote(activeNoteId);
  }, [activeNoteId]);

  if (!activeNote) {
    return null;
  }

  const { title, text, author, createdAt, updatedAt, _id: id } = activeNote;
  const isBookmark = useIsBookmarkCell(id);
  const onBtnClick = () => {
    bookmarksStore.switchBookmark('note', id)
  }

  return (
      <div className={styles.container}>
        <h3 className={classNames("sh1", styles.title)}>{title}</h3>
        <p className={classNames('text', 'colorMediumBlue', styles.text)}>{text}</p>
        <span className={classNames('sh3', 'colorGray')}>
          {typeof author === 'string' ? author : author && author.name}, {getNoteDate(updatedAt || createdAt)}
        </span>

        <ButtonsBar>
          <Button className={styles.button} type="vivid" onClick={onBtnClick}>
            <SvgIcon id="#bookmark" size={13} />
            {isBookmark ? 'Удалить из избранного' : 'Сохранить в избранное'}
          </Button>
        </ButtonsBar>
      </div>
  );
};
