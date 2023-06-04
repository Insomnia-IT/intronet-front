import { Badge } from "@components/badge/badge";
import { Card } from "@components/cards";
import { FunctionalComponent } from "preact";
import { getNoteDate } from "../../helpers/getNoteDate";
import styles from "./note-card.module.css";
import classNames from "classnames";
import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import { SvgIcon } from "@icons";

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
        <h3 className={"sh1"}>{title}</h3>
        <span>{text}</span>
      </div>
      <Badge type={"Adv"} background={categoryColor}>
        {categoryName}
      </Badge>
      <div className={classNames("sh3", "colorGray")}>
        {author}, {getNoteDate(updatedAt || createdAt)}
      </div>
    </Card>
  );
};