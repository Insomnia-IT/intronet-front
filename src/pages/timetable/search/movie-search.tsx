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
    <div flex column gap={5} class="h-full">
      <h1>поиск</h1>
      <Input
        placeholder="Название мультфильма"
        autofocus
        value={query}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      {filtered.length > 0 ? (
        <MovieList movies={filtered} searchQuery={query} />
      ) : (
        <SearchPlug
          title={'Ничего не найдено'}
          text={'Попробуйте найти мультфильм по названию или по автору'}></SearchPlug>
      )}
    </div>
  );
};

const checkMovie = (query: string | undefined) => {
  if (!query) return () => true;
  try {

    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
    return (movie: MovieInfo) =>
      regex.test(movie.name) ||
      regex.test(movie.author) ||
      regex.test(movie.country);
  } catch (e){
     return () => false;
  }
};
