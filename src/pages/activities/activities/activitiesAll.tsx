import { FunctionalComponent } from "preact";
import { locationsStore } from "@stores";
import { activitiesStore, activityFiltersStore } from "@stores/activities";
import { useCell } from "@helpers/cell-state";
import { ActivityList } from "./activityList";
import { ActivityFilters } from "../filters/ActivityFilters";
import { useActivitiesRouter } from "../hooks/useActivitiesRouter";

export const ActivitiesAll: FunctionalComponent = () => {
  const {filter, day} = useActivitiesRouter();
  const filters = useCell(() => activityFiltersStore.filters);
  const days = useCell(() => activityFiltersStore.days);
  const times = useCell(() => activityFiltersStore.times);
  const locations = Array.from(
    new Set(
      activitiesStore.Activities.filter((activity) => day ? activity.day.toString() === day?.toString() : true).map(
        (activity) => activity.locationId
      )
    )
  ).map((locationId) => ({key: locationId, value: locationsStore.getName(locationId)}));

  const currentFilter = filter ?? filters[0].key;

  const activities = useCell(() => activitiesStore.Activities);

  return (
    <>
      <h1>неанимация</h1>
      <div flex column gap={ 2 } style={ {margin: "25px 0 20px 0"} }>
        <ActivityFilters type={ 'filter' } filters={ filters } flexGrow={ "1" }/>
        <ActivityFilters type={ 'day' } filters={ days }/>
        {
          currentFilter === "time"
            ? (<ActivityFilters type={ 'time' } filters={ times }/>)
            : (<ActivityFilters type={ 'place' } filters={ locations } flexWrap smallTag/>)
        }
      </div>
      <ActivityList activities={ activities }/>
    </>
  );
};
