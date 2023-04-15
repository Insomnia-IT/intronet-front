import { cell, Fn } from "@cmmn/cell/lib";
import { LocalStore } from "@stores/localStore";

class AuthStore extends LocalStore<{
  uid: string;
  token: string;
  username: string;
}> {
  constructor() {
    super();
    if (!this.uid) {
      this.patch({
        uid: Fn.ulid(),
      });
    }
  }

  @cell
  public get token(): string {
    return this.values.token;
  }
  @cell
  public get userName(): string {
    return this.values.username;
  }
  @cell
  public get uid(): string {
    return this.values.uid;
  }
  @cell
  public get isAdmin(): boolean {
    return !!this.token && !!this.userName;
  }

  public auth(user: string, token: string) {
    this.patch({
      username: user,
      token: token,
    });
  }
}
export const authStore = new AuthStore();
