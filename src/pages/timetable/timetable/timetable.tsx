import { FunctionalComponent } from "preact";
import styles from "../../../components/schedule/schedule.module.css";
import { AnimationBlock } from "@components/cards/animation-block";
import style from "../../../app/app.style.module.css";
import {locationsStore, moviesStore} from "@stores";
import {useEffect, useState} from "preact/hooks";
import {useCell} from "@helpers/cell-state";
import {getCurrentDay, getDayText} from "@helpers/getDayText";

export type TimetableProps = {
};

export const Timetable: FunctionalComponent<TimetableProps> = () => {
  const screens = useCell(() =>
    locationsStore.FullLocations.filter((x) => x.directionId == "screen")
  );
  const [screen, setScreen] = useState(() => screens[0]?._id);
  const [day, setDay] = useState(getCurrentDay());
  const blocks = useCell(() => {
    return moviesStore.Movies.filter((x) => x.locationId === screen && x.day == day);
  }, [screen, day]);
  console.log("timetable", screen, screens?.[0]?._id);
  useEffect(() => {
    if (screen) return;
    console.log(screen, screens?.[0]?._id);
    setScreen(screens?.[0]?._id);
  }, [screen, screens?.[0]]);

  return (
    <div class={style.page}>
      <h1>анимация</h1>
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
            {locationsStore.getName(location._id)}
          </div>
        ))}
      </div>
      <div class={styles.tags}>
        {[0,1,2,3,4].map((d) => (
          <div className={d === day ? styles.auditoryActive : styles.auditory}
            key={d} onClick={() => setDay(d)}>
            {getDayText(d)}
          </div>
        ))}
      </div>
      {blocks.map((x) => (
        <AnimationBlock id={x._id} key={x._id} />
      ))}
    </div>
  );
};

export type TimetableSlot = {
  id: string | number;
  Title: string;
  Start: Date;
  End: Date;
};
