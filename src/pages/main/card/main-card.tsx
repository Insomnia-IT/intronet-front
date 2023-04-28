import {FunctionalComponent} from "preact";
import {Card} from "@components/cards";
import {CardInfo} from "../card-list";

export type MainCard = {
  info: CardInfo;
}
export const MainCard: FunctionalComponent<MainCard> = ({info}) => {
  return <Card background={info.color ? 'Vivid' : 'White'} flex-grow>
    <div>{info.title}</div>
    <div>{info.descr}</div>
  </Card>
}
