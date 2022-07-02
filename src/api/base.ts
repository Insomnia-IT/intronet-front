export type GenericRequest<P, Q, B> = {
  path?: P;
  query?: Q;
  body?: B;
  options?: RequestInit;
};

export class BaseApi {
  private baseUrl = "";

  public fetch<T>(url: string, options?: RequestInit): Promise<T> {
    return fetch(this.baseUrl + url, {
      ...options,
      headers: {
        // eslint-disable-next-line no-useless-computed-key
        ["content-type"]: "application/json",
        ...options?.headers,
      },
    })
      .then((resp) =>
        resp.ok
          ? resp.json()
          : resp.json().then((err) => {
              // eslint-disable-next-line no-throw-literal
              throw {
                ...err,
                url,
                options,
                headers: resp.headers,
              };
            })
      )
      .then((x) => x.model);
  }
}
