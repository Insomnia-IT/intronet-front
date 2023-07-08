import { FunctionalComponent } from "preact";
import { locationsStore } from "@stores";
import { activitiesStore, activityFiltersStore } from "@stores/activities";
import { useCell } from "@helpers/cell-state";
import { ActivityList } from "./activityList";
import { ActivityFilters } from "../filters/ActivityFilters";
import { useActivitiesRouter } from "../hooks/useActivitiesRouter";
import { Card } from "@components/cards";
import { SvgIcon } from "@icons";
import styles from "./activitiesAll.module.css";

export const ActivitiesAll: FunctionalComponent = () => {
  const {filter, day} = useActivitiesRouter();
  const filters = useCell(() => activityFiltersStore.filters);
  const days = useCell(() => activityFiltersStore.days);
  const times = useCell(() => activityFiltersStore.times);

  const activityLocation = [ 'Шатер анимации', 'Лаборатория', 'Хатифнариум', 'Большой шатёр мастер-классов', 'Малый шатёр мастер-классов', 'Мастер-классы на ярмарке', 'Психологическая беседка', 'Психология игры', 'Фьюжн', 'Территория тела', 'Костер у  фудкорта', 'тЯтр' ];

  const currentFilter = filter ?? filters[0].key;

  const activities = useCell(() => activitiesStore.Activities);
  const locations = useCell(() => locationsStore.ActivityLocations);
  const router = useActivitiesRouter();

  return (
    <>
      <h1>неанимация</h1>
      <div flex column gap={ 2 } style={ {margin: "25px 0 20px 0"} }>
        <ActivityFilters type={ 'filter' } filters={ filters } flexGrow={ "1" }/>
        {
          currentFilter === "time" && (
            <>
              <ActivityFilters type={ 'day' } filters={ days }/>
              <ActivityFilters type={ 'time' } filters={ times }/>
            </>
          )
        }
      </div>
      { (currentFilter === 'time')
        ? <ActivityList activities={ activities }/>
        : locations.map(location => (
          <Card
            className={ styles.locationCard }
            background={ "Purple" }
            border={ "None" }
            onClick={ (e) => e.defaultPrevented || router.goToLocationActivity(location._id) }>
            <span className={ ['sh1', styles.title].join(' ') }>{ locationsStore.getName(location._id) }</span>

            <SvgIcon className={ styles.chevron } id="#chevron-right" size="24px"/>
          </Card>
        ))
      }
    </>
  );
};

