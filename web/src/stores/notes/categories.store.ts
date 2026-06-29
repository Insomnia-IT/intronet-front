import { COLORS } from "../../constants";

class CategoriesStore {
  // @cell
  // private db = new ObservableDB<ICategory>("noteCategories");

  // @cell
  // get allCategories() {
  //   return this.db.toArray();
  // }

  get categories(): ICategory[] {
    return [
      {
        _id: "lost",
        name: "Потеряшки",
        color: 'var(--a-error-base)',
      },
      {
        _id: "searchFriends",
        name: "Ищу друзей",
        color: 'var(--a-main-base)',
      },
      {
        _id: "blablacar",
        name: "Попутчики",
        color: 'var(--a-add-base)',
      },
    ];
  }

  getCategory(id: ICategory["_id"]): ICategory | null {
    return this.categories.find((category) => category._id === id) || null;
  }

  getCategoryColor(id: ICategory["_id"]): null | string {
    return this.getCategory(id)?.color || COLORS.grey;
  }

  // async addCategory(newCategory: ICategoryLocal) {
  //   await this.db.addOrUpdate(this.createCategoryEntity(newCategory));
  // }

  // async updateCategory(updatedCategory: ICategory) {
  //   await this.db.addOrUpdate(updatedCategory);
  // }

  // private createCategoryEntity(localCategory: ICategoryLocal): ICategory {
  //   return {
  //     ...localCategory,
  //     _id: Fn.ulid(),
  //   };
  // }
}

export const categoriesStore = (globalThis["categoriesStore"] =
  new CategoriesStore());
