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
        color: 'var(--bonfire-light)',
      },
      {
        _id: "searchFriends",
        name: "Ищу друзей",
        color: 'var(--electric-blues)',
      },
      {
        _id: "blablacar",
        name: "Попутчики",
        color: 'var(--cyber-disco)',
      },
    ];
  }

  getCategory(id: ICategory["_id"]): ICategory | null {
    return this.categories.find((category) => category._id === id) || null;
  }

  getCategoryColor(id: ICategory["_id"]): null | string {
    return this.getCategory(id)?.color || COLORS.inactiveGray;
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
