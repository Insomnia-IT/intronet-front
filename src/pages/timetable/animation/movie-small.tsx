import { FunctionalComponent } from "preact";
import { useTimetableRouter } from "../timetable-page";
import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import Styles from "./animation.module.css";
import { SvgIcon } from "@icons";
import { Gesture } from "./gesture";
import { useEffect, useRef, useState } from "preact/hooks";
import { useLocalStorageState } from "@helpers/useLocalStorageState";

export type MovieSmallProps = {
  movie: MovieInfo;
  removeTimeout?: number;
};
export const MovieSmall: FunctionalComponent<MovieSmallProps> = ({
  movie,
  removeTimeout,
}) => {
  const router = useTimetableRouter();
  const [minutes, seconds] = movie.duration?.split(/[:'"]/) ?? [];
  const hasBookmark = useCell(
    () => !!bookmarksStore.getBookmark("movie", movie.id),
    [movie.id]
  );
  const ref = useRef();
  const { transform, iconOpacity, classNames, transition, state } = useGestures(
    ref,
    hasBookmark,
    removeTimeout,
    movie
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
          Styles.movieSmall,
          userUsedGesture || state ? "" : Styles.bookmarkDemo,
        ])
        .join(" ")}
      onClick={(e) => e.defaultPrevented || router.gotToMovie(movie.id)}
      style={{ transform, transition }}
    >
      <div flex center>
        <div flex-grow class={Styles.movieTitle}>
          «{movie.name}»
        </div>
        <SvgIcon
          id="#bookmark"
          class={[...classNames, "colorPink"].join(" ")}
          onClick={(e) => {
            if (!hasBookmark) return;
            e.preventDefault();
            bookmarksStore.switchBookmark("movie", movie.id);
          }}
          size={17}
          style={{
            flexShrink: 0,
            opacity: iconOpacity,
          }}
        />
      </div>
      <div class={[Styles.movieInfo, "textSmall"].join(" ")}>
        {movie.author}, {movie.country}, {movie.year}
      </div>
      <div class={[Styles.movieInfo, "textSmall"].join(" ")}>
        {minutes} мин {seconds} сек
      </div>

      <div
        class={Styles["bookmarkAdd" + state]}
        style={{
          "--width": gestureLength + "px",
        }}
      >
        <SvgIcon
          id="#bookmark"
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

const gestureLength = window.innerWidth / 4;

function useGestures(ref, hasBookmark, removeTimeout, movie: MovieInfo) {
  const gesture = useCell(Gesture);

  const [timeoutId, setTimeoutId] = useState<undefined | number>(undefined);
  const realHasBookmark = hasBookmark && !timeoutId;
  const shift =
    gesture?.path.includes(ref.current) && gesture.shift < 0
      ? Math.max(gesture.shift, -gestureLength)
      : 0;
  const transform = `translateX(${shift}px)`;
  const iconOpacity = realHasBookmark
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
    bookmarksStore.switchBookmark("movie", movie.id);

    // if (hasBookmark) {
    //   if (timeoutId) {
    //     clearInterval(timeoutId);
    //     setTimeoutId(undefined);
    //   } else if (removeTimeout) {
    //     const timeoutId = setTimeout(() => {
    //       bookmarksStore.removeBookmark("movie", movie.id);
    //     }, removeTimeout);
    //     setTimeoutId(timeoutId as any);
    //   } else {
    //     bookmarksStore.removeBookmark("movie", movie.id);
    //   }
    // } else {
    //   bookmarksStore.addBookmark("movie", movie.id);
    // }
  }, [gesture, shift, realHasBookmark, timeoutId, removeTimeout, gestureEnd]);
  const classNames = [
    shift == 0 ? "transitionOut" : "",
    timeoutId ? "removing" : "",
  ];
  const transition = timeoutId ? `opacity ${removeTimeout}ms ease` : undefined;
  return {
    transform,
    iconOpacity,
    classNames,
    transition,
    state: gestureEnd
      ? hasBookmark
        ? "Deleting"
        : "Adding"
      : !!shift
      ? "Gesture"
      : "",
  };
}
