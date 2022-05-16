import { Computed, Observable } from "cellx-decorators";
import { ObservableList } from 'cellx-collections';
import NotesApi from "src/api/notes";
import { notesStore, pagesStore } from 'src/stores';
import { INotes } from './notes.store';

export interface ICategory {
  id: number // Id категории
  name: string //название категории
  count: number //количество элементов которым присвоена данная категория
}

export const ALL_CATEGORY_ID = 0

class CategoriesStore {
  private api = new NotesApi

  @Observable
  IsLoading: boolean = true

  @Observable
  ActiveCategory: number = 0

  @Observable
  AllCategory = new ObservableList<ICategory>()

  get isLoading() {
    return this.IsLoading
  }

  get activeCategory() {
    return this.ActiveCategory
  }

  @Computed
  get allCategory() {
    return this.AllCategory.toArray()
  }

  set activeCategory(categoryId: number) {
    this.ActiveCategory = categoryId
    this.onChangeCategory()
  }

  get allNotesCount() {
    return this.allCategory.reduce((prev, current) => prev + current.count, 0)
  }

  private onChangeCategory() {
    // Обнуление страницы
    pagesStore.resetPages()

    if (this.activeCategory === ALL_CATEGORY_ID) {
      pagesStore.setCountPages(this.allNotesCount)
    } else {
      const activeCategoryObj = this.allCategory.find((category) => category.id === this.activeCategory)
      pagesStore.setCountPages(activeCategoryObj.count)
    }
  }

  loadNewNotes(from, to): Promise<void> {
    return notesStore.loadNewNotes(this.ActiveCategory, from, to)
  }

  @Computed
  get notes(): INotes[] {
    if (this.ActiveCategory == ALL_CATEGORY_ID) return notesStore.notes.toArray()
    return notesStore.notes.filter(note => note.categoryId === this.ActiveCategory)
  }

  load = async () => {
    console.log('loading');
    this.IsLoading = true
    const categories = await this.api.getAllCategories()
    this.AllCategory.clear()
    this.AllCategory.addRange(categories)
    this.IsLoading = false
    // Установка количества страниц
    pagesStore.setCountPages(this.allNotesCount)
  }
}

export const categoriesStore = new CategoriesStore()
