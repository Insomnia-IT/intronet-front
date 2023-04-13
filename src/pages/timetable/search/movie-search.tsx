import { Input } from "@components/input";
import { useMemo, useState } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import { moviesStore } from "@stores";
import { MovieList } from "../animation/animation-block";
import { MovieSmall } from "../animation/movie-small";

export const MovieSearch = () => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const movies = useCell(() => moviesStore.Movies);
  const check = useMemo(() => checkMovie(query), [query]);
  const filtered = useMemo(() => movies.filter(check), [movies, check]);
  return (
    <>
      <h1>поиск</h1>
      <Input
        placeholder="Название мультфильма"
        value={query}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      {filtered.length > 0 ? (
        <MovieList movies={filtered} />
      ) : (
        <>
          <div>Ничего не нашли</div>
          <div>Попробуйте искать по другому запросу</div>
        </>
      )}
    </>
  );
};

const checkMovie = (query: string | undefined) => {
  if (!query) return () => true;
  const regex = new RegExp(query, "i");
  return (movie: MovieInfo) =>
    regex.test(movie.name) ||
    regex.test(movie.author) ||
    regex.test(movie.country);
};
