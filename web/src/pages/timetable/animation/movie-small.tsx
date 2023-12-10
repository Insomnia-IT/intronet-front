import { FunctionalComponent } from "preact";
import { BookmarkGesture } from "../../../components/BookmarkGesture/BookmarkGesture";
import { highlight } from "../../../components/highlight";
import { Gesture } from "../../../helpers/Gestures";
import { useCell } from "../../../helpers/cell-state";
import { SvgIcon } from "../../../icons";
import { bookmarksStore } from "../../../stores/bookmarks.store";
import { useTimetableRouter } from "../timetable-page";
import Styles from "./animation.module.css";

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
  const [minutes, seconds] = movie.duration?.split(/[:'"]/) ?? [];
  const hasBookmark = useCell(
    () => !!bookmarksStore.getBookmark("movie", movie.id),
    [movie.id]
  );

  // const hasBookmarks = useCell(() => bookmarksStore.Movies.length > 0);
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
          <>
            <div flex center>
              <div flex-grow class={Styles.movieTitle}>
                {highlight(movie.name, searchQuery)}
              </div>
              {!disabled && (
                <SvgIcon
                  id="#bookmark"
                  class={[...classNames, "colorPink"].join(" ")}
                  onClick={(e) => {
                    if (!hasBookmark) return;
                    e.preventDefault();
                    switchBookmark();
                  }}
                  size={17}
                  style={{
                    flexShrink: 0,
                    opacity: iconOpacity,
                  }}
                />
              )}
            </div>
            {movie.author || movie.country || movie.year ? (
              <div class={[Styles.movieInfo, "textSmall"].join(" ")}>
                {highlight(movie.author, searchQuery)},{" "}
                {highlight(movie.country, searchQuery)}
                {movie.year ? ", " + movie.year : ""}
              </div>
            ) : null}
            <div class={[Styles.movieInfo, "textSmall"].join(" ")}>
              {movie.duration ? (
                <>
                  {minutes}&nbsp;мин&nbsp;{seconds}&nbsp;сек
                </>
              ) : null}
            </div>
          </>
        );
      }}
    </BookmarkGesture>
  );
};
