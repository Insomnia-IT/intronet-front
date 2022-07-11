import { BaseApi } from "./base";
import { Observable } from "cellx-decorators";

export class AdminApi extends BaseApi {
  public adminFetch(url: string, options?: RequestInit): Promise<any> {
    return this.fetch(url, options);
  }

  @Observable
  public isAdmin = !!localStorage.getItem("admin");
}

export const adminApi = new AdminApi();
