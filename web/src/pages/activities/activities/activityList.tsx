import { IntersectOnly } from "../../../helpers/intersect-only";
import { FunctionalComponent } from "preact";
import { Button } from "../../../components";
import { RequireAuth } from "../../../components/RequireAuth";
import { useGestureCell } from "../../../helpers/Gestures";
import { ActivityGesturedCard } from "../card/activity-gestured-card";
import styles from "./activitiesAll.module.css";

export type ActivityListProps = {
  activities?: Activity[];
  searchQuery?: string;
  showDate?: boolean;
};

export const ActivityList: FunctionalComponent<ActivityListProps> = ({
                                                                       activities,
                                                                       showDate,
                                                                       searchQuery
                                                                     }) => {

  const {setRef, gesture} = useGestureCell();
  const filteredActivities: Activity[] = [];
  const excludedActivities: Activity[] = [];

  activities.forEach(activity => {
    const isIncludeByName = filteredActivities.some(
      item =>
        item.title === activity.title
        && item.locationId === activity.locationId
        && item.day === activity.day
        && item.start === activity.start
    );

    if (!isIncludeByName) {
      filteredActivities.push(activity);
    } else {
      excludedActivities.push(activity);
    }
  });

  console.log(activities.length, filteredActivities.length, excludedActivities)

  return (
    <div flex column className={ styles.container } ref={ setRef }>
      {
        filteredActivities
          .map((x) => (<IntersectOnly height={ 140 }>
              <ActivityGesturedCard
                id={ x._id }
                key={ x._id }
                gesture={ gesture }
                showDate={ showDate }
                searchQuery={ searchQuery }>
              </ActivityGesturedCard>

              <RequireAuth>
                <Button class="w-full" style={ {marginBottom: 24, marginTop: 12} }
                        goTo={ [ "activities", "edit", x._id ] }
                        type="frame">изменить
                  время</Button>
              </RequireAuth>
            </IntersectOnly>
          )) }
    </div>
  );
};
