import { useCell } from "@helpers/cell-state";
import { votingStore } from "@stores/votingStore";
import { useRouter } from "../routing";
import { ButtonsBar } from "@components";
import { FunctionalComponent } from "preact";
import { MovieSmall } from "../timetable/animation/movie-small";
import { moviesStore } from "@stores";
import { OnlineButton } from '@components/buttons/online-button'

export const Vote: FunctionalComponent<{
  id: string;
}> = (props) => {
  const movie = useCell(
    () => moviesStore.Movies.find((x) => x.id == props.id),
    [props.id]
  );
  const { votedMovies } = useCell(votingStore.state);
  const router = useRouter();
  const isVoted = votedMovies.some((m) => m.id == props.id);

  return (
    <div flex column gap={3} style={{ marginTop: 29 }}>
      <div class="sh1">Голосуем за этот фильм?</div>
      {movie && <MovieSmall disabled movie={movie} />}
      <div class="text colorMediumBlue">
        Вы можете голосовать за несколько мультфильмов.
      </div>
      <div class="text colorMediumBlue">
        Не спешите с выбором — голосование в номинации Приз зрительских симпатий
        будет доступно до конца фестиваля.
      </div>
      <ButtonsBar at="bottom">
        <OnlineButton
          type="blue"
          class="w-full"
          onClick={() => {
            votingStore.vote(props.id);
            router.goTo("/voting/list");
          }}
        >
          {isVoted ? "Убрать голос" : "Голосовать за эту работу"}
        </OnlineButton>
      </ButtonsBar>
    </div>
  );
};
