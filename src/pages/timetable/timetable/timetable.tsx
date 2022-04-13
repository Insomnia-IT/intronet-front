import React from "react";
import {DateTime} from "luxon";
import { Slot } from "./slot";

export class Timetable extends React.Component<TimetableProps>{


  render(){
    return <>
      <span>Timetable</span>
      {this.props.list.map(slot => (<Slot key={slot.id} slot={slot}/>))}
    </>;
  }

}

export type TimetableProps = {
  list: TimetableSlot[];
}

export type TimetableSlot = {
  id: string | number;
  Title: string;
  Start: DateTime;
  End: DateTime;
}
