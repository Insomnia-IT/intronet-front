export class BaseApi {

  private baseUrl = "";

  public fetch<T>(url: string, options?: RequestInit): Promise<T> {
    return fetch(this.baseUrl + url, options)
      .then(resp => resp.json())
      .then(x => x.model)
      .catch(e => e.json());
  }

}
