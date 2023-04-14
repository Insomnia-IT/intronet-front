import { FunctionalComponent } from "preact";
import { useTimetableRouter } from "../timetable-page";
import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import Styles from "./animation.module.css";
import { SvgIcon } from "@icons";
import { Gesture } from "./gesture";
import { useEffect, useRef, useState } from "preact/hooks";
import { votingStore } from "@stores/votingStore";

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
  const { transform, iconTransform, iconOpacity, classNames, transition } =
    useGestures(ref, hasBookmark, removeTimeout, movie);
  return (
    <div
      ref={ref}
      flex
      column
      gap
      class={classNames.join(" ")}
      onClick={() => router.gotToMovie(movie.id)}
      style={{
        transform,
        background: "transparent",
        transition,
      }}
    >
      <div flex center>
        <div flex-grow class={Styles.movieTitle}>
          «{movie.name}»
        </div>
        <SvgIcon
          id="#bookmark"
          class={[...classNames, "colorPink"].join(" ")}
          size={17}
          style={{
            flexShrink: 0,
            opacity: iconOpacity,
            transform: iconTransform,
          }}
        />
      </div>
      <div class={Styles.movieInfo}>
        {movie.author}, {movie.country}, {movie.year}
      </div>
      <div class={[Styles.movieInfo, "textSmall"].join(" ")}>
        {minutes} мин {seconds} сек
      </div>
    </div>
  );
};

function useGestures(ref, hasBookmark, removeTimeout, movie: MovieInfo) {
  const gesture = useCell(Gesture);

  const [timeoutId, setTimeoutId] = useState<undefined | number>(undefined);
  const realHasBookmark = hasBookmark && !timeoutId;
  const shift =
    gesture?.path.includes(ref.current) && gesture.shift > 0 === realHasBookmark
      ? Math.sign(gesture.shift) * Math.min(Math.abs(gesture.shift), 100)
      : 0;
  const transform = `translateX(${shift}px)`;
  const iconTransform = `translateX(${realHasBookmark ? -shift : 100}px)`;
  const iconOpacity = realHasBookmark
    ? 1 - Math.abs(shift) / 100
    : Math.abs(shift) / 100;

  useEffect(() => {
    if (Math.abs(shift) < 100) return;
    if (hasBookmark) {
      if (timeoutId) {
        clearInterval(timeoutId);
        setTimeoutId(undefined);
      } else if (removeTimeout) {
        const timeoutId = setTimeout(() => {
          bookmarksStore.removeBookmark("movie", movie.id);
        }, removeTimeout);
        setTimeoutId(timeoutId as any);
      } else {
        bookmarksStore.removeBookmark("movie", movie.id);
      }
    } else {
      bookmarksStore.addBookmark("movie", movie.id);
    }
  }, [shift, realHasBookmark, timeoutId, removeTimeout]);
  const classNames = [
    shift == 0 ? "transition" : "",
    timeoutId ? "removing" : "",
  ];
  const transition = timeoutId ? `opacity ${removeTimeout}ms ease` : undefined;
  return {
    transform,
    iconTransform,
    iconOpacity,
    classNames,
    transition,
  };
}
