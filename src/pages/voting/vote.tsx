import { useCell } from "@helpers/cell-state";
import { votingStore } from "@stores/votingStore";
import {useEffect, useState} from "preact/hooks";
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
  const router = useRouter();
  useEffect(() => {
    if (votedMovie) router.goTo("/voting", {}, true)
  }, [votedMovie]);
  return (
    <div flex column gap={3} style={{marginTop: 29}}>
      <div class="sh1">Голосуем за эту анимацию?</div>
      {movie && <MovieSmall disabled movie={movie} />}
      <div class="text colorMediumBlue">Если вы передумали, вернитесь назад и выберите другую работу</div>
      <ButtonsBar at="bottom">
        <Button
          type="vivid"
          class="w-full"
          disabled={!isOnline || !canVote}
          onClick={() => {
            votingStore.vote(props.id)
            router.goTo(['voting', 'success'])
          }}
        >
          Голосовать за эту работу
        </Button>
      </ButtonsBar>
    </div>
  );
};
