import { FunctionalComponent } from "preact";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { getCurrentDay, getCurrentHour, getDayText } from "@helpers/getDayText";
import { useRouter } from "../../routing";
import { Tag, Tags } from "@components/tag";
import { EventList } from "./eventList";
import { useEffect } from "preact/hooks";

export const EventAll: FunctionalComponent = () => {
  const router = useRouter<{
    filter: string;
    day: string;
    place: string;
    time: string;
  }>();

  const filters = [{key: 'time', value: 'По времени'}, {key: 'place', value: 'По площадке'}];
  const currentFilter = router.query.filter ? router.query.filter : filters[0].key;
  const setFilter = (filter: string) => router.goTo(
    router.route,
    {
      filter,
      day: day.toString()
    },
    true
  );

  const places = useCell(() =>
    locationsStore.FullLocations
  );
  let currentPlace = router.query.place ?? places[0]?._id;
  const setPlace = (place: string) =>
    router.goTo(
      router.route,
      {
        filter: currentFilter,
        day: day.toString(),
        place,
      },
      true
    );

  const day = router.query.day ? +router.query.day : getCurrentDay();
  const setDay = (day: number) =>
    router.goTo(
      router.route,
      {
        filter: currentFilter,
        day: day.toString(),
        time: currentTime.toString(),
        place: currentPlace
      },
      true
    );

  const times = [
    {key: 9, value: '9:00-13:00'},
    {key: 13, value: '13:00-17:00'},
    {key: 17, value: '17:00-24:00'}
  ];
  let currentTime = router.query.time ? router.query.time : getCurrentHour();
  const setTime = (time: number) => router.goTo(
    router.route,
    {
      filter: currentFilter,
      day: day.toString(),
      time: time.toString()
    },
    true
  );

  useEffect(() => {
    if (currentFilter) return;
    setFilter(filters?.[0]?.key);
  }, [currentFilter, filters?.[0]]);

  return (
    <>
      <h1>неанимация</h1>
      <div flex column gap={2} style={{ margin: "16px 0 20px 0" }}>
        <Tags value={day}>
          {filters.map(({key, value}) => (
            <Tag selected={key == currentFilter} key={key} onClick={() => setFilter(key)}>
              {value}
            </Tag>
          ))}
        </Tags>
        <Tags value={day}>
          {[0, 1, 2, 3, 4].map((d) => (
            <Tag selected={d == day} key={d} onClick={() => setDay(d)}>
              {getDayText(d, "short").toUpperCase()}
            </Tag>
          ))}
        </Tags>
        {currentFilter === 'time' ? <Tags>
          {times.map((time) => (
            <Tag
              selected={time.key == currentTime}
              key={time.key}
              onClick={() => {
                setTime(time.key);
              }}
            >
              {time.value}
            </Tag>
          ))}
        </Tags> : <Tags style={'flex-wrap: wrap;'}>
          {places.map((location) => (
            <Tag
              style={'padding: 8px 16px;'}
              selected={currentPlace === location._id}
              key={location._id}
              onClick={() => {
                setPlace(location._id);
              }}
            >
              {locationsStore.getName(location._id)}
            </Tag>
          ))}
        </Tags>}
      </div>
      <EventList filter={currentFilter} day={day} time={+currentTime} locationId={currentPlace}/>
    </>
  );
};
