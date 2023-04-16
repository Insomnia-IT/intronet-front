import { FunctionalComponent } from "preact";
import { Card } from "@components/cards";
import Styles from "./animation.module.css";
import { AgeStrict } from "@components/age-strict";
import { useMemo, useState } from "preact/hooks";
import { MovieBlockStore } from "@stores";
import { useCell } from "@helpers/cell-state";
import { Button } from "@components";
import { MovieSmall, MovieSmallProps } from "./movie-small";
import { useHistoryState } from "../../routing";

export type AnimationBlockProps = {
  id: string;
  day: number;
  locationId: string;
};
export const AnimationBlock: FunctionalComponent<AnimationBlockProps> = (
  props
) => {
  const store = useMemo(
    () => new MovieBlockStore(props.id, props.day, props.locationId),
    [props.id, props.day, props.locationId]
  );
  const { block, duplicate, view } = useCell(store.state);
  const [isOpen, setIsOpen] = useHistoryState<boolean>(
    `${props.id}.${props.day}.${props.locationId}`,
    false
  );
  return (
    <div>
      <div className={[Styles.time, "sh1"].join(" ")}>
        {view.start} - {view.end}
      </div>
      <Card background="Purple">
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
      </Card>
    </div>
  );
};

export const MovieList: FunctionalComponent<
  { movies: MovieInfo[] } & Partial<Omit<MovieSmallProps, "movie">>
> = ({ movies, ...props }) => (
  <div flex column gap="6">
    {movies.map((m) => (
      <MovieSmall movie={m} key={m.id} {...props} />
    ))}
  </div>
);
