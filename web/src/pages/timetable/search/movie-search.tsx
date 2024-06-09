import { Input } from "@components/input";
import { useCell } from "@helpers/cell-state";
import { MovieList } from "../animation/movie-list";
import { SearchPlug } from "@components/plugs/search/SearchPlug";
import { searchStore } from "@stores/search.store";
import { useEffect } from "preact/hooks";
import { PageHeader } from "@components/PageHeader/PageHeader";

export const MovieSearch = () => {
  const query = useCell(searchStore.query);
  const movies = useCell(searchStore.filteredMovies);
  useEffect(() => () => searchStore.query.set(''), []);
  return (
    <div flex column gap={5} class="h-full">
      <PageHeader titleH1={'поиск'} withCloseButton/>

      <Input
        placeholder="Название мультфильма"
        autofocus
        value={query}
        onInput={searchStore.onInput}
      />
      {movies.length > 0 ? (
        <MovieList movies={movies} searchQuery={query} />
      ) : (
        <SearchPlug
          title={"Ничего не найдено"}
          text={"Попробуйте найти мультфильм по названию или по автору"}
        ></SearchPlug>
      )}
    </div>
  );
};
