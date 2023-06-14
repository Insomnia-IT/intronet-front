import { Badge } from "@components/badge/badge";
import { Card } from "@components/cards";
import { FunctionalComponent } from "preact";
import { getNoteDate } from "../../helpers/getNoteDate";
import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import { SvgIcon } from "@icons";
import styles from "./note-card.module.css";
import classNames from "classnames";

export type INoteCardProps = INote & {
  categoryColor: string;
  categoryName: string;
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
  } = props;
  const isBookmark = useCell(
    () => Boolean(bookmarksStore.getBookmark("note", id)),
    [id]
  );

  return (
    <Card background="Soft" borderType="LeftCloud" className={styles.card}>
      {isBookmark && <SvgIcon id="#bookmark" className={styles.bookmarkIcon} />}
      <div className={styles.content}>
        <h3 className={classNames("sh1", styles.noteTitle)}>{title}</h3>
        <span className={styles.noteText}>{text}</span>
      </div>
      {categoryName && (
        <Badge type={"Adv"} background={categoryColor}>
          {categoryName}
        </Badge>
      )}
      <div className={classNames("sh3", "colorGray", styles.footer)}>
        {author.name}, {getNoteDate(updatedAt || createdAt)}
      </div>
    </Card>
  );
};
