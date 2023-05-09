import { FunctionalComponent } from "preact";
import { moviesStore, scheduleStore } from "@stores";
import { useCell } from "@helpers/cell-state";
import { EventCard } from "../card/event-card";
import { coerceHour, isInTimePeriod } from "@helpers/getDayText";
import { AnimationBlock } from "../../timetable/animation/animation-block";

export type EventListProps = {
  filter: string;
  day: number;
  locationId?: string;
  time?: number;
};

export const EventList: FunctionalComponent<EventListProps> = (props) => {
  const cards = useCell(() => {
    const events = scheduleStore.auditories.filter((auditory) => auditory.day === props.day);

    return props.filter === 'time'
      ? events.filter((event) => {
        const time = event.time.split(':')[0];

        return Number(time) && coerceHour(props.time) ? isInTimePeriod(Number(time), props.time) : true;
      })
      : events.filter((event) => event.locationId === props.locationId)
  }, [ props.filter, props.day, props.time, props.locationId ]).sort((prev, next) => {
    const hoursPrev = prev.time.split(':')[0];
    const minutesPrev = prev.time.split(':')[1];
    const hoursNext = next.time.split(':')[0];
    const minutesNext = next.time.split(':')[1];

    if (hoursPrev && hoursNext && minutesPrev && minutesNext) {
      return (+hoursPrev * 60 + +minutesPrev) - (+hoursNext * 60 + +minutesNext);
    } else {
      return 0;
    }
  });

  return (
    <>
      { cards.map((x) => (
        <EventCard
          id={ x._id }
          key={ x._id }
          day={ props.day }
          locationId={ props.locationId }
        />
      )) }
    </>
  );
};
