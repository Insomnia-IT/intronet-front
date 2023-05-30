import { FunctionalComponent, JSX } from "preact";
import styles from "../layout.module.css";

export const PageSection: FunctionalComponent<
  IPageSectionProps & JSX.ElementChildrenAttribute
> = ({ children, theme = "light" }) => {
  let themeClassName = "";

  switch (theme) {
    case "light":
      themeClassName = "";
      break;

    case "dark":
      themeClassName = styles.pageSection_dark;
  }

  return (
    <div className={styles.pageSection + " " + themeClassName}>{children}</div>
  );
};

type IPageSectionProps = {
  theme?: "light" | "dark";
};
