import { cell, Fn } from "@cmmn/cell/lib";
import { LocalStore } from "@stores/localStore";

class AuthStore extends LocalStore<{
  uid: string;
  token: string;
  username: string;
  role: 'admin' | 'superadmin' | 'tochka';
}> {
  get headers() {
    return {
      ...(this.token ? {
        Authorization: `Bearer ${this.token}`,
      } : {}),
      uid: this.uid
    };
  }
  constructor() {
    super();
    if (!this.uid) {
      this.patch({
        uid: Fn.ulid(),
      });
    }
    const url = new URL(location.href);
    const token = url.searchParams.get("token");
    if (token) {
      this.patch({ token });
      fetch("/webapi/auth", {
        headers: this.headers,
      }).then(async (x) => {
        if (!x.ok) {
          this.patch({ token: null });
        }else {
          const role = await x.text() as any;
          this.patch({role})
        }
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
    return !!this.token;
  }
  @cell
  public get role() {
    return this.values.role;
  }

  public auth(user: string, token: string) {
    this.patch({
      username: user,
      token: token,
    });
  }
  public createToken(role: 'admin'|'superadmin'|'tochka', username: string){
    return fetch('/webapi/auth/token', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({role, username})
    })
  }

}
export const authStore = globalThis['authStore'] = new AuthStore();
