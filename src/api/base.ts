export class BaseApi {

  public fetch<T>(url: string, options?: RequestInit) {
    return fetch(url, options)
      .then(resp => resp.json())
      .then(x => x.model)
      .catch(e => e.json());
  }

}
