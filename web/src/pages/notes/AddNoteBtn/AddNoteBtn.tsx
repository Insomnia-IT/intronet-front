import { FunctionalComponent } from "preact";
import styles from "./add-note.module.css";
import { Button } from "@components";

export const AddNoteBtn: FunctionalComponent = () => {
  return (
    <Button className={styles.btn} goTo={`/notes/new`}>
      + НАПИСАТЬ ОБЪЯВЛЕНИЕ
    </Button>
  );
};
