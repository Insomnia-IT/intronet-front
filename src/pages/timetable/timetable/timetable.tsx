import { DateTime } from "luxon";
import React, { FC, useState } from "react";
import { ScheduleComponent } from "../../../components/schedule/schedule";
import styles from "../../../components/schedule/schedule.module.css";

export type TimetableProps = {
  list?: TimetableSlot[];
};

export const Timetable: FC<TimetableProps> = ({ list }) => {
  const [screen, setScreen] = useState(1);
  return (
    <>
      <div className={styles.tags}>
        {[1, 2].map((screenId) => {
          return (
            <div
              className={
                screen === screenId ? styles.auditoryActive : styles.auditory
              }
              key={screenId}
              onClick={() => {
                setScreen(screenId);
              }}
            >
              {screenNames[screenId]}
            </div>
          );
        })}
      </div>
      <ScheduleComponent locationId={screen} />
    </>
  );
};

const screenNames = {
  1: "Экран 1",
  2: "Экран 2",
};

export type TimetableSlot = {
  id: string | number;
  Title: string;
  Start: DateTime;
  End: DateTime;
};
