import { FunctionalComponent, JSX } from "preact";
import styles from "../layout.module.css";
import classNames from "classnames";

export const PageSection: FunctionalComponent<
  IPageSectionProps & JSX.ElementChildrenAttribute
> = ({ children, theme = "light", className }) => {
  let themeClassName = "";

  switch (theme) {
    case "light":
      themeClassName = "";
      break;

    case "dark":
      themeClassName = styles.pageSection_dark;
  }

  return (
    <div className={classNames(styles.pageSection, themeClassName, className)}>
      {children}
    </div>
  );
};

type IPageSectionProps = {
  theme?: "light" | "dark";
  className?: string;
};
