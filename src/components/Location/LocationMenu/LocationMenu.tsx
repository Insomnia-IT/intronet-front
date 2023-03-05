import React, { FC } from "preact/compat";
import { LocationMenuProps } from "./types";
import styles from "./styles.module.css";

export const LocationMenu: FC<LocationMenuProps> = ({ description }) => {
  if (!description) return null
  return (
  <>
    <header className={styles.header}>Меню</header>
    {description}
  </>
)};
