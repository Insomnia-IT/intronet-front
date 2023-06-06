import { FunctionalComponent } from "preact";
import { Tag, Tags } from "@components/tag";
import { activityFiltersStore, IActivityFilter } from "@stores/activities/activity-filters.store";
import { useEffect } from "preact/hooks";
import { useActivitiesRouter } from "../hooks/useActivitiesRouter";
import { getCurrentDay, getCurrentHour } from "@helpers/getDayText";

export type ActivityTagType = 'filter' | 'day' | 'place' | 'time';

export interface ActivityFilterProp {
  filters: IActivityFilter[];
  type: ActivityTagType;
  flexGrow?: string;
  flexWrap?: boolean;
  smallTag?: boolean;
}

export const ActivityFilters: FunctionalComponent<ActivityFilterProp> = ({
                                                                           filters,
                                                                           flexGrow,
                                                                           flexWrap,
                                                                           smallTag,
                                                                           type
                                                                         }: ActivityFilterProp) => {
  const activitiesRouter = useActivitiesRouter();
  const {filter, day, time, place, goToActivities} = activitiesRouter;

  const current = activitiesRouter[type] ?? (() => {
    switch (type) {
      case "day":
        return getCurrentDay();
      case "time":
        return getCurrentHour();
      default:
        return filters[0]?.key;
    }
  })();

  useEffect(() => {
    if (!filter) {
      goToActivities({
        filter: `${ activityFiltersStore.filters[0].key }`,
        day: getCurrentDay().toString(),
        time: getCurrentHour().toString()
      });
    }
  }, [ filter ]);

  useEffect(() => {
    if (filter === 'place' && (filters.some((f) => f.key !== place) || !place)) {
      goToActivities({
        filter,
        day,
        place: filters[0].key.toString()
      });
    }
  }, [ day ]);


  return (
    <Tags style={ `flex-wrap: ${ flexWrap ? 'wrap' : 'nowrap' };` } tagsList={ filters }>
      { ({key, value}) => (
        <Tag
          selected={ key == current }
          style={ {flexGrow: flexGrow ?? "0", textAlign: "center", padding: `${ smallTag ? 8 : 15.5 }px 16px`} }
          key={ key }
          onClick={ () => goToActivities({
            filter,
            day,
            time,
            place,
            [type]: key
          })
          }
        >
          { value }
        </Tag>
      ) }
    </Tags>
  );
}
