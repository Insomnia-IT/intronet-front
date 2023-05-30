import { Cell, cell } from "@cmmn/cell/lib";
import { categoriesStore } from "./categories.store";
import { notesStore } from "./notes.store";

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
    console.debug("filteredNotes", this.activeFilter);
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
          return note.isFavourites;
        });
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

type IFilterType = "all" | "favorites" | "category";

type IFilterEntity = {
  type: IFilterType;
  name: string;
  id: string;
  icon?: string;
};
