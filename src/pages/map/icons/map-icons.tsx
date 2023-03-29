import React from "preact/compat";
import {Directions, directionsStore} from "@stores";
import { SvgIcon } from "@icons";


export const MapIcon: React.FC<{id: string}> = ({id}) => {
  const x = directionsStore.DirectionToDirection(id) ?? Directions[id];
  const name = Directions[x];
  return <SvgIcon g id={'.map #'+name}/>;
}
