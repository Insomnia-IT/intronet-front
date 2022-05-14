import { Observable } from "cellx-decorators";
import { ObservableList } from 'cellx-collections';
import NotesApi from "src/api/notes";
import { pagesStore } from 'src/stores';

export interface ICategory {
  id: number // Id категории
  name: string //название категории
  count: number //количество элементов которым присвоена данная категория
}

export const ALL_CATEGORY = 0

class CategoriesStore {
  private api = new NotesApi

  @Observable
  IsLoading: boolean = true

  @Observable
  ActiveCategory: number = 0

  @Observable
  AllCategory: ObservableList<ICategory>

  get isLoading() {
    return this.IsLoading
  }

  get activeCategory() {
    return this.ActiveCategory
  }

  get allCategory() {
    return this.AllCategory
  }

  set activeCategory(categoryId: number) {
    this.ActiveCategory = categoryId
  }

  load = async () => {
    this.IsLoading = true
    const categories = await this.api.getAllCategories()
    this.AllCategory.addRange(categories)
    this.IsLoading = false
    // Установка количества страниц
    pagesStore.setCountPages(categories.reduce((prev, current) => prev + current.count, 0))
  }
}

export const categoriesStore = new CategoriesStore()
