import { FunctionalComponent } from "preact";
import { TargetedEvent } from "preact/compat";
import { Badge } from "@components/badge/badge";
import { Card } from "@components/cards";
import { SvgIcon } from "@icons";
import cx from "classnames";
import { getNoteDate } from "../../helpers/getNoteDate";
import styles from "./note-card.module.css";

export type INoteCardProps = INote & {
  categoryColor: string;
  categoryName: string;
  className?: string;
  onClick?: (e: TargetedEvent) => void;
  iconOpacity?: number;
  iconClassNames?: string[];
  onIconClick?: (e: TargetedEvent) => void;
  withTTL?: boolean;
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
    iconOpacity,
    iconClassNames,
    withTTL = false,
    onClick,
    onIconClick,
    className,
  } = props;
  const onCardClick = (e: TargetedEvent) => {
    onClick && onClick(e);
  };

  return (
    <Card
      background="Soft"
      borderType="LeftCloud"
      className={cx(styles.card, className)}
      onClick={onCardClick}
    >
      <SvgIcon
        id="#bookmark"
        className={cx(styles.bookmarkIcon, iconClassNames)}
        onClick={onIconClick}
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
  );
};
