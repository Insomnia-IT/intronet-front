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
  private activeFilter: IFilterEntity;

  constructor(private filterId: string) {
    this.activeFilter = filtersStore.filters.find((filter) => {
      return filter.id === this.filterId;
    });
  }

  get filteredNotes() {
    if (!this.activeFilter || !Object.keys(this.activeFilter).length) {
      return notesStore.notes;
    }

    switch (this.activeFilter.type) {
      case "all": {
        return notesStore.notes;
      }

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
