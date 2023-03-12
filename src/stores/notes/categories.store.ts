import { cell } from "@cmmn/cell/lib";
import { GenericRequest } from "@api";
import { notesStore, pagesStore } from "@stores";
import { ObservableDB } from "../observableDB";

export const ALL_CATEGORY_ID = '1';

class CategoriesStore {

  @cell
  IsLoading: boolean = false;

  @cell
  ActiveCategory: string = ALL_CATEGORY_ID;

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

  set activeCategory(categoryId: string) {
    this.ActiveCategory = categoryId;
    this.onChangeCategory();
  }

  getCategory(id: ICategory["_id"]) {
    return this.allCategory.find((category) => category._id === id);
  }

  getCategoryColor(id: ICategory["_id"]): null | string {
    return this.getCategory(id)?.color || "brand.300";
  }

  get allNotesCount() {
    return this.allCategory.find((category) => category._id === ALL_CATEGORY_ID)?.count ?? 0;
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
        (category) => category._id === this.activeCategory
      );
      pagesStore.setCountPages(activeCategoryObj.count);
    }
  }

  // loadNewNotes(page, count): Promise<void> {
    // return notesStore.loadNewNotes(this.ActiveCategory, page, count);
  // }

  @cell
  get notes(): INote[] {
    if (this.ActiveCategory === ALL_CATEGORY_ID) return notesStore.notes;
    return notesStore.notes.filter(
      (note) => note.categoryId === this.ActiveCategory
    );
  }

  async addCategory(request: GenericRequest<null, null, ICategory>) {
    await this.AllCategory.add(request.body);
  }

  async editCategory(request: GenericRequest<null, null, ICategory>) {
    await this.AllCategory.update(request.body);
  }
}

export const categoriesStore = globalThis['categoriesStore'] = new CategoriesStore();
