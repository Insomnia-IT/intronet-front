import { FunctionalComponent } from "preact";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { useEffect, useState } from "preact/hooks";
import { getCurrentDay, getDayText } from "@helpers/getDayText";
import styles from "../../../components/schedule/schedule.module.css";
import { Timetable } from "./timetable";
import { useTimetableRouter } from "../timetable-page";
import { useRouter } from "../../routing";

export const TimetableAll: FunctionalComponent = () => {
  const router = useRouter<{
    screen: string;
    day: string;
  }>();
  const screens = useCell(() =>
    locationsStore.FullLocations.filter((x) => x.directionId == "screen")
  );
  const screen = router.query.screen ?? screens[0]?._id;
  const setScreen = (screen: string) =>
    router.goTo(router.route, {
      day: day.toString(),
      screen: screen,
    });
  const day = router.query.day ? +router.query.day : getCurrentDay();
  const setDay = (day: number) =>
    router.goTo(router.route, {
      day: day.toString(),
      screen: screen,
    });

  useEffect(() => {
    if (screen) return;
    console.log(screen, screens?.[0]?._id);
    setScreen(screens?.[0]?._id);
  }, [screen, screens?.[0]]);

  return (
    <>
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
        {[0, 1, 2, 3, 4].map((d) => (
          <div
            className={d === day ? styles.auditoryActive : styles.auditory}
            key={d}
            onClick={() => setDay(d)}
          >
            {getDayText(d, "short")}
          </div>
        ))}
      </div>
      <Timetable day={day} locationId={screen} />
    </>
  );
};
