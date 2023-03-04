import React from "preact/compat";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MapComponent } from "./map";
import { TileConverter } from "../../helpers/tile.converter";
import { MapPage } from "./map-page";

const locations: InsomniaLocationFull[] = [
  {
    lat: 54.68255965779291,
    lon: 35.07497888587355,
    x: 1078.8210261252755,
    y: 406.92241107963486,
    description: "",
    name: "родник",
    tags: [],
    image: "",
    _id: '3',
    directionId: '0',
  },
  {
    lat: 54.68128095334499,
    lon: 35.08512875824405,
    x: 752.1208687440983,
    y: 323.7888888888889,
    description: "",
    name: "Палаточный лагерь",
    tags: [],
    image: "camping",
    _id: '2',
    directionId: '0',
  },
  {
    lat: 54.67735017337062,
    lon: 35.08774915484466,
    x: 352.1208687440983,
    y: 323.7888888888889,
    description: "",
    name: "Экран «Орёл»",
    tags: [],
    image: "cinema",
    _id: '1',

    directionId: '0',
  },
];

export default {
  title: "Map",
  component: MapComponent,
} as ComponentMeta<typeof MapComponent>;

export const Schema: ComponentStory<typeof MapComponent> = (args) => (
  <MapComponent
    items={args.items}
    image={args.image}
    selected={null}
    onClick={console.log}
    onSelect={console.log}
    onChange={console.log}
    isMovingEnabled={true}
  />
);

Schema.args = {
  items: locations.map((x) => ({
    point: { X: x.x, Y: x.y },
    icon: x.image,
    title: x.name,
    id: x._id,
  })) as unknown as MapItem[],
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
    selected={null}
    isMovingEnabled={true}
    image={args.image}
    onChange={console.log}
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
  // @ts-ignore
  items: locations.map((x) => ({
    point: converter.fromGeo(x),
    icon: x.image,
    title: x.name,
    id: x._id,
  })),
  image: {
    url: "/images/map.png",
    width: 3328,
    height: 2048,
  },
};

export const Page: ComponentStory<typeof MapPage> = (args) => <MapPage />;
Page.args = {};
