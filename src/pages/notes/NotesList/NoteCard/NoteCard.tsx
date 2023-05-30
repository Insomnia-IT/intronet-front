import { Badge } from "@components/badge/badge";
import { Card } from "@components/cards";
import { FunctionalComponent } from "preact";
import { getNoteDate } from "../../helpers/getNoteDate";
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
  } = props;

  return (
    <Card background="Soft" borderType="LeftCloud">
      <div className={styles.content}>
        <h3 className={"sh1"}>{title}</h3>
        <span>{text}</span>
      </div>
      <Badge content={categoryName} type={"Adv"} background={categoryColor} />
      <div className={classNames("sh3", "colorGray")}>
        {author}, {getNoteDate(updatedAt || createdAt)}
      </div>
    </Card>
  );
};
