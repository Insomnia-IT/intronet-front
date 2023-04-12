import { FunctionalComponent } from "preact";
import { ActivityCard } from "@components/cards/activity";
import Styles from "./animation.module.css";
import { AgeStrict } from "@components/age-strict";
import { useMemo, useState } from "preact/hooks";
import { MovieBlockStore, moviesStore } from "@stores";
import { useCell } from "@helpers/cell-state";
import { Button } from "@components";
import { useTimetableRouter } from "../timetable-page";
import { SvgIcon } from "@icons";
import { bookmarksStore } from "@stores/bookmarks.store";

export type AnimationBlockProps = {
  id: string;
};
export const AnimationBlock: FunctionalComponent<AnimationBlockProps> = (
  props
) => {
  const store = useMemo(() => new MovieBlockStore(props.id), [props.id]);
  const { block, duplicate } = useCell(store.state);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className={[Styles.time, "sh1"].join(" ")}>
        {block.info.Start} - {block.info.End}
      </div>
      <ActivityCard background="Purple">
        <div flex column gap>
          <div class={[Styles.header, "sh1"].join(" ")}>
            {block.info.Title}
            {block.info.MinAge && <AgeStrict age={block.info.MinAge} />}
          </div>
          <div class="textSmall">{block.info.SubTitle}</div>
          <div class={Styles.duplicate}>{duplicate}</div>
          {isOpen && <MovieList movies={block.movies} />}
          <Button type="text" onClick={() => setIsOpen((x) => !x)}>
            {isOpen ? "СВЕРНУТЬ РАСПИСАНИЕ" : "ПОКАЗАТЬ РАСПИСАНИЕ"}
          </Button>
        </div>
      </ActivityCard>
    </div>
  );
};

export const MovieList: FunctionalComponent<{ movies: MovieInfo[] }> = (
  props
) => (
  <div flex column gap="6">
    {props.movies.map((m) => (
      <MovieSmall movie={m} key={m.id} />
    ))}
  </div>
);

export const MovieSmall: FunctionalComponent<{ movie: MovieInfo }> = ({
  movie,
}) => {
  const router = useTimetableRouter();
  const [minutes, seconds] = movie.duration?.split(/[:'"]/) ?? [];
  const hasBookmark = useCell(
    () => !!bookmarksStore.getBookmark("movie", movie.id),
    [movie.id]
  );
  return (
    <div flex column gap onClick={() => router.gotToMovie(movie.id)}>
      <div flex center>
        <div flex-grow class={Styles.movieTitle}>
          «{movie.name}»
        </div>
        {hasBookmark && (
          <SvgIcon
            id="#bookmark"
            class="colorPink"
            size={17}
            style={{ flexShrink: 0 }}
          />
        )}
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
