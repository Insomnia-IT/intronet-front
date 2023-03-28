import { DateTime } from "luxon";
import React, { FC, useState } from "preact/compat";
import styles from "../../../components/schedule/schedule.module.css";
import {locationsStore, moviesStore} from "@stores";
import { useCellState } from "@helpers/cell-state";
import {AnimationBlock} from "@components/cards/animation-block";

export type TimetableProps = {
  list?: TimetableSlot[];
};

export const Timetable: FC<TimetableProps> = ({ list }) => {
  const [screens] = useCellState(() => locationsStore.FullLocations.filter(x => x.directionId == 'screen'));
  const [screen, setScreen] = useState(() => screens[0]?._id);
  const [blocks] = useCellState(() => {
    return moviesStore.Movies.filter(x => x.locationId === screen)
  }, [screen]);
  console.log('timetable', screen, screens?.[0]?._id)
  React.useEffect(() => {
    if (screen) return;
    console.log(screen, screens?.[0]?._id)
    setScreen(screens?.[0]?._id);
  }, [screen, screens?.[0]]);

  return (
    <div className="flex column">
      <div className={styles.tags}>
        {screens.map((location) => (
          <div
            className={
              screen === location._id ? styles.auditoryActive : styles.auditory
            }
            key={location._id}
            onClick={() => {
              setScreen(location._id);
            }}
          >
            {location.name ?? screenNames[location._id]}
          </div>
        ))}
      </div>
      {blocks.map(x => <AnimationBlock block={x} key={x._id}/>)}
    </div>
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
