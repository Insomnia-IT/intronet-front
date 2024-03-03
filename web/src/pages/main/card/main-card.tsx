import { FunctionalComponent } from "preact";
import { Card } from "../../../components/cards";
import { goTo, useRouter } from "../../routing";
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
      onClick={
        info.link
          ? () => goTo((info.link as any) ?? "/main")
          : () => goTo(["articles", info.article ?? info._id])
      }
      class={[
        styles.mainCard,
        info.color ? styles.colored : undefined,
        info.small ? styles.small : undefined,
      ]
        .filter((x) => x)
        .join(" ")}
    >
      <header>{info.title}</header>
      <div class="textSmall colorInsNight">{info.descr}</div>
    </Card>
  );
};
