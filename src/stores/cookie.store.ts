import { cell, Fn } from "@cmmn/cell/lib";
export class CookieStore<TCookie extends Record<string, string>> {
  @cell
  protected cookie: TCookie = this.readCookie();

  protected readCookie() {
    return Object.fromEntries(
      document.cookie
        .split(";")
        .map((x) => x.trim())
        .map((x) => x.split("=").map((x) => x.toLowerCase()))
    );
  }

  protected patchCookies(patch: Partial<TCookie>) {
    this.cookie = {
      ...this.cookie,
      ...patch,
    };
    const cookie = Object.entries(this.cookie)
      .filter((arr) => arr.every((x) => !!x))
      .map((arr) => arr.join("="))
      .join(";");
    console.log("set", cookie);
    document.cookie = cookie;
  }

  public syncCookies() {
    this.cookie = this.readCookie();
  }
}
