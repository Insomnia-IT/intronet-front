export class BaseApi {

  private baseUrl = "";

  public fetch<T>(url: string, options?: RequestInit): Promise<T> {
    return fetch(this.baseUrl + url, options)
      .then(resp => resp.ok ? resp.json() : resp.json().then(err => {
        throw {
          ...err,
          url, options,
          headers: resp.headers
        };
      }))
      .then(x => x.model);
  }

}