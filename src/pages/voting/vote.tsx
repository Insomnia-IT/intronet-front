import { useCell } from "@helpers/cell-state";
import { votingStore } from "@stores/votingStore";
import { useState } from "preact/hooks";
import { useRouter } from "../routing";
import { Input } from "@components/input";
import { Link } from "@components/link/link";
import { Button, ButtonsBar } from "@components";
import { FunctionalComponent } from "preact";
import { MovieSmall } from "../timetable/animation/movie-small";
import { moviesStore } from "@stores";

export const Vote: FunctionalComponent<{
  id: string;
}> = (props) => {
  const movie = useCell(
    () => moviesStore.Movies.find((x) => x.id == props.id),
    [props.id]
  );
  const { isOnline, canVote, votedMovie } = useCell(votingStore.state);
  return (
    <div flex column gap={2}>
      <div>Теперь можно голосовать!</div>
      <div>Вы выбрали этот мультфильм:</div>
      {movie && <MovieSmall movie={movie} />}
      <Link goTo="/voting/success">список всех мультфильмов</Link>
      <Button
        type="vivid"
        class="w-full"
        disabled={!isOnline || !canVote}
        onClick={() => votingStore.vote(props.id)}
      >
        голосовать
      </Button>
      {votedMovie && (
        <div>Вы уже проголосовали за мультфильм «{votedMovie.name}»</div>
      )}
    </div>
  );
};
