import { useGestureCell } from "@helpers/Gestures";
import { FunctionalComponent } from "preact";
import { MovieSmall } from "./movie-small";

export const MovieList: FunctionalComponent<{
  movies: MovieInfo[];
  searchQuery?: string;
}> = ({ movies, searchQuery }) => {
  const { gesture, setRef } = useGestureCell();

  return (
    <div flex column ref={setRef}>
      {movies.map((m) => (
        <MovieSmall
          movie={m}
          key={m.id}
          gesture={gesture}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
};
