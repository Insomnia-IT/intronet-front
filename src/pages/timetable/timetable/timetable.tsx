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
    return moviesStore.MovieBlocks.filter((x) =>
      x.views.some(
        (y) => y.locationId === props.locationId && y.day == props.day
      )
    ).orderBy(x => {
      const start = x.views.find(x => x.locationId === props.locationId).start;
      if (start.startsWith('0')) return '3' + start;
      return  start;
    });
  }, [props.locationId, props.day]);
  return (
    <>
      {blocks.map((x) => (
        <AnimationBlock
          id={x._id}
          key={x._id}
          day={props.day}
          locationId={props.locationId}
        />
      ))}
    </>
  );
};
