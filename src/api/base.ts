export type GenericRequest<P, Q, B> = {
  path?: P;
  query?: Q;
  body?: B;
  options?: RequestInit;
};

const noBodyResponse = (code: number) => ({
  code,
});

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
      .then(async (resp) => {
        console.debug("resp", resp);
        if (resp.ok) {
          try {
            return await resp.json();
          } catch {
            // Code 201, 204, etc. - no content (body)
            return noBodyResponse(resp.status);
          }
        } else {
          resp.json().then((err) => {
            // eslint-disable-next-line no-throw-literal
            throw {
              ...err,
              url,
              options,
              headers: resp.headers,
            };
          });
        }
      })
      .then((x) => x.model ?? x);
  }
}
