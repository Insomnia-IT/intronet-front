import { FunctionalComponent } from "preact";
import { CloseButton } from "../../buttons";
import cx from 'classnames';
import styles from "./page-header.module.css";

type IPageHeaderProps = {
  pageTitleText: string;
  className?: string;
};

export const PageHeader: FunctionalComponent<IPageHeaderProps> = ({
  pageTitleText,
  className
}) => {
  return (
    <div className={cx(className, styles.pageHeader)}>
      <h1 className={styles.pageHeaderTitle}>{pageTitleText.toUpperCase()}</h1>
      <CloseButton position="static" />
    </div>
  );
};
