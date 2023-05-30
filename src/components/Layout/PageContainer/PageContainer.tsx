import { FunctionalComponent, JSX } from "preact";
import styles from "../layout.module.css";

export const PageContainer: FunctionalComponent<
  JSX.ElementChildrenAttribute
> = ({ children }) => {
  return <div className={styles.pageContainer}>{children}</div>;
};
