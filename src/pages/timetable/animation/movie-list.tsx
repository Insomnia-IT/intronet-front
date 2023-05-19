import { FunctionalComponent } from "preact";
import { MovieSmall, MovieSmallProps } from "./movie-small";
import { useCallback, useState } from "preact/hooks";
import { GestureCell } from "./gesture";
import { useCell } from "@helpers/cell-state";

export const MovieList: FunctionalComponent<{
  movies: MovieInfo[];
  searchQuery?: string;
}> = ({ movies, searchQuery }) => {
  const [gestureCell, setGestureCell] = useState<GestureCell | undefined>(
    undefined
  );
  const setRef = useCallback((div: HTMLDivElement | undefined) => {
    if (div) {
      const gestureCell = new GestureCell(div);
      setGestureCell(gestureCell);
      /*}*/
    } else {
      setGestureCell(undefined);
    }
  }, []);
  const gesture = useCell(gestureCell);
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
