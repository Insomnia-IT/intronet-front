import { useCell } from "@helpers/cell-state";
import { FunctionalComponent } from "preact";
import { moviesStore } from "@stores";
import { votingStore } from "@stores/votingStore";
import { OnlineButton } from '@components/buttons/online-button'

export const VotingList: FunctionalComponent = () => {
  const movies = useCell(() => moviesStore.VotingMovies);
  const { votedMovies } = useCell(votingStore.state);

  return (
    <div flex column gap={3} style={{ marginTop: 29 }}>
      <div class="sh1">
        Мультфильмы
      </div>
      {movies.map((movie) => {
        const isVoted = votedMovies.some((m) => m.id == movie.id);
        return (
          <div
            key={movie.id}
            flex
            column
            gap={2}
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: '8px'
            }}
          >
            <div class="sh2">{movie.name}</div>
            {movie.country && <div class="textSmall colorGrey">{movie.country}</div>}
            {movie.info?.filmDuration && (
              <div class="textSmall colorGrey">{movie.info.filmDuration}</div>
            )}
            <OnlineButton
              type={isVoted ? "frame" : "blue"}
              onClick={() => votingStore.vote(movie.id)}
            >
              {isVoted ? "Убрать голос" : "Голосовать"}
            </OnlineButton>
          </div>
        );
      })}
    </div>
  );
};
