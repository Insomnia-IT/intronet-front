import { FunctionalComponent } from "preact";
import { useTimetableRouter } from "../timetable-page";
import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import Styles from "./animation.module.css";
import { SvgIcon } from "@icons";
import { Gesture } from "./gesture";
import { useEffect, useRef, useState } from "preact/hooks";
import { useLocalStorageState } from "@helpers/useLocalStorageState";
import { Button } from "@components";

export type MovieSmallProps = {
  movie: MovieInfo;
  gesture?: Gesture;
};
export const MovieSmall: FunctionalComponent<MovieSmallProps> = ({
  movie,
  gesture,
}) => {
  const switchBookmark = (movie) =>
    bookmarksStore.switchBookmark("movie", movie.id);
  const router = useTimetableRouter();
  const [minutes, seconds] = movie.duration?.split(/[:'"]/) ?? [];
  const hasBookmark = useCell(
    () => !!bookmarksStore.getBookmark("movie", movie.id),
    [movie.id]
  );
  const ref = useRef();
  const { transform, iconOpacity, classNames, state } = useGestures(
    ref,
    hasBookmark,
    switchBookmark,
    movie,
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
          Styles.movieSmall,
          userUsedGesture || state ? "" : Styles.bookmarkDemo,
        ])
        .join(" ")}
      onClick={(e) => e.defaultPrevented || router.gotToMovie(movie.id)}
      style={{ transform }}
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

const gestureLength = Math.min(window.innerWidth / 4, 300);

function useGestures(
  ref,
  hasBookmark,
  switchBookmark: (movie: MovieInfo) => void,
  movie: MovieInfo,
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
    switchBookmark(movie);
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
