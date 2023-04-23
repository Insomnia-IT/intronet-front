import { cell, Fn } from "@cmmn/cell/lib";
import { jest } from "@jest/globals";
export class LocalStore<TCookie extends Record<string, string>> {
  @cell
  protected values: TCookie = this.readValues();

  protected readValues(): TCookie {
    return Object.fromEntries(
      Array(localStorage.length)
        .fill(" ")
        .map((_, i) => [
          localStorage.key(i),
          localStorage.getItem(localStorage.key(i)),
        ])
    ) as TCookie;
  }

  protected patch(patch: Partial<TCookie>) {
    this.values = {
      ...this.values,
      ...patch,
    };
    for (let key in patch) {
      if ((patch[key] = null)) localStorage.removeItem(key);
      else localStorage.setItem(key, patch[key]);
    }
  }

  public syncCookies() {
    this.values = this.readValues();
  }
}
