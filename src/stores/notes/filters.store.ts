import { cell } from "@cmmn/cell";
import { categoriesStore } from "./categories.store";
import { notesStore } from "./notes.store";

/**
 * Через геттер filteredNotes возвращает отфильтрованные объявления.
 * Виды фильтра: категория, избранные.
 */
class FiltersStore {
  get filters(): IFilterEntity[] {
    return [
      {
        type: "all",
      },
      {
        type: "favorites",
      },
      ...categoriesStore.allCategories.map(({ _id }): IFilterEntity => {
        return {
          type: "category",
          id: _id,
        };
      }),
    ];
  }

  @cell
  private ActiveFilter: IFilterEntity = this.filters[0];

  set activeFilter(filterEntity: IFilterEntity) {
    this.ActiveFilter = filterEntity;
  }

  get activeFilter() {
    return this.ActiveFilter;
  }

  @cell
  get filteredNotes() {
    const activeFilter = this.ActiveFilter;

    switch (activeFilter.type) {
      case "all": {
        return notesStore.notes;
      }

      case "category": {
        const { id: categoryId } = activeFilter;

        if (!categoryId) {
          return notesStore.notes;
        }

        notesStore.notes.filter((note) => {
          return note.categoryId === categoryId;
        });
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
}

export const filtersStore = new FiltersStore();

type IFilterType = "all" | "favorites" | "category";

type IFilterEntity = {
  type: IFilterType;
  id?: string;
};
