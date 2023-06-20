import { FunctionalComponent, JSX } from "preact";
import styles from "../layout.module.css";
import classNames from "classnames";

export const PageContainer: FunctionalComponent<JSX.HTMLAttributes> = ({ children, className, ...props }) => {
  return (
    <div className={classNames(styles.pageContainer, className as string)} {...props}>
      <div className={styles.pageContainerContent}>
        {children}
      </div>
    </div>
  );
};
