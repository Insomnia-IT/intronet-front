import { FunctionalComponent } from "preact";
import { useTimetableRouter } from "../timetable-page";
import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import Styles from "./animation.module.css";
import { SvgIcon } from "@icons";
import { Gesture } from "./gesture";
import { useEffect, useRef } from "preact/hooks";

export const MovieSmall: FunctionalComponent<{ movie: MovieInfo }> = ({
  movie,
}) => {
  const gesture = useCell(Gesture);
  const router = useTimetableRouter();
  const [minutes, seconds] = movie.duration?.split(/[:'"]/) ?? [];
  const hasBookmark = useCell(
    () => !!bookmarksStore.getBookmark("movie", movie.id),
    [movie.id]
  );
  const ref = useRef();
  const shift =
    gesture?.path.includes(ref.current) && gesture.shift > 0 === hasBookmark
      ? Math.sign(gesture.shift) * Math.min(Math.abs(gesture.shift), 100)
      : 0;
  const transform = `translateX(${shift}px)`;
  const iconTransform = `translateX(${hasBookmark ? -shift : 100}px)`;
  const iconOpacity = hasBookmark
    ? 1 - Math.abs(shift) / 100
    : Math.abs(shift) / 100;
  useEffect(() => {
    if (Math.abs(shift) < 100) return;
    bookmarksStore.switchBookmark("movie", movie.id);
  }, [shift, hasBookmark]);
  return (
    <div
      ref={ref}
      flex
      column
      gap
      class={shift == 0 ? "transition" : ""}
      onClick={() => router.gotToMovie(movie.id)}
      style={{ transform, background: "transparent" }}
    >
      <div flex center>
        <div flex-grow class={Styles.movieTitle}>
          «{movie.name}»
        </div>
        <SvgIcon
          id="#bookmark"
          class={[shift == 0 ? "transition" : "", "colorPink"].join(" ")}
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
