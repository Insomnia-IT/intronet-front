import { DateTime } from "luxon";
import React, { FC, useState } from "react";
import { ScheduleComponent } from "../../../components/schedule/schedule";
import styles from "../../../components/schedule/schedule.module.css";
import { locationsStore } from "../../../stores/locations.store";

export type TimetableProps = {
  list?: TimetableSlot[];
};

export const Timetable: FC<TimetableProps> = ({ list }) => {
  const [screen, setScreen] = useState(1);
  return (
    <>
      <div className={styles.tags}>
        {locationsStore.ScreenLocations.map((location) => {
          return (
            <div
              className={
                screen === location.id ? styles.auditoryActive : styles.auditory
              }
              key={location.id}
              onClick={() => {
                setScreen(location.id);
              }}
            >
              {location.name ?? screenNames[location.id]}
            </div>
          );
        })}
      </div>
      <ScheduleComponent locationId={screen} />
    </>
  );
};

const screenNames = {
  1: "Полевой экран",
  2: "Речной экран",
};

export type TimetableSlot = {
  id: string | number;
  Title: string;
  Start: DateTime;
  End: DateTime;
};
