import { FunctionalComponent } from "preact";
import { Card } from "@components/cards";
import {goTo, useRouter} from "../../routing";
import styles from "../main-page.module.css";

export type MainCard = {
  info: MainPageCard;
};
export const MainCard: FunctionalComponent<MainCard> = ({ info }) => {
  const router = useRouter();
  return (
    <Card
      background={info.color ? "Vivid" : "White"}
      flex-grow
      onClick={info.article ? () => goTo(['articles', info.article]) : () => goTo(info.link as any ?? '/main')}
      class={info.color ? styles.mainCardColor : styles.mainCard}
    >
      <header>{info.title}</header>
      <div class="textSmall colorInsNight">{info.descr}</div>
    </Card>
  );
};
