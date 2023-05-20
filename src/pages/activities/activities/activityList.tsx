import { FunctionalComponent } from "preact";
import { scheduleStore } from "@stores";
import { useCell } from "@helpers/cell-state";
import { ActivityBlock } from "../card/activity-block";
import { coerceHour, isInTimePeriod } from "@helpers/getDayText";
import { activitiesStore } from "@stores/activities.store";

export type ActivityListProps = {
  filter: string;
  day: number;
  locationId?: string;
  time?: number;
};

export const ActivityList: FunctionalComponent<ActivityListProps> = (props) => {
  const cards = useCell(() => {
    const events = scheduleStore.auditories.filter((auditory) => auditory.day === props.day);
    const activities = activitiesStore.Activities.filter((activity) => activity.day === props.day);

    console.log(activities)
    return props.filter === 'time'
      ? activities.filter((activity) => {
        const date = new Date(activity.start);

        return coerceHour(props.time) ? isInTimePeriod((new Date(activity.start)).getHours(), props.time) : true;
      })
      : activities.filter((event) => event.locationId === props.locationId)
  }, [ props.filter, props.day, props.time, props.locationId ]).map((activity) => ({
    ...activity,
    start: new Date(activity.start)
  })).sort((prev, next) => prev.start.getTime() - next.start.getTime());

  return (
    <>
      { cards.map((x) => (
        <ActivityBlock
          id={ x._id }
          key={ x._id }
          day={ props.day }
          locationId={ props.locationId }
        />
      )) }
    </>
  );
};
