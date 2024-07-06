import { useCell } from "@helpers/cell-state";
import { FunctionalComponent } from "preact";
import { MovieList } from "../timetable/animation/movie-list";
import { moviesStore } from "@stores";

export const VotingList: FunctionalComponent = () => {
  const movies = useCell(() => moviesStore.VotingMovies);
  return (
    <div flex column gap={3} style={{ marginTop: 29 }}>
      <div class="sh1">
        Мультфильмы, которые участвуют в международном конкурсе анимации
      </div>
      <MovieList movies={movies} />
    </div>
  );
};
