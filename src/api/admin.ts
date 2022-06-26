import { BaseApi } from "./base";
import { Observable } from "cellx-decorators";

export class AdminApi extends BaseApi {
  constructor() {
    super();
  }

  public adminFetch(url: string, options?: RequestInit): Promise<any> {
    options.headers = {
      Token: localStorage.getItem("token"),
      ...options.headers,
    };
    return this.fetch(url, options);
  }

  @Observable
  public isAdmin = !!localStorage.getItem("admin");
}

export const adminApi = new AdminApi();
