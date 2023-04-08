import { FunctionalComponent } from "preact";
import { LocationMenuProps } from "./types";
import styles from "./styles.module.css";

export const LocationMenu: FunctionalComponent<LocationMenuProps> = ({ description }) => {
  if (!description) return null
  return (
  <>
    <header className={styles.header}>Меню</header>
    {description}
  </>
)};
