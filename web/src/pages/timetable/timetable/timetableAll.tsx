import { FunctionalComponent } from "preact";
import { useCell } from "../../../helpers/cell-state";
import { locationsStore } from "../../../stores";
import { useEffect, useState } from "preact/hooks";
import { getCurrentDay, getDayText } from "../../../helpers/getDayText";
import { Timetable } from "./timetable";
import { useRouter } from "../../routing";
import { Tag, Tags } from "../../../components/tag";
import { SvgIcon } from "@icons";

export const TimetableAll: FunctionalComponent = () => {
  const router = useRouter<{
    screen: string;
    day: string;
  }>();
  const screens = useCell(() => locationsStore.ScreenLocations);
  const screen = router.query.screen ?? screens[0]?._id;
  const setScreen = (screen: string) =>
    screen &&
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
      <div flex column style={{ marginBottom: 20 }}>
        <Tags value={day} tagsList={[0, 1, 2, 3]}>
          {(d) => (
            <Tag selected={d == day} key={d} onClick={() => setDay(d)}>
              {getDayText(d, "short").toUpperCase()}
            </Tag>
          )}
        </Tags>
        <Tags tagsList={screens.slice()}>
          {(location) => (
            <Tag
              selected={screen === location._id}
              key={location._id}
              onClick={() => {
                setScreen(location._id);
              }}
            >
              {locationsStore.getName(location._id)}
            </Tag>
          )}
        </Tags>
      </div>
      <Timetable day={day} locationId={screen} />
    </>
  );
};
