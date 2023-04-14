import { cell, Fn } from "@cmmn/cell/lib";
import { CookieStore } from "@stores/cookie.store";

class AuthStore extends CookieStore<{
  uid: string;
  token: string;
  username: string;
}> {
  constructor() {
    super();
    if (!this.uid) {
      this.patchCookies({
        uid: Fn.ulid(),
      });
    }
  }

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

  public auth(user: string, token: string) {
    this.patchCookies({
      username: user,
      token: token,
    });
  }
}
export const authStore = new AuthStore();
