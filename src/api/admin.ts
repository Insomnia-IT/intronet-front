import { BaseApi } from "./base";
import { cell } from "@cmmn/cell/lib";

export class AdminApi extends BaseApi {
  public adminFetch(url: string, options?: RequestInit): Promise<any> {
    return this.fetch(url, options);
  }

  @cell
  public isAdmin = !!localStorage.getItem("admin");
}

export const adminApi = new AdminApi();
