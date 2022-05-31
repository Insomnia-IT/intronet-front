import { EventEmitter } from "cellx";
import { Dexie, Table } from "dexie";
import { compare } from "../helpers/compare";

export class ObservableDB<
  T extends { id: number | string }
> extends EventEmitter {
  private table: Table<T>;
  private items = new Map<number | string, T>();

  public isLoaded = new Promise<void>((resolve) =>
    this.once("loaded", () => resolve())
  );

  constructor(name: string) {
    super();
    const db = new Dexie(name);
    db.version(1).stores({
      [name]: `id`,
    });
    this.table = db[name];
    this.table.toArray().then((items) => {
      this.items = new Map<number | string, T>(items.map((x) => [x.id, x]));
      this.emit("change", {
        value: items,
      });
      this.emit("loaded");
    });
  }

  /**
   * Merges data from server-side
   * @param items
   */
  merge(items: T[], sourthOfTruth: "server" | "local") {
    const from = new Map(items.map((x) => [x.id, x]));
    if (sourthOfTruth == "local") {
      for (let [key, local] of this.entries()) {
        if (!from.has(key)) this.add(local, "db");
        else {
          const server = from.get(key);
          if (!compare(server, local)) {
            this.update(local, "db");
          }
        }
      }
      for (let key of from.keys()) {
        if (!this.items.has(key)) {
          this.remove(key, "db");
        }
      }
    } else {
      for (let [key, server] of from.entries()) {
        if (!this.items.has(key)) this.add(server, "server");
        else {
          const local = this.get(key);
          if (!compare(server, local)) {
            this.update(server, "server");
          }
        }
      }
      for (let key of this.keys()) {
        if (!from.has(key)) {
          this.remove(key, "server");
        }
      }
    }
  }

  remove(key: number | string, source: "user" | "server" | "db" = "user") {
    if (source != "db") {
      this.table.delete(key);
      this.items.delete(key);
    }
    this.emit("change", {
      type: "delete",
      key,
      source,
    });
  }

  clear() {
    this.table.clear();
    this.items.clear();
  }

  addOrUpdate(value: T, source: "user" | "server" | "db" = "user") {
    if (this.items.has(value.id)) this.update(value, source);
    else this.add(value, source);
  }

  add(value: T, source: "user" | "server" | "db" = "user") {
    const key = value.id;
    if (source != "db") {
      this.table.add(value);
      this.items.set(key, value);
    }
    this.emit("change", {
      type: "add",
      key,
      value,
      source,
    });
  }

  addRange(valueArr: T[], source: "user" | "server" | "db" = "user") {
    valueArr.forEach((value) => this.add(value, source));
  }
  addOrUpdateRange(valueArr: T[], source: "user" | "server" | "db" = "user") {
    valueArr.forEach((value) => this.addOrUpdate(value, source));
  }

  update(value: T, source: "user" | "server" | "db" = "user") {
    const key = value.id;
    if (source != "db") {
      this.table.update(key, value);
      this.items.set(key, value);
    }
    this.emit("change", {
      type: "update",
      key,
      value,
      source,
    });
  }

  get(id: number | string): T {
    return this.items.get(id);
  }

  toArray(): T[] {
    return Array.from(this.items.values());
  }

  entries() {
    return this.items.entries();
  }

  keys() {
    return this.items.keys();
  }

  values() {
    return this.items.values();
  }
}
