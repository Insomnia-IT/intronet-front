import React from "react";

import {ComponentMeta, ComponentStory} from "@storybook/react";
import {LocationItem} from "./location.list";
import {Location} from "../../../api/locations";
import {LocationFull} from "../../../stores/locations.store";

export default {
  title: 'Location',
  component: LocationItem,
} as ComponentMeta<typeof LocationItem>;


export const Primary: ComponentStory<typeof LocationItem>
  = (args) => <LocationItem location={args.location}
                                onChange={console.log} onDelete={console.log}/>;

Primary.args = {
  location: {
    id: 0,
    name: 'Экран 1',
    tags: [{id: 1, name: "ололо"}, {id: 2, name: "ахахах"}],
    image: '',
    x: 151,
    y: 123
  } as LocationFull
}
