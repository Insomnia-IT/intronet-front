import { Cell, cell } from "@cmmn/cell";
import { categoriesStore } from "./categories.store";
import { notesStore } from "./notes.store";
import { bookmarksStore } from "../bookmarks.store";

export enum ConstantFilterIds {
  All = "all",
  Favorites = "favorites",
  My = "my",
  NoApproved = "noApproved",
  NoActual = "noActual",
}

type IFilterType =
  | "all"
  | "favorites"
  | "category"
  | "my"
  | "noApproved"
  | "noActual";

interface IFilterEntity {
  type: IFilterType;
  name?: string;
  id: ConstantFilterIds | string;
  icon?: string;
}

const PREDEFINED_FILTERS: Omit<IFilterEntity, 'id'>[] = [
  { type: "all", name: "Все" },
  { type: "favorites", name: "Избранные", icon: "bookmark" },
  { type: "my" },
  { type: "noApproved" },
  { type: "noActual" },
];

class FiltersStore {
  @cell
  get filters(): IFilterEntity[] {
    const categoryFilters = categoriesStore.categories.map(({ _id, name }): IFilterEntity => ({
      type: "category",
      id: _id,
      name,
    }));

    const predefinedFilters = PREDEFINED_FILTERS.map((filter, index) => ({
      ...filter,
      id: ConstantFilterIds[filter.type as keyof typeof ConstantFilterIds],
    }));

    return [...predefinedFilters, ...categoryFilters];
  }

  get filterAll(): IFilterEntity {
    return this.filters[0];
  }
}

export const filtersStore = new FiltersStore();

class ActiveFiltersManager {
  private filtersMap: Map<IFilterType, IFilterEntity | null> = new Map();

  constructor(filterIds: string | string[]) {
    const ids = Array.isArray(filterIds) ? filterIds : [filterIds];

    filtersStore.filters
      .filter(filter => ids.includes(filter.id))
      .forEach(filter => this.filtersMap.set(filter.type, filter));
  }

  getFilter(type: IFilterType): IFilterEntity | null {
    return this.filtersMap.get(type) || null;
  }

  hasFilter(type: IFilterType): boolean {
    return this.filtersMap.has(type);
  }

  getActiveTypes(): IFilterType[] {
    return Array.from(this.filtersMap.keys());
  }

  isEmpty(): boolean {
    return this.filtersMap.size === 0;
  }
}

class NoteFilterService {
  constructor(
    private activeFilters: ActiveFiltersManager,
    private notes = notesStore.notes
  ) {}

  filter(): INote[] {
    if (this.activeFilters.isEmpty()) {
      return this.notes;
    }

    return this.notes
      .filter(note => this.matchesFilters(note))
      .sort((a, b) => this.sortByPinned(a, b));
  }

  private matchesFilters(note: INote): boolean {
    if (!this.matchesCategory(note)) return false;
    if (!this.matchesFavorites(note)) return false;
    if (!this.matchesMy(note)) return false;
    if (!this.matchesNoActual(note)) return false;
    if (!this.matchesNoApproved(note)) return false;
    if (!this.matchesDefaultFilters(note)) return false;

    return true;
  }

  private matchesCategory(note: INote): boolean {
    const categoryFilter = this.activeFilters.getFilter("category");
    return !categoryFilter || categoryFilter.id === note.categoryId;
  }

  private matchesFavorites(note: INote): boolean {
    const favoritesFilter = this.activeFilters.getFilter("favorites");
    return !favoritesFilter || Boolean(bookmarksStore.getBookmark("note", note._id));
  }

  private matchesMy(note: INote): boolean {
    const myFilter = this.activeFilters.getFilter("my");
    return !myFilter || notesStore.checkIsCurrentUserNoteAuthor(note);
  }

  private matchesNoActual(note: INote): boolean {
    const noActualFilter = this.activeFilters.getFilter("noActual");
    return !noActualFilter || !notesStore.checkIsNoteActual(note);
  }

  private matchesNoApproved(note: INote): boolean {
    const noApprovedFilter = this.activeFilters.getFilter("noApproved");
    if (!noApprovedFilter) return true;

    return !note.isApproved && notesStore.checkHasCurrentUserAccessToNote(note);
  }

  private matchesDefaultFilters(note: INote): boolean {
    if (!this.activeFilters.hasFilter("noActual") && !notesStore.checkIsNoteActual(note)) {
      return false;
    }

    if (!this.activeFilters.hasFilter("noApproved") && !note.isApproved) {
      return false;
    }

    return true;
  }

  private sortByPinned(a: INote, b: INote): number {
    if (a.isPinned === b.isPinned) return 0;
    return a.isPinned ? -1 : 1;
  }
}

export class FilteredNotesStore {
  private activeFilters: ActiveFiltersManager;

  constructor(filterId: string | string[]) {
    this.activeFilters = new ActiveFiltersManager(filterId);
  }

  get filteredNotes(): INote[] {
    const filterService = new NoteFilterService(this.activeFilters);
    return filterService.filter();
  }

  public state = new Cell(() => ({
    filteredNotes: this.filteredNotes,
  }));
}

export const myNotesStore = new FilteredNotesStore(ConstantFilterIds.My);
export const noApprovedNotesStore = new FilteredNotesStore(ConstantFilterIds.NoApproved);
