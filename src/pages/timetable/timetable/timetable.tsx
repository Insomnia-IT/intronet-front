import { DateTime } from "luxon";
import React, { FC, useState } from "react";
import styles from "../../../components/schedule/schedule.module.css";
import { locationsStore } from "../../../stores/locations.store";
import { ConnectedLocationSchedule } from "../../../components/Location/LocationSchedule";
import { LocationScheduleInfo } from "../../../components/Location/LocationSchedule/LocationScheduleInfo";
import { useCellState } from "../../../helpers/cell-state";
import { Flex } from "@chakra-ui/react";

export type TimetableProps = {
  list?: TimetableSlot[];
};

export const Timetable: FC<TimetableProps> = ({ list }) => {
  const [screens] = useCellState(() => locationsStore.ScreenLocations);
  const [screen, setScreen] = useState(() => screens[0]?.id);
  console.log(screens, screen);
  return (
    <Flex overflowY="auto" flexDirection="column">
      <div className={styles.tags}>
        {screens.map((location) => {
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
      <ConnectedLocationSchedule
        locationId={screen}
        renderScheduleInfo={LocationScheduleInfo}
      />
    </Flex>
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
