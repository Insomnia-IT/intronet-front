import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { ScheduleComponent } from "./schedule";

export default {
  title: "Schedule",
  component: ScheduleComponent,
} as ComponentMeta<typeof ScheduleComponent>;

export const Schedule: ComponentStory<typeof ScheduleComponent> = (args) => (
  <ScheduleComponent locationId={1} />
);
