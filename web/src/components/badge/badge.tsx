import classNames from "classnames";
import { COLORS } from "../../constants";
import { FunctionalComponent, VNode } from "preact";
import styles from "./badge.module.css";
import { SvgIcon } from "../../icons";

export type IBadgeProps = {
  type: `Age${number}` | "Adv" | "Location" | "Change";
  background?: string | keyof typeof COLORS;
  className?: string;
};

export const Badge: FunctionalComponent<IBadgeProps> = (props) => {
  const { type = "Adv", background, children, className } = props;
  const maybeColorStyle = background
    ? {
        background,
      }
    : {};

  return (
    <div
      className={classNames(styles.badge, styles["badge" + type], className)}
      style={maybeColorStyle}
    >
      {type === "Location" && <SvgIcon id={"location"} size={16} />}
      {type.startsWith('Age') && `${type.substring(3)}+`}
      {children}
    </div>
  );
};
