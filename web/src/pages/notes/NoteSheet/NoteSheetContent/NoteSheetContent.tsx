import { FunctionalComponent } from "preact";
import cx from "classnames";
import { getNoteDate } from "../../helpers/getNoteDate";
import styles from "./note-sheet-content.css";
import { CloseButton } from "../../../../components";

export type INoteSheetContentProps = {
  note: INote;
  className?: string;
  onClose?: () => void;
};

export const NoteSheetContent: FunctionalComponent<INoteSheetContentProps> = ({
  note,
  className,
  onClose,
}) => {
  const { title, text, author, updatedAt, createdAt } = note;

  return (
    <>
      <CloseButton onClick={onClose} />
      <div className={cx(styles.container, className)}>
        <h3 className={cx("sh1", styles.title)}>{title}</h3>
        <p className={cx("text", "colorMediumBlue", styles.text)}>{text}</p>
        <span className={cx("sh3", "colorGrey", styles.author)}>
          {typeof author === "string" ? author : author && author.name},{" "}
          {getNoteDate(updatedAt || createdAt)}
        </span>
      </div>
    </>
  );
};
