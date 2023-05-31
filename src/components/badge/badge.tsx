import classNames from "classnames";
import { COLORS } from "@constants";
import { FunctionalComponent } from "preact";
import styles from "./badge.module.css";
import { SvgIcon } from "@icons";

export type IBadgeProps = {
  type: "Age12" | "Age18" | "Adv" | "Location" | "Change";
  background?: string | keyof typeof COLORS;
  content?: string | number;
  className?: string;
};

export const Badge: FunctionalComponent<IBadgeProps> = (props) => {
  const { type = "Adv", background, content = null, className } = props;
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
      {type === "Age12" && "12+"}
      {type === "Age18" && "18+"}
      {content}
    </div>
  );
};
