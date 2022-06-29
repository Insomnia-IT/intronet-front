import { AdminApi } from "./admin";
import { ALL_CATEGORY_ID } from "./../stores";
import { COUNT_NOTES_OF_PAGE } from "src/stores";
import { GenericRequest } from "./base";

const notesRout = "/api/notes";
const categoriesRout = "categories";

export default class NotesApi extends AdminApi {
  getNote(id: number): Promise<INotes> {
    return this.fetch(`${notesRout}/${id}`);
  }

  getAllNotes(): Promise<INotes[]> {
    return this.fetch(`${notesRout}/all`);
  }

  getNotes(
    page = 1,
    count = COUNT_NOTES_OF_PAGE,
    categoriesIds: number[] = []
  ): Promise<INotes[]> {
    // Если в переданном categoriesIds есть общая категория,
    // то нужно заменить массив с категориями на пустой массив,
    // что бы в запросе не было категории, и сервер вернул их все.
    let smartFilter = true;
    if (categoriesIds.includes(ALL_CATEGORY_ID)) {
      categoriesIds = [];
      smartFilter = false;
    }

    const url = `${notesRout}/filter?Page=${page}&Count=${count}&${
      categoriesIds.length > 0
        ? `CategoriesIds=` + categoriesIds.join("&CategoriesIds=")
        : `IsSmartFilter=${smartFilter}`
    }`;
    return this.fetch(url);
  }

  getNotesAll(): Promise<INotes[]> {
    return this.fetch(`${notesRout}/all`);
  }

  createNote(request: GenericRequest<null, null, INotes>): Promise<null> {
    return this.adminFetch(`api/Admin/notes/add`, {
      method: "POST",
      body: JSON.stringify({
        ...request.body,
      }),
    });
  }

  editNote(request: GenericRequest<null, null, INotes>): Promise<null> {
    return this.adminFetch(`api/Admin/notes/edit`, {
      method: "PUT",
      body: JSON.stringify({
        ...request.body,
      }),
    });
  }

  deleteNote(id: number): Promise<null> {
    return this.adminFetch(`api/Admin/notes/delete/${id}`);
  }

  getCategory = (id: number): Promise<ICategory> => {
    return this.fetch(`${notesRout}/category/${id}`);
  };

  getAllCategories = (): Promise<ICategory[]> => {
    return this.fetch(`${notesRout}/${categoriesRout}`);
  };

  createNewCategory = (name: string): Promise<null> => {
    return this.adminFetch(`${notesRout}/${categoriesRout}/add`, {
      method: "POST",
      body: JSON.stringify({
        name,
      }),
    });
  };

  editCategory = (id: number, newName: string): Promise<null> => {
    return this.adminFetch(`${notesRout}/${categoriesRout}/edit`, {
      method: "PUT",
      body: JSON.stringify({
        id,
        name: newName,
      }),
    });
  };
}
