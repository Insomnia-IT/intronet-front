import { FunctionalComponent } from "preact";
import { Card } from "../../../components/cards";
import { goTo } from "../../routing";
import { BgImage } from "./bg-image";
import { MainPageCard, MainPageCardSize } from "../data";
import styles from "./main-card.module.css";

const sizeStyles: Record<MainPageCardSize, string> = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
}

export const MainCard: FunctionalComponent<MainPageCard> = (props) => {
  return (
    <Card
      background={props.color ? "Vivid" : "White"}
      flex-grow
      onClick={
        props.link
          ? () => goTo((props.link as any) ?? "/main")
          : () => goTo(["articles", props.article ?? props.id])
      }
      class={[
        styles.mainCard,
        props.color ? styles.colored : undefined,
        sizeStyles[props.size ?? "medium"],
      ]
        .filter((x) => x)
        .join(" ")}
    >
      <BgImage/>
      <header>{props.title}</header>
      {props.descr && <div>{props.descr}</div>}
    </Card>
  );
};
