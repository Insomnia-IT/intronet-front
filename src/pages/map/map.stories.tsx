import React from "react";

import { DateTime } from "luxon";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MapComponent, MapItem, MapProps } from "./map";

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
