import { useGestureCell } from "@helpers/Gestures";
import {IntersectOnly} from "@helpers/intersect-only";
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
        <IntersectOnly height={80}>
          <MovieSmall
            movie={m}
            key={m.id}
            gesture={gesture}
            searchQuery={searchQuery}
          />
        </IntersectOnly>
      ))}
    </div>
  );
};
