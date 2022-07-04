import { DateTime } from "luxon";
import React, { FC } from "react";
import { Slot } from "./slot";

export type TimetableProps = {
  list?: TimetableSlot[];
};

export const Timetable: FC<TimetableProps> = ({ list }) => {
  return (
    <>
      <span>Timetable</span>
      {list?.map((slot) => (
        <Slot key={slot.id} slot={slot} />
      ))}
    </>
  );
};

export type TimetableSlot = {
  id: string | number;
  Title: string;
  Start: DateTime;
  End: DateTime;
};
