import { Cell, cell } from "@cmmn/cell/lib";
import { categoriesStore } from "./categories.store";
import { notesStore } from "./notes.store";
import { bookmarksStore } from "@stores/bookmarks.store";
import { authStore } from "@stores/auth.store";

export enum ConstantFilterIds {
  All = "all",
  Favorites = "favorites",
  My = "my",
  NoApproved = "noApproved",
  NoActual = "noActual",
}

class FiltersStore {
  @cell
  get filters(): IFilterEntity[] {
    return [
      {
        type: "all",
        id: ConstantFilterIds.All,
        name: "Все",
      },
      {
        type: "favorites",
        id: ConstantFilterIds.Favorites,
        name: "Избранные",
        icon: "bookmark",
      },
      {
        type: "my",
        id: ConstantFilterIds.My,
      },
      {
        type: "noApproved",
        id: ConstantFilterIds.NoApproved,
      },
      {
        type: "noActual",
        id: ConstantFilterIds.NoActual,
      },
      ...categoriesStore.categories.map(({ _id, name }): IFilterEntity => {
        return {
          type: "category",
          id: _id,
          name: name,
        };
      }),
    ];
  }

  get filterAll() {
    return this.filters[0];
  }
}

export const filtersStore = new FiltersStore();

export class FilteredNotesStore {
  private activeFilters: IFilterEntity[] = [];
  private activeFiltersMap: {
    [key in IFilterType]: null | IFilterEntity;
  } = {
    all: null,
    category: null,
    favorites: null,
    my: null,
    noApproved: null,
    noActual: null,
  };

  constructor(filterId: string | string[]) {
    if (!Array.isArray(filterId)) {
      filterId = [filterId];
    }

    this.activeFilters = filtersStore.filters.filter((filter) => {
      const isExist = filterId.includes(filter.id);

      if (isExist) {
        this.activeFiltersMap[filter.type] = filter;
      }

      return isExist;
    });
  }

  get filteredNotes() {
    if (!this.activeFilters.length) {
      return notesStore.notes;
    }

    return notesStore.notes.filter((note) => {
      const { activeFiltersMap } = this;

      if (activeFiltersMap.category) {
        if (activeFiltersMap.category.id !== note.categoryId) {
          return false;
        }
      }
      if (activeFiltersMap.favorites) {
        if (!Boolean(bookmarksStore.getBookmark("note", note._id))) {
          return false;
        }
      }
      if (activeFiltersMap.my) {
        if (
          !(typeof note.author === "object" && note.author.id === authStore.uid)
        ) {
          return false;
        }
      }
      if (activeFiltersMap.noActual) {
        if (notesStore.checkIsNoteActual(note)) {
          return false;
        }
      }
      if (
        activeFiltersMap.noApproved &&
        notesStore.isUserModerator &&
        note.isApproved
      ) {
        return false;
      }

      // Default filters
      if (!notesStore.checkIsNoteActual(note) && !activeFiltersMap.noActual) {
        return false;
      }
      if (!note.isApproved && !activeFiltersMap.noApproved) {
        return false;
      }

      return true;
    });
  }

  public state = new Cell(() => ({
    filteredNotes: this.filteredNotes,
  }));
}

export const myNotesStore = new FilteredNotesStore("my");

export const noApprovedNotesStore = new FilteredNotesStore(
  ConstantFilterIds.NoApproved
);

type IFilterType =
  | "all"
  | "favorites"
  | "category"
  | "my"
  | "noApproved"
  | "noActual";

type IFilterEntity = {
  type: IFilterType;
  name?: string;
  id: ConstantFilterIds | string;
  icon?: string;
};
