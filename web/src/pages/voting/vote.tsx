import { useCell } from "@helpers/cell-state";
import { votingStore } from "@stores/votingStore";
import { useEffect, useState } from "preact/hooks";
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
  const { canVote, votedMovie } = useCell(votingStore.state);
  const router = useRouter();
  useEffect(() => {
    if (votedMovie) router.goTo("/voting", {}, true);
  }, [votedMovie]);
  return (
    <div flex column gap={3} style={{ marginTop: 29 }}>
      <div class="sh1">Голосуем за этот фильм?</div>
      {movie && <MovieSmall disabled movie={movie} />}
      <div class="sh2 colorMediumBlue">Проголосовать можно только 1 раз.</div>
      <div class="text colorMediumBlue">
        Не спешите с выбором — голосование в номинации Приз зрительских симпатий
        будет доступно до конца фестиваля.
      </div>
      <div class="text colorMediumBlue">
        Если вы передумали, вернитесь назад и выберите другую работу.
      </div>
      <ButtonsBar at="bottom">
        <OnlineButton
          type="blue"
          class="w-full"
          disabled={!canVote}
          onClick={() => {
            votingStore.vote(props.id);
            router.goTo(["voting", "success"]);
          }}
        >
          Голосовать за эту работу
        </OnlineButton>
      </ButtonsBar>
    </div>
  );
};
