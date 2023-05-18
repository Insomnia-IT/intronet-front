import { Fn, cell } from "@cmmn/cell/lib";
import { notesStore } from "@stores";
import { ObservableDB } from "../observableDB";

class CategoriesStore {
  @cell
  private db = new ObservableDB<ICategory>("noteCategories");

  @cell
  get allCategories() {
    return this.db.toArray();
  }

  getCategory(id: ICategory["_id"]) {
    return this.allCategories.find((category) => category._id === id);
  }

  getCategoryColor(id: ICategory["_id"]): null | string {
    return this.getCategory(id)?.color || "brand.300";
  }

  async addCategory(newCategory: ICategoryLocal) {
    await this.db.addOrUpdate(this.createCategoryEntity(newCategory));
  }

  async updateCategory(updatedCategory: ICategory) {
    await this.db.addOrUpdate(updatedCategory);
  }

  private createCategoryEntity(localCategory: ICategoryLocal): ICategory {
    return {
      ...localCategory,
      _id: Fn.ulid(),
    };
  }
}

export const categoriesStore = (globalThis["categoriesStore"] =
  new CategoriesStore());
