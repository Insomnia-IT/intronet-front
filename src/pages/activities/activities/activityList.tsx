import { FunctionalComponent } from "preact";
import { useCell } from "@helpers/cell-state";
import { ActivityBlock } from "../card/activity-block";
import { coerceHour, isInTimePeriod } from "@helpers/getDayText";
import { useCallback, useState } from "preact/hooks";
import { GestureCell } from "../../timetable/animation/gesture";
import { IActivityQueries, useActivitiesRouter } from "../hooks/useActivitiesRouter";

export type ActivityListProps = {
  filters?: Partial<IActivityQueries>;
  activities?: Activity[];
  searchQuery?: string;
};

const filterByDay = (activity: Activity, day: string) => {
  return activity.day.toString() === day;
}

export const ActivityList: FunctionalComponent<ActivityListProps> = ({
                                                                       activities,
                                                                       filters,
                                                                       searchQuery
                                                                     }) => {
  const {filter, day, time, place} = useActivitiesRouter();

  const [ gestureCell, setGestureCell ] = useState<GestureCell | undefined>(
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
    const numberTime = Number(time);

    switch (filter) {
      case 'place':
        return activities.filter((activity) => !place || activity.locationId === place);
      case 'time':
        return activities.filter((activity) => coerceHour(numberTime) ? isInTimePeriod(+activity.start.split(':')[0], numberTime) : true);
      default:
        return activities
    }
  }, [ activities, filter, day, time, place ]);

  const filteredCards = cards
    .filter((activity) => filters?.day !== undefined
      ? filterByDay(activity, filters.day.toString())
      : (day !== undefined ? filterByDay(activity, day.toString())  : true))
    .map((activity) => ({
      ...activity,
      start: new Date(activity.start)
    }))
    .sort((prev, next) => prev.start.getTime() - next.start.getTime());

  return (
    <div flex column ref={ setRef }>
      { filteredCards.map((x) => (
        <ActivityBlock
          id={ x._id }
          key={ x._id }
          gesture={ gesture }
          searchQuery={ searchQuery }
        />
      )) }
    </div>
  );
};
