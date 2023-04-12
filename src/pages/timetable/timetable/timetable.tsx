import { FunctionalComponent } from "preact";
import { AnimationBlock } from "../animation/animation-block";
import { moviesStore } from "@stores";
import { useCell } from "@helpers/cell-state";

export type TimetableProps = {
  locationId: string;
  day: number;
};

export const Timetable: FunctionalComponent<TimetableProps> = (props) => {
  const blocks = useCell(() => {
    return moviesStore.MovieBlocks.filter(
      (x) => x.locationId === props.locationId && x.day == props.day
    );
  }, [props.locationId, props.day]);
  return (
    <>
      {blocks.map((x) => (
        <AnimationBlock id={x._id} key={x._id} />
      ))}
    </>
  );
};
