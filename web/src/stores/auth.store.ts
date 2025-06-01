import { Fn } from "@cmmn/core";
import { LocalStore } from "./localStore";
import { api } from "./api";
import { cell } from "@cmmn/cell";

class AuthStore extends LocalStore<{
  uid: string;
  token: string;
  username: string;
  role: "admin" | "superadmin" | "tochka";
}> {
  get headers() {
    return {
      ...(this.token
        ? {
            Authorization: `Bearer ${this.token}`,
          }
        : {}),
      uid: this.uid,
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
    const token = url.searchParams.get("token") || this.token;
    if (token) {
      fetch(api + "/auth", {
        headers: {
          ...this.headers,
          Authorization: `Bearer ${token}`,
        },
      }).then(async (x) => {
        if (!x.ok) {
          this.patch({ token: null, role: null });
        } else {
          const role = (await x.text()) as any;
          this.patch({ role, token });
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
  public createToken(
    role: "admin" | "superadmin" | "tochka",
    username: string
  ) {
    return fetch(`${api}/auth/token`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ role, username }),
    }).then(async result => {
      const token = await result.text();
      console.log(`Token for ${username}`, token);
    });
  }

  public seed(db: string, force: boolean) {
    return fetch(`${api}/seed/${db}${force ? "?force=1" : ""}`, {
      method: "POST",
      headers: this.headers,
    });
  }

  public async seedAll(force: boolean) {
    await this.seed("locations", force);
    await this.seed("activities", force);
    await this.seed("movies", force);
    await this.seed("vurchel", force);
    await this.seed("main", force);
    await this.seed("shops", force);
  }
}
export const authStore = (globalThis["authStore"] = new AuthStore());
