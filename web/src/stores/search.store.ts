import { cell, Cell } from "@cmmn/cell";
import { moviesStore } from "@stores/movies.store";
import { bind } from "@cmmn/core";
import { ChangeEvent } from "preact/compat";
import { locationsStore } from "@stores/locations.store";
import { activitiesStore } from "@stores/activities";

class SearchStore {
  public query = new Cell<string>("");

  @cell
  private get queryRegex() {
    const validatedQuery = searchDataValidator(this.query.get());
    if (!validatedQuery) return null;
    return new RegExp(
      validatedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
  }

  public filteredMovies = new Cell(() => {
    if (!this.queryRegex) return [];
    return moviesStore.Movies.filter(movieChecker(this.queryRegex));
  });

  public filteredLocations = new Cell(() => {
    if (!this.queryRegex) return [];
    return locationsStore.Locations.filter(locationChecker(this.queryRegex));
  });

  public filteredActivities = new Cell(() => {
    if (!this.queryRegex) return [];
    return activitiesStore.Activities.filter(activityChecker(this.queryRegex));
  });

  @bind
  public onInput(e: ChangeEvent<HTMLInputElement>) {
    this.query.set(e.currentTarget.value);
  }
}
export const searchStore = new SearchStore();

const movieChecker: Checker<MovieInfo> = (regex) => (movie) =>
  regex.test(searchDataValidator(movie.name)) ||
  regex.test(searchDataValidator(movie.author)) ||
  regex.test(searchDataValidator(movie.country));

const locationChecker: Checker<InsomniaLocation> = (regex) => (location) =>
  regex.test(searchDataValidator(location.name)) ||
  location?.work_tags?.some((x) => regex.test(searchDataValidator(x))) ||
  regex.test(searchDataValidator(location.directionId));

const activityChecker: Checker<Activity> = (regex) => (activity) =>
  regex.test(searchDataValidator(activity.title)) ||
  regex.test(searchDataValidator(activity.author));

export const searchDataValidator = (data: string) => {
  if (!data) {
    return data;
  }

  return data.replace(/[е|ё]/g, "е");
};

export type Checker<T> = (regex: RegExp) => (item: T) => boolean;
