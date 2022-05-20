import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MapComponent, MapItem } from "./map";
import { TileConverter } from "../../helpers/tile.converter";
import { MapPage } from "./map-page";
import { LocationFull } from "../../stores/locations.store";

const locations: LocationFull[] = [
  {
    lat: 54.68255965779291,
    lng: 35.07497888587355,
    x: 1078.8210261252755,
    y: 406.92241107963486,
    name: "родник",
    tags: [],
    image: "",
    id: 3,
  },
  // {
  //   lat: 54.68128095334499,
  //   lng: 35.08512875824405,
  //   x: 752.1208687440983,
  //   y: 323.7888888888889,
  //   name: "Палаточный лагерь",
  //   tags: [],
  //   image: "camping",
  //   id: 2,
  // },
  // {
  //   lat: 54.67735017337062,
  //   lng: 35.08774915484466,
  //   x: 352.1208687440983,
  //   y: 323.7888888888889,
  //   name: "Экран «Орёл»",
  //   tags: [],
  //   image: "cinema",
  //   id: 1,
  // },
];

export default {
  title: "Map",
  component: MapComponent,
} as ComponentMeta<typeof MapComponent>;

export const Schema: ComponentStory<typeof MapComponent> = (args) => (
  <MapComponent
    items={args.items}
    image={args.image}
    onClick={console.log}
    onSelect={console.log}
    isMovingEnabled={true}
  />
);

Schema.args = {
  items: locations.map((x) => ({
    point: { X: x.x, Y: x.y },
    radius: 20,
    icon: "",
    title: x.name,
    id: x.id,
  })) as MapItem[],
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
    isMovingEnabled={true}
    image={args.image}
    onClick={console.log}
    onSelect={console.log}
  />
);

const converter = new TileConverter(
  {
    x: 39148,
    y: 20825,
  },
  16,
  256
);
Geo.args = {
  items: locations.map((x) => ({
    point: converter.fromGeo(x),
    radius: 20,
    icon: "",
    title: x.name,
    id: x.id,
  })),
  image: {
    url: "/images/map.png",
    width: 3328,
    height: 2048,
  },
};

export const Page: ComponentStory<typeof MapPage> = (args) => (
  <MapPage locations={args.locations} />
);
Page.args = {
  locations,
};
