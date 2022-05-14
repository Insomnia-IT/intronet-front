import {BaseApi} from "./base";

export class AdminApi extends BaseApi {
  constructor() {
    super();
  }

  public adminFetch(url: string, options?: RequestInit): Promise<any> {
    options.headers = {
      'Authorization': 'Fake'
    };
    return this.fetch(url, options);
  }

  public isAdmin(){
    return !!localStorage.getItem('admin');
  }
}

export const adminApi = new AdminApi();
