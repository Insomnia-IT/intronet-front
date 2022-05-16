import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MapComponent, MapItem } from "./map";
import { TileConverter } from "../../helpers/tile.converter";

export default {
  title: "Map",
  component: MapComponent,
} as ComponentMeta<typeof MapComponent>;

export const Schema: ComponentStory<typeof MapComponent> = (args) => (
  <MapComponent items={args.items} image={args.image} onSelect={console.log} />
);

Schema.args = {
  items: [
    {
      point: { x: 330, y: 260 },
      radius: 20,
      icon: "",
      id: 1,
    },
  ] as MapItem[],
  image: {
    url: "/images/schema.jpg",
    width: 1280,
    height: 905,
  },
};

export const Geo: ComponentStory<typeof MapComponent> = (args) => (
  <MapComponent
    items={args.items}
    location
    image={args.image}
    onSelect={console.log}
  />
);

const converter = new TileConverter(
  {
    x: 39148 / 2 ** 16,
    y: 20825 / 2 ** 16,
  },
  2 ** 16 * 256
);
const items = [
  {
    point: converter.fromGeo({
      lat: 54.675909,
      lng: 35.072132,
    }),
    radius: 20,
    icon: "",
    id: 1,
  },
  {
    point: converter.fromGeo({
      lat: 54.687588,
      lng: 35.102046,
    }),
    radius: 20,
    icon: "",
    id: 2,
  },
  {
    point: converter.fromGeo({
      lat: 54.682615,
      lng: 35.074867,
    }),
    radius: 10,
    icon: "",
    title: "родник",
    id: 3,
  },
] as MapItem[];
console.log(items);
Geo.args = {
  items: items,
  image: {
    url: "/images/map.png",
    width: 3328,
    height: 2048,
  },
};
