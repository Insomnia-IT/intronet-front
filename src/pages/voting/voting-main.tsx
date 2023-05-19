import { FunctionalComponent } from "preact";
import { useCell } from "@helpers/cell-state";
import { moviesStore } from "@stores";
import { useHistoryState } from "../routing";

import { MovieList } from "../timetable/animation/movie-list";
export const VotingMain: FunctionalComponent = () => {
  const blocks = useCell(() => moviesStore.MovieBlocks);
  return (
    <>
      <div>
        Выберите блок анимации или воспользуйтесь поиском по названию
        мультфильма. Мультфильмы, которые вы сохранили находятся в Избранном.
      </div>
      <div flex column gap={2}>
        {blocks.map((b) => (
          <VotingBlock block={b} key={b._id} />
        ))}
      </div>
    </>
  );
};

export const VotingBlock: FunctionalComponent<{ block: MovieBlock }> = (
  props
) => {
  const [isOpen, setIsOpen] = useHistoryState(
    `block.${props.block._id}`,
    false
  );
  return (
    <div>
      <div onClick={() => setIsOpen((s) => !s)}>
        <div>{props.block.info.Title}</div>
        <div>{props.block.info.SubTitle}</div>
        {props.block.info.Part > 0 && <div>Часть {props.block.info.Part}</div>}
      </div>
      {isOpen && <MovieList movies={props.block.movies} />}
    </div>
  );
};
