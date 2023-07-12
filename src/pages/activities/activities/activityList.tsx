import { FunctionalComponent } from "preact";
import { Button } from "@components";
import { RequireAuth } from "@components/RequireAuth";
import { useCell } from "@helpers/cell-state";
import {coerceHour, getTimeComparable, isInTimePeriod} from "@helpers/getDayText";
import { useGestureCell } from "@helpers/Gestures";
import { IActivityQueries, useActivitiesRouter } from "../hooks/useActivitiesRouter";
import { ActivityGesturedCard } from "../card/activity-gestured-card";
import styles from "./activitiesAll.module.css";

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

  const {setRef, gesture} = useGestureCell();

  const cards = useCell(() => {
    const numberTime = Number(time);

    return activities.filter((activity) => coerceHour(numberTime) ? isInTimePeriod(+activity.start.split(':')[0], numberTime) : true);
  }, [ activities, filter, day, time, place ]);

  const filteredCards = cards
    .filter((activity) => filters?.day !== undefined
      ? filterByDay(activity, filters.day.toString())
      : (day !== undefined ? filterByDay(activity, day.toString()) : true))
    .orderBy(x => getTimeComparable(x.start))

  return (
    <div flex column className={ styles.container } ref={ setRef }>
      {
        filteredCards.map((x) => (<>
          <ActivityGesturedCard
            id={ x._id }
            key={ x._id }
            gesture={ gesture }
            searchQuery={ searchQuery }>
          </ActivityGesturedCard>

          <RequireAuth>
            <Button class="w-full" style={ {marginBottom: 24, marginTop: 12} } goTo={ [ "activities", "edit", x._id ] }
                    type="frame">изменить
              время</Button>
          </RequireAuth>
        </>)) }
    </div>
  );
};
