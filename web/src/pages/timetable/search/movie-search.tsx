import { Input } from "../../../components/input";
import { useSearch } from "../../../helpers/search/use-search";
import { useMemo, useState } from "preact/hooks";
import { useCell } from "../../../helpers/cell-state";
import { moviesStore } from "../../../stores";
import { MovieList } from "../animation/movie-list";
import { SearchPlug } from "../../../components/plugs/search/SearchPlug";
import { searchDataValidator } from "../../../helpers/search/searchDataValidator";

export const MovieSearch = () => {
  const { query, check, setQuery } = useSearch(
    (regex) => (movie: MovieInfo) =>
      regex.test(searchDataValidator(movie.name)) ||
      regex.test(searchDataValidator(movie.author)) ||
      regex.test(searchDataValidator(movie.country))
  );
  const movies = useCell(() => moviesStore.Movies);
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
          title={"Ничего не найдено"}
          text={"Попробуйте найти мультфильм по названию или по автору"}
        ></SearchPlug>
      )}
    </div>
  );
};
