import { AdminApi } from "./admin";
import { ALL_CATEGORY_ID } from "./../stores";
import { COUNT_NOTES_OF_PAGE } from "src/stores";
import { GenericRequest } from "./base";

const notesRoute = "/api/notes";
const categoriesRoute = "categories";

export default class NotesApi extends AdminApi {
  getNote(id: number): Promise<INote> {
    return this.fetch(`${notesRoute}/${id}`);
  }

  getAllNotes(): Promise<INote[]> {
    return this.fetch(`${notesRoute}/all`);
  }

  getNotes(
    page = 1,
    count = COUNT_NOTES_OF_PAGE,
    categoriesIds: number[] = []
  ): Promise<INote[]> {
    // Если в переданном categoriesIds есть общая категория,
    // то нужно заменить массив с категориями на пустой массив,
    // что бы в запросе не было категории, и сервер вернул их все.
    let smartFilter = true;
    if (categoriesIds.includes(ALL_CATEGORY_ID)) {
      categoriesIds = [];
      smartFilter = false;
    }

    const url = `${notesRoute}/filter?Page=${page}&Count=${count}&${
      categoriesIds.length > 0
        ? `CategoriesIds=` + categoriesIds.join("&CategoriesIds=")
        : `IsSmartFilter=${smartFilter}`
    }`;
    return this.fetch(url);
  }

  getNotesAll(): Promise<INote[]> {
    return this.fetch(`${notesRoute}/all`);
  }

  createNote(request: GenericRequest<null, null, INote>): Promise<null> {
    return this.adminFetch(`api/Admin/notes/add`, {
      method: "POST",
      body: JSON.stringify({
        ...request.body,
      }),
    });
  }

  editNote(request: GenericRequest<null, null, INote>): Promise<null> {
    return this.adminFetch(`api/Admin/notes/edit`, {
      method: "PUT",
      body: JSON.stringify({
        ...request.body,
      }),
    });
  }

  deleteNote(id: number): Promise<null> {
    return this.adminFetch(`api/Admin/notes/delete/${id}`, {
      method: "DELETE",
    });
  }

  getCategory = (id: number): Promise<ICategory> => {
    return this.fetch(`${notesRoute}/category/${id}`);
  };

  getAllCategories = (): Promise<ICategory[]> => {
    return this.fetch(`${notesRoute}/${categoriesRoute}`);
  };

  createNewCategory = (cat: ICategory): Promise<null> => {
    return this.adminFetch(`api/admin/notes/${categoriesRoute}/add`, {
      method: "POST",
      body: JSON.stringify(cat),
    });
  };

  editCategory = (
    request: GenericRequest<null, null, ICategory>
  ): Promise<null> => {
    return this.adminFetch(`api/admin/notes/${categoriesRoute}/edit`, {
      method: "PUT",
      body: JSON.stringify(request.body),
    });
  };
}
