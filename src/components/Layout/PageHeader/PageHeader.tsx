import { FunctionalComponent } from "preact";
import { CloseButton } from "@components/buttons";
import styles from "./page-header.module.css";

export const PageHeader: FunctionalComponent<IPageHeaderProps> = ({
  pageTitleText,
}) => {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageHeaderTitle}>{pageTitleText.toUpperCase()}</h1>
      <CloseButton position="static" />
    </div>
  );
};

type IPageHeaderProps = {
  pageTitleText: string;
};
