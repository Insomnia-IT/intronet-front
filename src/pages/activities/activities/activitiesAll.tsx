import { FunctionalComponent } from "preact";
import { useEffect } from "preact/hooks";
import { Tag, Tags } from "@components/tag";
import { getCurrentDay, getCurrentHour, getDayText } from "@helpers/getDayText";
import { locationsStore } from "@stores";
import { useRouter } from "../../routing";
import { ActivityList } from "./activityList";
import { activitiesStore } from "@stores/activities.store";
import { useCell } from "@helpers/cell-state";

export type ActivityFilter = 'time' | 'place'
export interface IActivityFilter {
  key: ActivityFilter;
  value: string;
}

export const ActivitiesAll: FunctionalComponent = () => {
  const router = useRouter<{
    filter: ActivityFilter;
    day: string;
    place: string;
    time: string;
  }>();

  const filters: IActivityFilter[] = [ {key: 'time', value: 'По времени'}, {key: 'place', value: 'По площадке'} ];
  const currentFilter = router.query.filter ? router.query.filter : filters[0].key;
  const setFilter = (filter: string) => router.goTo(
    router.route,
    {
      filter,
      day: day.toString()
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

  const locationsIDs = Array.from(new Set(activitiesStore.Activities
    .filter((activity) => activity.day === day)
    .map((activity) => activity.locationId)));

  let currentPlace = router.query.place && locationsIDs.some((locationId) => locationId === router.query.place)
    ? router.query.place
    : locationsIDs[0];
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
  }, [ currentFilter, filters?.[0] ]);

  const activities = useCell(() => activitiesStore.Activities.filter((activity) => activity.day === day));

  return (
    <>
      <h1>неанимация</h1>
      <div flex column gap={ 2 } style={ {margin: "25px 0 20px 0"} }>
        <Tags value={ day }>
          { filters.map(({key, value}) => (
            <Tag selected={ key == currentFilter } style={ {flexGrow: "1", textAlign: "center"} } key={ key }
                 onClick={ () => setFilter(key) }>
              { value }
            </Tag>
          )) }
        </Tags>
        <Tags value={ day }>
          { [ 0, 1, 2, 3, 4 ].map((d) => (
            <Tag selected={ d == day } key={ d } onClick={ () => setDay(d) }>
              { getDayText(d, "short").toUpperCase() }
            </Tag>
          )) }
        </Tags>
        { currentFilter === 'time'
          ? <Tags>
            { times.map((time) => (
              <Tag
                selected={ time.key == currentTime }
                key={ time.key }
                onClick={ () => {setTime(time.key);} }>
                { time.value }
              </Tag>
            )) }
          </Tags>
          : <Tags style={ 'flex-wrap: wrap;' }>
            { locationsIDs.map((locationId) => (
              <Tag
                style={ 'padding: 8px 16px;' }
                selected={ currentPlace === locationId }
                key={ locationId }
                onClick={ () => {
                  setPlace(locationId);
                } }
              >
                { locationsStore.getName(locationId) }
              </Tag>
            )) }
          </Tags> }
      </div>
      <ActivityList activities={activities} filter={ currentFilter } day={ day } time={ +currentTime } locationId={ currentPlace }/>
    </>
  );
};
