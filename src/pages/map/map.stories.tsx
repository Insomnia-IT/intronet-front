import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MapComponent } from "./map";
import { TileConverter } from "../../helpers/tile.converter";
import { MapPage } from "./map-page";
import { LocationFull } from "../../stores/locations.store";

const locations: LocationFull[] = [
  {
    lat: 54.682615,
    lng: 35.074867,
    x: 1270,
    y: 380,
    name: "родник",
    tags: [],
    image: "",
    id: 3,
  },
];

export default {
  title: "Map",
  component: MapComponent,
} as ComponentMeta<typeof MapComponent>;

export const Schema: ComponentStory<typeof MapComponent> = (args) => (
  <MapComponent items={args.items} image={args.image} onSelect={console.log} />
);

Schema.args = {
  items: locations.map((x) => ({
    point: { x: x.x, y: x.y },
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
    image={args.image}
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
