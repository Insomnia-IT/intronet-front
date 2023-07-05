import { FunctionalComponent } from "preact";
import { TargetedEvent } from "preact/compat";
import cx from "classnames";
import { Badge } from "@components/badge/badge";
import { Card } from "@components/cards";
import { COLORS } from "@constants";
import { SvgIcon } from "@icons";
import { getNoteDate } from "../../helpers/getNoteDate";
import styles from "./note-card.module.css";
import { getNoteTTLText } from "../../helpers/getNoteTTLText";

export type INoteCardProps = INote &
  INoteCardStylesProps & {
    categoryColor: string;
    categoryName: string;
  };

export type INoteCardStylesProps = {
  className?: string;
  onClick?: (id: string, e: TargetedEvent) => void;
  forceOnClick?: INoteCardStylesProps["onClick"];
  iconOpacity?: number;
  iconClassNames?: string[];
  onIconClick?: (e: TargetedEvent) => void;
  withTTL?: boolean;
  withBookmarkIcon?: boolean;
  disabled?: boolean;
};

export const NoteCard: FunctionalComponent<INoteCardProps> = (props) => {
  const {
    _id,
    author,
    categoryName,
    categoryColor,
    createdAt,
    title,
    text,
    updatedAt,
    TTL,
    isDeleted,
    deletedAt,
    iconOpacity,
    iconClassNames,
    withTTL = false,
    disabled = false,
    withBookmarkIcon = true,

    onClick,
    forceOnClick,
    onIconClick,
    className,
  } = props;
  const onCardClick = (e: TargetedEvent) => {
    if (disabled) {
      forceOnClick && forceOnClick(_id, e);
      e.stopPropagation();
      return;
    }

    onClick && onClick(_id, e);
  };

  return (
    <div className={styles.cardContainer}>
      <Card
        background="Soft"
        borderType="LeftCloud"
        className={cx(styles.card, className, {
          [styles.cardDisabled]: disabled,
        })}
        onClick={onCardClick}
        id={_id}
      >
        {withBookmarkIcon && (
          <SvgIcon
            id="#bookmark"
            className={cx(styles.bookmarkIcon, iconClassNames)}
            onClick={!disabled && onIconClick}
            style={{ opacity: iconOpacity }}
          />
        )}
        <div className={styles.content}>
          <h3 className={cx("sh1", styles.noteTitle)}>{title}</h3>
          <span className={styles.noteText}>{text}</span>
        </div>
        {categoryName && (
          <Badge
            type={"Adv"}
            background={disabled ? COLORS.inactiveGray : categoryColor}
          >
            {categoryName}
          </Badge>
        )}
        <div
          className={cx(
            "sh3",
            disabled ? "colorInactiveGrey" : "colorGray",
            styles.footer
          )}
        >
          {typeof author === "string" ? author : author && author.name},{" "}
          {getNoteDate(updatedAt || createdAt)}
        </div>
      </Card>
      {withTTL && (
        <span className={cx(styles.ttlText, "textSmall", "colorGray")}>
          {getNoteTTLText({ deletedAt, isDeleted, TTL })}
        </span>
      )}
    </div>
  );
};
