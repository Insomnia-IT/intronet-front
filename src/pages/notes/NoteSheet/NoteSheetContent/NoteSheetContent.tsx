import { FunctionalComponent } from "preact";
import cx from "classnames";
import { getNoteDate } from "../../helpers/getNoteDate";
import styles from "./note-sheet-content.css";

export type INoteSheetContentProps = {
  note: INote;
  className?: string;
};

export const NoteSheetContent: FunctionalComponent<INoteSheetContentProps> = ({
  note,
  className,
}) => {
  const { title, text, author, updatedAt, createdAt } = note;

  return (
    <div className={cx(styles.container, className)}>
      <h3 className={cx("sh1", styles.title)}>{title}</h3>
      <p className={cx("text", "colorMediumBlue", styles.text)}>{text}</p>
      <span className={cx("sh3", "colorGray", styles.author)}>
        {typeof author === "string" ? author : author && author.name},{" "}
        {getNoteDate(updatedAt || createdAt)}
      </span>
    </div>
  );
};
