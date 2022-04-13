import React from "react";
import type {TimetableSlot} from "./timetable";

export function Slot(props: {slot: TimetableSlot}){
  return <div>
    {props.slot.Title}
  </div>
}
