import {IntersectOnly} from "@helpers/intersect-only";
import { FunctionalComponent } from "preact";
import { Button } from "@components";
import { RequireAuth } from "@components/RequireAuth";
import { useCell } from "@helpers/cell-state";
import {coerceHour, getTimeComparable, isInTimePeriod} from "@helpers/getDayText";
import { useGestureCell } from "@helpers/Gestures";
import { IActivityQueries, useActivitiesRouter } from "../hooks/useActivitiesRouter";
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


  return (
    <div flex column className={ styles.container } ref={ setRef }>
      {
        activities.map((x) => (<IntersectOnly height={140}>
          <ActivityGesturedCard
            id={ x._id }
            key={ x._id }
            gesture={ gesture }
            showDate={ showDate }
            searchQuery={ searchQuery }>
          </ActivityGesturedCard>

          <RequireAuth>
            <Button class="w-full" style={ {marginBottom: 24, marginTop: 12} } goTo={ [ "activities", "edit", x._id ] }
                    type="frame">изменить
              время</Button>
          </RequireAuth>
        </IntersectOnly>
      )) }
    </div>
  );
};
