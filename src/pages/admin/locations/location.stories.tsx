import React from "react";

import {ComponentMeta, ComponentStory} from "@storybook/react";
import {LocationItem} from "./location.list";
import {Location} from "../../../api/locations";

export default {
  title: 'Location',
  component: LocationItem,
} as ComponentMeta<typeof LocationItem>;


export const Primary: ComponentStory<typeof LocationItem>
  = (args) => <LocationItem location={args.location}/>;

Primary.args = {
  location: {
    id: 0,
    name: 'Экран 1',
    tags: [1, 2],
    x: 151,
    y: 123
  } as Location
}
