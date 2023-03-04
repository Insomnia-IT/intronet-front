import React from "preact/compat";
import type {TimetableSlot} from "./timetable";

export function Slot(props: {slot: TimetableSlot}){
  return <div>
    {props.slot.Title}
  </div>
}
