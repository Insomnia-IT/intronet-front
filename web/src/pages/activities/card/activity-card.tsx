import {getDayText} from "../../../helpers/getDayText";
import { FunctionalComponent } from "preact";
import { TargetedEvent } from "preact/compat";
import { useEffect, useMemo, useState } from "preact/hooks";
import cx from "classnames";
import { Card } from "../../../components/cards";
import { Badge } from "../../../components/badge/badge";
import { highlight } from "../../../components/highlight";
import { useCell } from "../../../helpers/cell-state";
import { Gesture } from "../../../helpers/Gestures";
import { locationsStore } from "../../../stores";
import { ActivityStore } from "../../../stores/activities/activities.store";
import { SvgIcon } from "../../../icons";
import { useActivitiesRouter } from "../hooks/useActivitiesRouter";
import Styles from "./activity-card.module.css";

export type ActivityCardProps = {
  id: string;
  gesture?: Gesture;
  searchQuery?: string;
} & ActivityCardStylesProps;

export type ActivityCardStylesProps = {
  className?: string;
  onClick?: (id: string, e: TargetedEvent) => void;
  forceOnClick?: ActivityCardStylesProps["onClick"];
  iconOpacity?: number;
  iconClassNames?: string[];
  onIconClick?: (e: TargetedEvent) => void;
  withBookmarkIcon?: boolean;
  disabled?: boolean;
  showDate?: boolean;
};


export const ActivityCard: FunctionalComponent<ActivityCardProps> = ({
                                                                       id,
                                                                       searchQuery,
                                                                       className,
                                                                       iconOpacity,
                                                                       iconClassNames,
                                                                       onIconClick,
                                                                       showDate,
                                                                       disabled = false,
                                                                       withBookmarkIcon = true
                                                                     }) => {
  const store = useMemo(() => new ActivityStore(id), [ id ]);
  const {activity} = useCell(store.state);
  const router = useActivitiesRouter();
  const day = getDayText(activity.day, "short");
  return (
    <Card
      className={ cx(Styles.card, className, {
        [Styles.cardDisabled]: disabled,
      }) }
      background={ activity.isCanceled ? "White" : "Purple" }
      border={ activity.isCanceled ? "InactiveGrey" : "None" }
      onClick={ (e) => e.defaultPrevented || router.goToActivity(id) }
    >
      <div className={ Styles.activityContainer } flex column gap>
        <div flex class={ Styles.headerContainer }>
          <div flex column style={ {gap: "8px", alignItems: "flex-start"} }>
            { activity.isCanceled ? (
              <Badge type={ "Change" }>{ "Отменилось =(" }</Badge>
            ) : activity.hasChanges ? (
              <Badge type={ "Change" }>Время изменилось</Badge>
            ) : null }
            <div
              className={ [
                activity.isCanceled ? Styles.headerCanceled : Styles.header,
                "sh1",
              ].join(" ") }
            >
              { highlight(activity?.title, searchQuery) }
            </div>
          </div>

          { withBookmarkIcon && (<SvgIcon
            id="#bookmark"
            className={ cx(Styles.bookmarkIcon, iconClassNames) }
            onClick={ !disabled && onIconClick }
            size={ 17 }
            style={ {
              flexShrink: 0,
              opacity: iconOpacity,
            } }
          />) }
        </div>

        <div className={ `textSmall colorGray ${ Styles.activityDescription }` }>
          { highlight(activity?.author, searchQuery) }
        </div>

        <div className={ `${ Styles.activityTimePlace } sh3` }>
          <span
            className={
              activity.isCanceled
                ? Styles.activityPlaceCanceled
                : Styles.activityPlace
            }
          >
            { locationsStore.getName(activity?.locationId) }
          </span>

          <span
            className={
              activity.isCanceled
                ? Styles.activityTimeCanceled
                : Styles.activityTime
            }
          >
            {showDate && day + ", "}
            {activity.start.includes('undefined') && activity.end.includes('undefined') ? `` :
              activity.start.includes('undefined') ? `до ${activity.end}` :
              activity.end.includes('undefined') ? `с ${activity.start}` :
                `${activity.start} - ${activity.end}` }
          </span>
        </div>
      </div>
    </Card>
  );
};

const gestureLength = Math.min(window.innerWidth / 4, 300);

function useGestures(
  ref,
  hasBookmark,
  switchBookmark: (activity: Activity) => void,
  activity: Activity,
  gesture: Gesture
) {
  const shift =
    gesture?.path.includes(ref.current) && gesture.shift < 0
      ? Math.max(gesture.shift, -gestureLength)
      : 0;
  const transform = `translateX(${ shift }px)`;
  const iconOpacity = hasBookmark
    ? 1 - Math.abs(shift) / gestureLength
    : Math.abs(shift) / gestureLength;
  const [ gestureEnd, setGestureEnd ] = useState(false);

  useEffect(() => {
    if (Math.abs(shift) < gestureLength * 0.9) {
      setGestureEnd(false);
    } else {
      setGestureEnd(true);
    }
    if (!gestureEnd || gesture) return;
    setGestureEnd(false);
    switchBookmark(activity);
  }, [ gesture, shift, hasBookmark, switchBookmark, gestureEnd ]);

  const classNames = [ shift == 0 ? "transitionOut" : "" ];

  return {
    transform,
    iconOpacity,
    classNames,
    state: gestureEnd
      ? hasBookmark
        ? "Deleting"
        : "Adding"
      : !!shift
        ? "Gesture"
        : "",
  };
}
