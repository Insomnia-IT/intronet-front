import React, { FC } from "preact/compat";
import { Card } from "./card/card";
import { cardContentList } from "./cardContentList";
import styles from "./cardList.module.css";

export const CardList: FC = () => {
  return (
    <div className={styles.container}>
      { cardContentList.map((cardObj) => (
        <Card { ...cardObj }></Card>
      )) }
    </div>
  );
};
