import {coerceHour, getTimeComparable, isInTimePeriod} from "../../../helpers/getDayText";
import { FunctionalComponent } from "preact";
import {useEffect, useMemo, useState} from "preact/hooks";
import { activitiesStore, ActivityStore } from "../../../stores/activities/activities.store";
import { useCell } from "../../../helpers/cell-state";
import { useActivitiesRouter } from "../hooks/useActivitiesRouter";
import { ActivityFilters } from "../filters/ActivityFilters";
import { activityFiltersStore } from "../../../stores/activities";
import { locationsStore } from "../../../stores";
import { ActivityList } from "../activities/activityList";
import Styles from "./activityLocation.module.css";
import { orderBy } from "@cmmn/core";
import {PageHeader} from "@components/PageHeader/PageHeader";

export type ActivityLocationProps = {
  id: string;
};
export const ActivityLocation: FunctionalComponent<ActivityLocationProps> = ({id}) => {
  const router = useActivitiesRouter();
  // const store = useMemo(() => new ActivityStore(id), [id]);
  // const { activity, hasBookmark } = useCell(store.state);
  const [name, setName] = useState("");
  const {filter, day, time, place} = useActivitiesRouter();
  const filters = useCell(() => activityFiltersStore.filters);
  const days = useCell(() => activityFiltersStore.days);
  const times = useCell(() => activityFiltersStore.times);

  useEffect(() => {
    // console.log(id, locationsStore.getName(id), locationsStore);
    setName(locationsStore.getName(id))
  }, [id]);

  const activities = useCell(() => activitiesStore.Activities.filter((activity) => activity.locationId === id));

  const cards = useMemo(() => {
    const numberTime = Number(time);
    const unordered = activities
      .filter((activity) => coerceHour(numberTime) ? isInTimePeriod(+activity.start.split(':')[0], numberTime) : true)
      .filter((activity) => (day !== undefined ? filterByDay(activity, day.toString()) : true));
    return orderBy(unordered, x => getTimeComparable(x.start));
  }, [ activities, filter, day, time, place ]);

  return (
    <>
      {!!id && <>
        {!!name && <PageHeader titleH2={name} align={'top'} withCloseButton/>}

        <div flex column gap={ 2 } style={ {margin: "25px 0 20px 0"} }>
          {!!days && <ActivityFilters type={ 'day' } filters={ days }/>}
          {!!times && <ActivityFilters type={ 'time' } filters={ times }/>}
        </div>

        {!!cards && <ActivityList activities={ cards }/>}
      </>
      }
    </>
  );
};


const filterByDay = (activity: Activity, day: string) => {
  return activity.day.toString() === day;
}
