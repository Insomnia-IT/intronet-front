import React from "preact/compat";

import {DateTime} from "luxon";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Timetable } from "./timetable";

export default {
  title: 'Timetable',
  component: Timetable,
} as ComponentMeta<typeof Timetable>;


export const Primary: ComponentStory<typeof Timetable>
  = (args) => <Timetable list={args.list}/>;

Primary.args = {
  list: [
    {Title: 'Start', id: 0, Start: DateTime.utc(), End: DateTime.utc().plus({hour: 1})},
    {Title: 'End', id: 1, Start: DateTime.utc().plus({hour: 2}), End: DateTime.utc().plus({hour: 3})},
  ]
}
