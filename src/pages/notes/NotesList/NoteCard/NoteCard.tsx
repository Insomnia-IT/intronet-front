import { Badge } from "@components/badge/badge";
import { Card } from "@components/cards";
import { FunctionalComponent } from "preact";
import { getNoteDate } from "../../helpers/getNoteDate";
import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import { SvgIcon } from "@icons";
import styles from "./note-card.module.css";
import cx from "classnames";
import { useIsBookmarkCell } from "../../hooks/useIsBookmarkCell";
import { Gesture } from "@helpers/Gestures";
import { BookmarkGesture } from "@components/BookmarkGesture/BookmarkGesture";
import { TargetedEvent } from "preact/compat";

export type INoteCardProps = INote & {
  categoryColor: string;
  categoryName: string;
  onClick?: (id: string) => void;
  gesture?: Gesture;
};

export const NoteCard: FunctionalComponent<INoteCardProps> = (props) => {
  const {
    author,
    categoryName,
    categoryColor,
    createdAt,
    title,
    text,
    updatedAt,
    _id: id,
    gesture,
    onClick,
  } = props;
  const isBookmark = useIsBookmarkCell(id);
  const onCardClick = () => {
    onClick && onClick(id);
  };
  const switchBookmark = () => bookmarksStore.switchBookmark('note', id);
  const onBookmarkIconClick = (e: TargetedEvent) => {
    e.stopPropagation();
    switchBookmark()
  }

  return (
    <BookmarkGesture
      gesture={gesture}
      hasBookmark={isBookmark}
      switchBookmark={switchBookmark}
      borderRadius={24}
      contentNoOpacity
    >
      {({classNames, iconOpacity}) => {
        return (
          <Card
            background="Soft"
            borderType="LeftCloud"
            className={styles.card}
            onClick={onCardClick}
          >
            <SvgIcon
              id="#bookmark"
              className={cx(styles.bookmarkIcon, classNames)}
              onClick={onBookmarkIconClick}
              style={{ opacity: iconOpacity }}
            />
            <div className={styles.content}>
              <h3 className={cx("sh1", styles.noteTitle)}>{title}</h3>
              <span className={styles.noteText}>{text}</span>
            </div>
            {categoryName && (
              <Badge type={"Adv"} background={categoryColor}>
                {categoryName}
              </Badge>
            )}
            <div className={cx("sh3", "colorGray", styles.footer)}>
              {typeof author === 'string' ? author : author && author.name}, {getNoteDate(updatedAt || createdAt)}
            </div>
          </Card>
        )
      }}
    </BookmarkGesture>
  );
};
