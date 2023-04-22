import { FunctionalComponent } from "preact";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { useEffect, useState } from "preact/hooks";
import { getCurrentDay, getDayText } from "@helpers/getDayText";
import { Timetable } from "./timetable";
import { useRouter } from "../../routing";
import { Tag, Tags } from "@components/tag";

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
    router.goTo(
      router.route,
      {
        day: day.toString(),
        screen: screen,
      },
      true
    );
  const day = router.query.day ? +router.query.day : getCurrentDay();
  const setDay = (day: number) =>
    router.goTo(
      router.route,
      {
        day: day.toString(),
        screen: screen,
      },
      true
    );

  useEffect(() => {
    if (screen) return;
    console.log(screen, screens?.[0]?._id);
    setScreen(screens?.[0]?._id);
  }, [screen, screens?.[0]]);

  return (
    <>
      <h1>анимация</h1>
      <div flex column gap={2} style={{ margin: "16px 0 20px 0" }}>
        <Tags value={day}>
          {[0, 1, 2, 3, 4].map((d) => (
            <Tag selected={d == day} key={d} onClick={() => setDay(d)}>
              {getDayText(d, "short").toUpperCase()}
            </Tag>
          ))}
        </Tags>
        <Tags>
          {screens.map((location) => (
            <Tag
              selected={screen === location._id}
              key={location._id}
              onClick={() => {
                setScreen(location._id);
              }}
            >
              {locationsStore.getName(location._id)}
            </Tag>
          ))}
        </Tags>
      </div>
      <Timetable day={day} locationId={screen} />
    </>
  );
};
