import { Cell, cell } from "@cmmn/cell/lib";
import { categoriesStore } from "./categories.store";
import { notesStore } from "./notes.store";
import { bookmarksStore } from "@stores/bookmarks.store";
import { authStore } from "@stores/auth.store";

class FiltersStore {
  @cell
  get filters(): IFilterEntity[] {
    return [
      {
        type: "all",
        id: "all",
        name: "Все",
      },
      {
        type: "favorites",
        id: "favorites",
        name: "Избранные",
        icon: "bookmark",
      },
      {
        type: "my",
        id: "my",
        name: "Мои",
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

  constructor(private filterId: string | string[]) {
    this.activeFilters = filtersStore.filters.filter((filter) => {
      if (Array.isArray(filterId)) {
        return filterId.includes(filter.id);
      } else {
        return filter.id === this.filterId;
      }
    });
  }

  get activeFilteresTypesList() {
    return this.activeFilters.map((filter) => {
      return filter.type;
    }) || []
  }

  get filteredNotes() {
    if (!this.activeFilters.length || this.activeFilters.length === 1 && this.activeFilters[0].type === 'all') {
      return notesStore.notes;
    }

    const filteresTypes = this.activeFilteresTypesList;

    return notesStore.notes.filter((note) => {
      let valid = true;

      filteresTypes.forEach((filterType) => {
        
      })

      return valid;
    })


    switch (this.activeFilter.type) {
      case "category": {
        const { id: categoryId } = this.activeFilter;

        if (!categoryId) {
          return notesStore.notes;
        }

        return notesStore.getNotesByFilterId(categoryId);
      }

      case "favorites": {
        return notesStore.notes.filter((note) => {
          return Boolean(bookmarksStore.getBookmark("note", note._id));
        });
      }

      case "my": {
        return notesStore.notes.filter((note) => {
          console.debug(note.author)
          console.debug(authStore.uid)
          return typeof note.author === 'object' && note.author.id === authStore.uid;
        })
      }

      default: {
        return notesStore.notes;
      }
    }
  }

  public state = new Cell(() => ({
    filteredNotes: this.filteredNotes,
  }));
}

export const myNotesStore = new FilteredNotesStore('my');

type IFilterType = "all" | "favorites" | "category" | "my";

type IFilterEntity = {
  type: IFilterType;
  name: string;
  id: string;
  icon?: string;
};
