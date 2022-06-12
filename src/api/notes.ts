import { AdminApi } from "./admin";
import { ALL_CATEGORY_ID } from "./../stores";
import { COUNT_NOTES_OF_PAGE } from "src/stores";
import { GenericRequest } from "./base";

const notesRoute = "/api/notes";
const categoriesRoute = "categories";

export default class NotesApi extends AdminApi {
  constructor() {
    super();
  }

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

  public getNotesAll(): Promise<INote[]> {
    return this.fetch(`${notesRoute}/all`);
  }

  public createNote(request: GenericRequest<null, null, INote>): Promise<null> {
    return this.adminFetch(`/api/admin/notes/add`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(request.body),
    });
  }

  public editNote(request: GenericRequest<null, null, INote>): Promise<null> {
    return this.adminFetch(`/api/admin/notes/edit`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(request.body),
    });
  }

  public deleteNote(
    request: GenericRequest<{ id: number }, null, null>
  ): Promise<null> {
    return this.adminFetch(`/api/admin/notes/delete/${request.path.id}`, {
      method: "DELETE",
    });
  }

  getCategory = (id: number): Promise<ICategory> => {
    return this.fetch(`${notesRoute}/category/${id}`);
  };

  getAllCategories = (): Promise<ICategory[]> => {
    return this.fetch(`${notesRoute}/${categoriesRoute}`);
  };

  createNewCategory = (name: string): Promise<null> => {
    return this.adminFetch(`${notesRoute}/${categoriesRoute}/add`, {
      method: "POST",
      body: JSON.stringify({
        name,
      }),
    });
  };

  editCategory = (id: number, newName: string): Promise<null> => {
    return this.adminFetch(`${notesRoute}/${categoriesRoute}/edit`, {
      method: "PUT",
      body: JSON.stringify({
        id,
        name: newName,
      }),
    });
  };
}
