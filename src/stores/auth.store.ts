import { cell, Fn } from "@cmmn/cell/lib";

class AuthStore {
  constructor() {
    if (!this.uid) {
      this.patchCookies({
        uid: Fn.ulid(),
      });
    }
  }

  @cell
  private cookie: Record<string, string> = this.readCookie();

  @cell
  public get token(): string {
    return this.cookie.token;
  }
  @cell
  public get userName(): string {
    return this.cookie.username;
  }
  @cell
  public get uid(): string {
    return this.cookie.uid;
  }
  @cell
  public get isAdmin(): boolean {
    return !!this.token && !!this.userName;
  }

  private readCookie() {
    return Object.fromEntries(
      document.cookie
        .split(";")
        .map((x) => x.trim())
        .map((x) => x.split("=").map((x) => x.toLowerCase()))
    );
  }

  private patchCookies(patch: Record<string, string>) {
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

  public auth(user: string, token: string) {
    this.patchCookies({
      username: user,
      token: token,
    });
  }

  syncCookies() {
    this.cookie = this.readCookie();
  }
}
export const authStore = new AuthStore();
