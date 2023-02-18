import { compare } from "../helpers/compare";
import {EventEmitter} from "@cmmn/cell/lib";
import PouchDB from "pouchdb-browser";

export class ObservableDB<
  T extends { _id: string }
> extends EventEmitter<{
  loaded: void;
  change: {type: "init"; value: T[];  source: "user" | "server" | "db"} |
    {type: "update"; key: string | number; value: T; source: "user" | "server" | "db"} |
    {type: "add"; key: string | number; value: T; source: "user" | "server" | "db"} |
    {type: "delete"; key: string | number; source: "user" | "server" | "db"}
}> {
  private table= new PouchDB<T>(this.name);
  private items = new Map<string, T>();

  public isLoaded = new Promise<void>((resolve) =>
    this.once("loaded", () => resolve())
  );

  constructor(protected name: string) {
    super();
    this.table = new PouchDB<T>(name);
    this.table.allDocs<T>().then((items) => {
      this.items = new Map<string, T>(items.rows.map((x) => [x.id, x.doc]));
      this.emit("change", {
        source: "db",
        type: "init",
        value: items.rows.map(x => x.doc),
      });
      this.emit("loaded");
    });
  }

  /**
   * Merges data from server-side
   * @param items
   */
  merge(items: T[], sourthOfTruth: "server" | "local") {
    const from = new Map(items.map((x) => [x._id, x]));
    if (sourthOfTruth === "local") {
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

  remove(key: string, source: "user" | "server" | "db" = "user") {
    if (source !== "db") {
      this.table.remove({
        _id: key.toString(),
        _rev: null
      });
      this.items.delete(key);
    }
    this.emit("change", {
      type: "delete",
      key,
      source,
    });
  }

  clear() {
    this.table.allDocs().then(x => Promise.all(x.rows.map(d => this.table.remove(d.doc))));
    this.items.clear();
  }

  addOrUpdate(value: T, source: "user" | "server" | "db" = "user") {
    if (this.items.has(value._id)) this.update(value, source);
    else this.add(value, source);
  }

  add(value: T, source: "user" | "server" | "db" = "user") {
    const key = value._id;
    if (source !== "db") {
      this.table.put(value).catch(() => void 0);
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
    const key = value._id;
    if (source !== "db") {
      this.table.put(value);
      this.items.set(key, value);
    }
    this.emit("change", {
      type: "update",
      key,
      value,
      source,
    });
  }

  get(id: string): T {
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
