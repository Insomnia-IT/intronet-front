import {coerceHour, getTimeComparable, isInTimePeriod} from "@helpers/getDayText";
import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import { activitiesStore, ActivityStore } from "@stores/activities/activities.store";
import { useCell } from "@helpers/cell-state";
import { useActivitiesRouter } from "../hooks/useActivitiesRouter";
import { ActivityFilters } from "../filters/ActivityFilters";
import { activityFiltersStore } from "@stores/activities";
import { locationsStore } from "@stores";
import { ActivityList } from "../activities/activityList";
import Styles from "./activityLocation.module.css";

export type ActivityLocationProps = {
  id: string;
};
export const ActivityLocation: FunctionalComponent<ActivityLocationProps> = ({id}) => {
  const router = useActivitiesRouter();
  // const store = useMemo(() => new ActivityStore(id), [id]);
  // const { activity, hasBookmark } = useCell(store.state);

  const {filter, day, time, place} = useActivitiesRouter();
  const filters = useCell(() => activityFiltersStore.filters);
  const days = useCell(() => activityFiltersStore.days);
  const times = useCell(() => activityFiltersStore.times);

  const activities = useCell(() => activitiesStore.Activities.filter((activity) => activity.locationId === id));
  const cards = useMemo(() => {
    const numberTime = Number(time);
    return activities
      .filter((activity) => coerceHour(numberTime) ? isInTimePeriod(+activity.start.split(':')[0], numberTime) : true)
      .filter((activity) => (day !== undefined ? filterByDay(activity, day.toString()) : true))
      .orderBy(x => getTimeComparable(x.start))
      ;
  }, [ activities, filter, day, time, place ]);

  return (
    <>
      <span class={ [ 'sh1', Styles.header ].join(' ') }>{ locationsStore.getName(id) }</span>
      <div flex column gap={ 2 } style={ {margin: "25px 0 20px 0"} }>
        <ActivityFilters type={ 'day' } filters={ days }/>
        <ActivityFilters type={ 'time' } filters={ times }/>
      </div>

      <ActivityList activities={ cards }/>
    </>
  );
};


const filterByDay = (activity: Activity, day: string) => {
  return activity.day.toString() === day;
}
