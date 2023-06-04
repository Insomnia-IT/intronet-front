import { Input } from "@components/input";
import { useMemo, useState } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import { moviesStore } from "@stores";
import { MovieList } from "../animation/movie-list";
import { SearchPlug } from "@components/plugs/search/SearchPlug";

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
        <MovieList movies={filtered} searchQuery={query} />
      ) : (
        <SearchPlug
          title={'Поиск по анимации'}
          text={'Попробуйте найти мультфильм по названию или по автору'}></SearchPlug>
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
