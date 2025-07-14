import { FunctionalComponent } from "preact";
import Styles from "./location.module.css";
import { Gesture } from "../../../helpers/Gestures";
import {
  directionsToIcon,
  getLocationColor,
  getLocationIconSrc,
} from "../helpers/color.helper";
import { highlight } from "../../../components/highlight";
import { SvgIcon } from "../../../icons";
import { useLocationsRouter } from "../hooks/useLocationsRouter";
import { useEffect, useRef, useState } from "preact/hooks";
import { useCell } from "../../../helpers/cell-state";
import { bookmarksStore } from "../../../stores/bookmarks.store";
import { useLocalStorageState } from "../../../helpers/useLocalStorageState";
import { directionsToIconId } from "../mapElement";
import { BookmarkIcon } from "@components/BookmarkGesture/bookmark-icon";

export type LocationSmallProps = {
  location: InsomniaLocation;
  gesture?: Gesture;
  searchQuery?: string;
};

export const LocationSmall: FunctionalComponent<LocationSmallProps> = ({
  location,
  gesture,
  searchQuery,
}) => {
  const type = directionsToIcon.get(location.directionId);
  const router = useLocationsRouter();
  const ref = useRef();
  const hasBookmark = useCell(
    () => !!bookmarksStore.getBookmark("locations", location._id),
    [location._id]
  );
  const switchBookmark = (location) =>
    bookmarksStore.switchBookmark("locations", location._id);

  const { transform, iconOpacity, classNames, state } = useGestures(
    ref,
    hasBookmark,
    switchBookmark,
    location,
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
    <div
      ref={ref}
      class={classNames
        .concat([
          Styles.locationSmallContainer,
          userUsedGesture || state ? "" : Styles.bookmarkDemo,
        ])
        .join(" ")}
      onClick={(e) => e.defaultPrevented || router.goToLocation(location._id)}
      style={{ transform }}
    >
      <div
        className={Styles.locationSmallIcon}
        style={{ background: getLocationColor(type) }}
      >
        <SvgIcon
          id={directionsToIconId.get(location.directionId)}
          style={{
            transition: ".3s ease",
          }}
          fill="none"
          viewBox="-4 -4 24 24"
          size={24}
          overflow="visible"
        />
      </div>
      <div className={Styles.locationSmallHeader}>
        <div flex-grow>{highlight(location.name, searchQuery)}</div>

        <BookmarkIcon
          class={[...classNames, "colorVivid"].join(" ")}
          onClick={(e) => {
            if (!hasBookmark) return;
            e.preventDefault();
            bookmarksStore.switchBookmark("locations", location._id);
          }}
          size={17}
          style={{
            flexShrink: 0,
            opacity: iconOpacity,
          }}
        />
      </div>

      <div
        className={Styles["bookmarkAdd" + state]}
        style={{
          "--width": gestureLength + "px",
        }}
      >
        <BookmarkIcon
          class={
            state == "Deleting" || (!hasBookmark && state !== "Adding")
              ? "strokeOnly"
              : undefined
          }
        />
      </div>
    </div>
  );
};

const gestureLength = Math.min(window.innerWidth / 4, 300);

function useGestures(
  ref,
  hasBookmark,
  switchBookmark: (location: InsomniaLocation) => void,
  location: InsomniaLocation,
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
    switchBookmark(location);
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
