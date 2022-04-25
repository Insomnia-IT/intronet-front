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
}
