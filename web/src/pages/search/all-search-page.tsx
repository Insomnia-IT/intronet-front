import {SearchInput} from "@components/input/search-input";
import {useCell} from "@helpers/cell-state";
import {searchStore} from "@stores/search.store";
import {MovieList} from "../timetable/animation/movie-list";
import {LocationList} from "../map/location/location-list";
import {ActivityList} from "../activities/activities/activityList";
import {useEffect} from "preact/hooks";
export const AllSearchPage = () => {
  const query = useCell(searchStore.query);
  const movies = useCell(searchStore.filteredMovies);
  const locations = useCell(searchStore.filteredLocations);
  const activities = useCell(searchStore.filteredActivities);
  useEffect(() => () => searchStore.query.set(''), []);
  return <div flex column gap={5} class="h-full">
    <h1>поиск</h1>
    <SearchInput autofocus tabIndex={0} onInput={searchStore.onInput}/>
    {movies.length > 0 && (<>
      <h2>Анимация</h2>
      <MovieList movies={movies} searchQuery={query}/>
    </>)}
    {locations.length > 0 && (<>
      <h2>Локации</h2>
      <LocationList locations={locations} searchQuery={query}/>
    </>)}
    {activities.length > 0 && (<>
      <h2>неАнимация</h2>
      <ActivityList activities={activities} searchQuery={query} showDate/>
    </>)}
  </div>
};
