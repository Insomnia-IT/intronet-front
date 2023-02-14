import { cell } from "@cmmn/cell/lib";
import { GenericRequest } from "src/api/base";
import NotesApi from "src/api/notes";
import { notesStore, pagesStore } from "src/stores";
import { ObservableDB } from "../observableDB";

export const ALL_CATEGORY_ID = 1;

class CategoriesStore {
  private api = new NotesApi();

  @cell
  IsLoading: boolean = false;

  @cell
  ActiveCategory: number = ALL_CATEGORY_ID;

  @cell
  AllCategory = new ObservableDB<ICategory>("categories");

  get isLoading() {
    return this.IsLoading;
  }

  get activeCategory() {
    return this.ActiveCategory;
  }

  @cell
  get allCategory() {
    return this.AllCategory.toArray();
  }

  set activeCategory(categoryId: number) {
    this.ActiveCategory = categoryId;
    this.onChangeCategory();
  }

  getCategory(id: ICategory["id"]) {
    return this.allCategory.find((category) => category.id === id);
  }

  getCategoryColor(id: ICategory["id"]): null | string {
    return this.getCategory(id)?.color || "brand.300";
  }

  get allNotesCount() {
    return this.allCategory.find((category) => category.id === ALL_CATEGORY_ID)?.count ?? 0;
  }

  get isAll() {
    return this.ActiveCategory === ALL_CATEGORY_ID;
  }

  private onChangeCategory() {
    // Обнуление страницы
    pagesStore.resetPages();

    if (this.activeCategory === ALL_CATEGORY_ID) {
      pagesStore.setCountPages(this.allNotesCount);
    } else {
      const activeCategoryObj = this.allCategory.find(
        (category) => category.id === this.activeCategory
      );
      pagesStore.setCountPages(activeCategoryObj.count);
    }
  }

  loadNewNotes(page, count): Promise<void> {
    return notesStore.loadNewNotes(this.ActiveCategory, page, count);
  }

  @cell
  get notes(): INote[] {
    if (this.ActiveCategory === ALL_CATEGORY_ID) return notesStore.notes;
    return notesStore.notes.filter(
      (note) => note.categoryId === this.ActiveCategory
    );
  }

  load = async () => {
    try {
      const categories = await this.api.getAllCategories();
      this.AllCategory.clear();
      this.AllCategory.addRange(categories);
      this.IsLoading = false;
    } catch {
      this.IsLoading = false;
    }
    // Установка количества страниц
    pagesStore.setCountPages(this.allNotesCount);
  };

  async addCategory(request: GenericRequest<null, null, ICategory>) {
    try {
      this.IsLoading = true;
      await this.api.createNewCategory(request.body);
      this.load();
    } catch (error) {
      throw error;
    } finally {
      this.IsLoading = false;
    }
  }

  async editCategory(request: GenericRequest<null, null, ICategory>) {
    try {
      this.IsLoading = true;
      await this.api.editCategory(request);
      this.load();
    } catch (error) {
      throw error;
    } finally {
      this.IsLoading = false;
    }
  }
}

export const categoriesStore = window['categoriesStore'] = new CategoriesStore();
