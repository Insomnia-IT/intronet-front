import { FunctionalComponent } from "preact";
import { useCell } from "@helpers/cell-state";
import { ActivityBlock } from "../card/activity-block";
import { coerceHour, isInTimePeriod } from "@helpers/getDayText";
import { useCallback, useState } from "preact/hooks";
import { GestureCell } from "../../timetable/animation/gesture";
import { ActivityFilter } from "./activitiesAll";

export type ActivityListProps = {
  filter?: ActivityFilter;
  day?: number;
  locationId?: string;
  time?: number;
  activities?: Activity[];
  searchQuery?: string;
};

export const ActivityList: FunctionalComponent<ActivityListProps> = ({
                                                                       filter,
                                                                       day,
                                                                       locationId,
                                                                       time,
                                                                       activities,
                                                                       searchQuery
                                                                     }) => {
  const [gestureCell, setGestureCell] = useState<GestureCell | undefined>(
    undefined
  );
  const setRef = useCallback((div: HTMLDivElement | undefined) => {
    if (div) {
      const gestureCell = new GestureCell(div);
      setGestureCell(gestureCell);
      /*}*/
    } else {
      setGestureCell(undefined);
    }
  }, []);
  const gesture = useCell(gestureCell);

  const cards = useCell(() => {
    switch (filter) {
      case 'place':
        return activities.filter((activity) => !locationId || activity.locationId === locationId);
      case 'time':
        return activities.filter((activity) => {
          const date = new Date(activity.start);

          return coerceHour(time) ? isInTimePeriod((new Date(activity.start)).getHours(), time) : true;
        })
      default:
        return activities
    }
  }, [ activities, filter, day, time, locationId ]).map((activity) => ({
    ...activity,
    start: new Date(activity.start)
  })).sort((prev, next) => prev.start.getTime() - next.start.getTime());

  return (
    <div flex column ref={setRef}>
      { cards.map((x) => (
        <ActivityBlock
          id={ x._id }
          key={ x._id }
          day={ day }
          locationId={ locationId }
          gesture={gesture}
          searchQuery={searchQuery}
        />
      )) }
    </div>
  );
};
