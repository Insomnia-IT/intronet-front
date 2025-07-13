import { FunctionalComponent } from "preact";
import { BookmarkGesture } from "../../../components/BookmarkGesture/BookmarkGesture";
import { highlight } from "../../../components/highlight";
import { Gesture } from "../../../helpers/Gestures";
import { useCell } from "../../../helpers/cell-state";
import { SvgIcon } from "../../../icons";
import { bookmarksStore } from "../../../stores/bookmarks.store";
import { useTimetableRouter } from "../timetable-page";
import Styles from "./animation.module.css";
import { BookmarkIcon } from "@components/BookmarkGesture/bookmark-icon";

export type MovieSmallProps = {
  movie: MovieInfo;
  gesture?: Gesture;
  searchQuery?: string;
  disabled?: boolean;
};

export const MovieSmall: FunctionalComponent<MovieSmallProps> = ({
  movie,
  gesture,
  searchQuery,
  disabled,
}) => {
  const switchBookmark = () => bookmarksStore.switchBookmark("movie", movie.id);
  const router = useTimetableRouter();
  const [minutes, seconds] = movie.info?.filmDuration?.split(/[:'"]/) ?? [];
  const hasBookmark = useCell(
    () => !!bookmarksStore.getBookmark("movie", movie.id),
    [movie.id]
  );

  const [title, rest] = movie.name.split('реж. ');

  return (
    <BookmarkGesture
      disabled={disabled}
      className={Styles.movieSmall}
      onClick={
        disabled
          ? undefined
          : (e) => e.defaultPrevented || router.goToMovie(movie.id)
      }
      {...{
        gesture,
        hasBookmark,
        switchBookmark,
      }}
    >
      {({ iconOpacity, classNames }) => {
        return (
          <div>
            <div flex center>
              <div flex-grow class={Styles.movieTitle}>
                {highlight(title, searchQuery)}
              </div>
              {!disabled && (
                <BookmarkIcon
                  class={[...classNames, "colorVivid"].join(" ")}
                  onClick={(e) => {
                    if (!hasBookmark) return;
                    e.preventDefault();
                    switchBookmark();
                  }}
                  style={{
                    flexShrink: 0,
                    opacity: iconOpacity,
                  }}
                />
              )}
            </div>
            {rest || movie.country || movie.info?.filmReleaseYear ? (
              <div class={[Styles.movieInfo, "textSmall", "colorGrey2"].join(" ")}>
                {highlight("реж. " + rest, searchQuery)}
                {movie.country ? <>, {highlight(movie.country, searchQuery)}</> : ''}
                {movie.info?.filmReleaseYear ? ", " + movie.info?.filmReleaseYear : ""}
              </div>
            ) : null}
            <div class={[Styles.movieInfo, "textSmall", "colorGrey"].join(" ")}>
              {movie.info?.filmDuration ? (
                <>
                  {minutes}&nbsp;мин&nbsp;{seconds}&nbsp;сек
                </>
              ) : null}
            </div>
          </div>
        );
      }}
    </BookmarkGesture>
  );
};
