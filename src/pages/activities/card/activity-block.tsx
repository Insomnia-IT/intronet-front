import { FunctionalComponent } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Card } from "@components/cards";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import Styles from "./activity-card.module.css";
import { ActivityStore } from "@stores/activities/activities.store";
import { SvgIcon } from "@icons";
import { bookmarksStore } from "@stores/bookmarks.store";
import { Gesture } from "../../timetable/animation/gesture";
import { Badge } from "@components/badge/badge";
import { highlight } from "@components/highlight";
import { useLocalStorageState } from "@helpers/useLocalStorageState";
import { useActivitiesRouter } from "../hooks/useActivitiesRouter";

export type ActivityBlockProps = {
  id: string;
  gesture?: Gesture;
  searchQuery?: string;
};
export const ActivityBlock: FunctionalComponent<ActivityBlockProps> = ({
  id,
  gesture,
  searchQuery,
}) => {
  const store = useMemo(() => new ActivityStore(id), [id]);
  const { activity } = useCell(store.state);
  const router = useActivitiesRouter();
  const hasBookmark = useCell(
    () => !!bookmarksStore.getBookmark("activity", activity._id),
    [activity._id]
  );
  const switchBookmark = (activity) =>
    bookmarksStore.switchBookmark("activity", activity._id);
  const ref = useRef();
  const { transform, iconOpacity, classNames, state } = useGestures(
    ref,
    hasBookmark,
    switchBookmark,
    activity,
    gesture
  );
  const [userUsedGesture, setUserUsedGesture] = useLocalStorageState(
    "userUsedGesture",
    false
  );
  // const hasBookmarks = useCell(() => bookmarksStore.Movies.length > 0);
  useEffect(() => {
    if (userUsedGesture) return;
    if (!state) return;
    setUserUsedGesture(true);
  }, [userUsedGesture, state]);

  return (
    <Card
      ref={ref}
      class={classNames
        .concat([
          Styles.activityCard,
          userUsedGesture || state ? "" : Styles.bookmarkDemo,
        ])
        .join(" ")}
      background={activity.isCanceled ? "White" : "Purple"}
      border={activity.isCanceled ? "InactiveGrey" : "None"}
      style={{ transform, marginBottom: 8, padding: 16, paddingBottom: 18 }}
      onClick={(e) => e.defaultPrevented || router.goToActivity(id)}
    >
      <div className={Styles.activityContainer} flex column gap>
        <div flex class={Styles.headerContainer}>
          <div flex column style={{ gap: "8px", alignItems: "flex-start" }}>
            {activity.isCanceled && (
              <Badge type={"Change"}>{"Отменилось =("}</Badge>
            )}
            <div
              className={[
                activity.isCanceled ? Styles.headerCanceled : Styles.header,
                "sh1",
              ].join(" ")}
            >
              {highlight(activity?.title, searchQuery)}
            </div>
          </div>

          <SvgIcon
            id="#bookmark"
            class={[...classNames, "colorPink"].join(" ")}
            onClick={(e) => {
              if (!hasBookmark) return;
              e.preventDefault();
              bookmarksStore.switchBookmark("activity", activity._id);
            }}
            size={17}
            style={{
              flexShrink: 0,
              opacity: iconOpacity,
            }}
          />
        </div>

        <div className={`textSmall colorGray ${Styles.activityDescription}`}>
          {highlight(activity?.author, searchQuery)}
        </div>

        <div className={`${Styles.activityTimePlace} sh3`}>
          <span
            className={
              activity.isCanceled
                ? Styles.activityPlaceCanceled
                : Styles.activityPlace
            }
          >
            {locationsStore.getName(activity?.locationId)}
          </span>

          <span
            className={
              activity.isCanceled
                ? Styles.activityTimeCanceled
                : Styles.activityTime
            }
          >
            {(activity.start)} - {(activity.end)}
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
  const transform = `translateX(${shift}px)`;
  const iconOpacity = hasBookmark
    ? 1 - Math.abs(shift) / gestureLength
    : Math.abs(shift) / gestureLength;
  const [gestureEnd, setGestureEnd] = useState(false);

  useEffect(() => {
    if (Math.abs(shift) < gestureLength * 0.9) {
      setGestureEnd(false);
    } else {
      setGestureEnd(true);
    }
    if (!gestureEnd || gesture) return;
    setGestureEnd(false);
    switchBookmark(activity);
  }, [gesture, shift, hasBookmark, switchBookmark, gestureEnd]);
  const classNames = [shift == 0 ? "transitionOut" : ""];
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
