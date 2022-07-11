import React, { FC } from "react";
import { LocationMenuProps } from "./types";
import styles from "./styles.module.css";

export const LocationMenu: FC<LocationMenuProps> = ({ description }) => (
  <>
    <header className={styles.header}>Меню</header>
    {description}
  </>
);
