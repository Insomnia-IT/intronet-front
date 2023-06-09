import { Directions, directionsStore } from "@stores";
import { SvgIcon } from "@icons";
import { FunctionalComponent } from "preact";

export const MapIcon: FunctionalComponent<{ id: string }> = ({ id }) => {
  const name = Directions[id as any];
  return <SvgIcon id={".map #" + name} size="20em" overflow="visible" />;
};
