import {Directions, directionsStore} from "@stores";
import { SvgIcon } from "@icons";
import {FunctionalComponent} from "preact";


export const MapIcon: FunctionalComponent<{id: string}> = ({id}) => {
  const x = directionsStore.DirectionToDirection(id) ?? Directions[id];
  const name = Directions[x];
  return <SvgIcon g id={'.map #'+name}/>;
}
