import * as React from "preact/compat";
import { parseDate } from "@helpers/parseDate";
import styles from "./createdDate.module.css";

type TCreatedDateProps = {
  date: string;
};

export const CreatedDate: React.FC<TCreatedDateProps> = ({ date }) => {
  return (
    <p className={styles.date} >
      {parseDate(date)}
    </p>
  );
};
