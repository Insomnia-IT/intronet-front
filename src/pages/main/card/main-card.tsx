import {FunctionalComponent} from "preact";
import {Card} from "@components/cards";
import {CardInfo} from "../card-list";
import styles from "../main-page.module.css";

export type MainCard = {
  info: CardInfo;
}
export const MainCard: FunctionalComponent<MainCard> = ({info}) => {
  return <Card background={info.color ? 'Vivid' : 'White'} flex-grow class={styles.mainCard}>
    <div>{info.title}</div>
    <div>{info.descr}</div>
  </Card>
}
