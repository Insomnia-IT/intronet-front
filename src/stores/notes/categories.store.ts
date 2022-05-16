import { Computed, Observable } from "cellx-decorators";
import { ObservableList } from 'cellx-collections';
import NotesApi from "src/api/notes";
import { pagesStore, notesStore } from 'src/stores';
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

  loadNewNotes(from, to): Promise<void> {
    return notesStore.loadNewNotes(this.ActiveCategory, from, to)
  }

  @Computed
  get notes(): INotes[] {
    if (this.ActiveCategory == ALL_CATEGORY_ID) return notesStore.notes.toArray()
    return notesStore.notes.filter(note => note.id === this.ActiveCategory)
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
