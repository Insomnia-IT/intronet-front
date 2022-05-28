import { Computed, Observable } from "cellx-decorators";
import { ObservableList } from 'cellx-collections';
import NotesApi from "src/api/notes";
import { notesStore, pagesStore } from 'src/stores';
import { ObservableDB } from '../observableDB';

export const ALL_CATEGORY_ID = 1

class CategoriesStore {
  private api = new NotesApi

  @Observable
  IsLoading: boolean = true

  @Observable
  ActiveCategory: number = ALL_CATEGORY_ID

  @Observable
  AllCategory = new ObservableDB<ICategory>('categories')

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

  getCategory(id: ICategory['id']) {
    return this.allCategory.find((category) => category.id === id)
  }

  getCategoryColor(id: ICategory['id']): null | string {
    return this.isAll ? this.getCategory(ALL_CATEGORY_ID).color : this.getCategory(id).color
  }

  get allNotesCount() {
    return this.allCategory.find((category) => category.id === ALL_CATEGORY_ID).count
  }

  get isAll() {
    return this.ActiveCategory === ALL_CATEGORY_ID
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

  loadNewNotes(page, count): Promise<void> {
    return notesStore.loadNewNotes(this.ActiveCategory, page, count)
  }

  @Computed
  get notes(): INotes[] {
    if (this.ActiveCategory == ALL_CATEGORY_ID) return notesStore.notes
    return notesStore.notes.filter(note => note.categoryId === this.ActiveCategory)
  }

  load = async () => {
    this.IsLoading = true
    try {
      const categories = await this.api.getAllCategories()
      this.AllCategory.clear()
      this.AllCategory.addRange(categories)
      this.IsLoading = false
    } catch {
      this.IsLoading = false
    }
    // Установка количества страниц
    pagesStore.setCountPages(this.allNotesCount)
  }
}

export const categoriesStore = new CategoriesStore()
