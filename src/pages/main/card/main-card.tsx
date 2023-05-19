import { FunctionalComponent } from "preact";
import { Card } from "@components/cards";
import { CardInfo } from "../card-list";
import styles from "../main-page.module.css";

export type MainCard = {
  info: CardInfo;
};
export const MainCard: FunctionalComponent<MainCard> = ({ info }) => {
  return (
    <Card
      background={info.color ? "Vivid" : "White"}
      flex-grow
      class={info.color ? styles.mainCardColor : styles.mainCard}
    >
      <header>{info.title}</header>
      <div class="textSmall">{info.descr}</div>
    </Card>
  );
};
