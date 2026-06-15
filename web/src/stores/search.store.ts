import { cell, Cell } from "@cmmn/cell";
import { moviesStore } from "@stores/movies.store";
import { bind } from "@cmmn/core";
import { ChangeEvent } from "preact/compat";
import { locationsStore } from "@stores/locations.store";
import { activitiesStore } from "@stores/activities";
import { notesStore } from "./notes";
import { searchDataValidator } from "../helpers/search-normalize";

export { searchDataValidator } from "../helpers/search-normalize";

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

  /** Группы локаций по `groupLink`, у которых сам ключ совпал с запросом (приоритет в UI поиска). */
  public matchedLocationGroups = new Cell(() => {
    if (!this.queryRegex) return [] as { groupLink: string; count: number }[];
    const counts = new Map<string, number>();
    for (const loc of locationsStore.Locations) {
      const gl = loc.groupLink?.trim();
      if (!gl) continue;
      counts.set(gl, (counts.get(gl) ?? 0) + 1);
    }
    const out: { groupLink: string; count: number }[] = [];
    for (const [groupLink, count] of counts) {
      if (this.queryRegex.test(searchDataValidator(groupLink))) {
        out.push({ groupLink, count });
      }
    }
    return out.sort((a, b) => b.count - a.count);
  });

  public filteredLocations = new Cell(() => {
    if (!this.queryRegex) return [];
    const promoted = new Set(
      this.matchedLocationGroups.get().map((g) => g.groupLink)
    );
    return locationsStore.Locations.filter((loc) => {
      const gl = loc.groupLink?.trim();
      if (gl && promoted.has(gl)) return false;
      return locationChecker(this.queryRegex)(loc);
    });
  });

  public filteredActivities = new Cell(() => {
    if (!this.queryRegex) return [];
    return activitiesStore.Activities.filter(activityChecker(this.queryRegex));
  });

  public filteredNotes = new Cell(() => {
    if (!this.queryRegex) return [];
    return notesStore.notes.filter(noteChecker(this.queryRegex));
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
  !!location?.work_tags?.some((x) => regex.test(searchDataValidator(x)));

const activityChecker: Checker<Activity> = (regex) => (activity) =>
  regex.test(searchDataValidator(activity.title)) ||
  regex.test(searchDataValidator(activity.authors.map(x => x.name).join(' ')));

const noteChecker: Checker<INote> = (regex) => (note) =>
  regex.test(searchDataValidator(note.title)) ||
  regex.test(searchDataValidator(note.text));

export type Checker<T> = (regex: RegExp) => (item: T) => boolean;
