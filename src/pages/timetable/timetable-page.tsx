import {useEffect, useState} from "preact/hooks";
import { Timetable } from "./timetable/timetable";
import { useCellState } from "@helpers/cell-state";
import { locationsStore, moviesStore } from "@stores";
import { CloseButton } from "@components";

export function TimetablePage() {
  const [screens] = useCellState(() =>
    locationsStore.FullLocations.filter((x) => x.directionId == "screen")
  );
  const [screen, setScreen] = useState(() => screens[0]?._id);
  const [blocks] = useCellState(() => {
    return moviesStore.Movies.filter((x) => x.locationId === screen);
  }, [screen]);
  console.log("timetable", screen, screens?.[0]?._id);
  useEffect(() => {
    if (screen) return;
    console.log(screen, screens?.[0]?._id);
    setScreen(screens?.[0]?._id);
  }, [screen, screens?.[0]]);

  return (
    <>
      <Timetable
        screens={screens}
        screen={screen}
        setScreen={setScreen}
        blocks={blocks}
      />
      <CloseButton />
    </>
  );
}
