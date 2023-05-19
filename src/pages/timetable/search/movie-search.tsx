import { Input } from "@components/input";
import { useMemo, useState } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import { moviesStore } from "@stores";
import { MovieSmall } from "../animation/movie-small";
import { MovieList } from "../animation/movie-list";

export const MovieSearch = () => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const movies = useCell(() => moviesStore.Movies);
  const check = useMemo(() => checkMovie(query), [query]);
  const filtered = useMemo(() => movies.filter(check), [movies, check]);
  return (
    <>
      <h1>поиск</h1>
      <Input
        style={{ margin: "20px 0" }}
        placeholder="Название мультфильма"
        value={query}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      {filtered.length > 0 ? (
        <MovieList movies={filtered} />
      ) : (
        <div flex column gap={4}>
          <div class="sh1 colorMediumBlue">Ничего не нашли</div>
          <div class="text colorMediumBlue">
            Попробуйте искать по другому запросу
          </div>
        </div>
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
