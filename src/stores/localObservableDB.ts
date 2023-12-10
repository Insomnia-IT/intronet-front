import { EventEmitter } from "@cmmn/core";
import { IndexedDatabase } from "@stores/indexedDatabase";
import { ObservableDBEvents } from "@stores/observableDB";

export class LocalObservableDB<T extends { _id: string }> extends EventEmitter<
  ObservableDBEvents<T>
> {
  protected db = new IndexedDatabase(this.name);
  protected items = new Map<string, T>();
  public isLoaded: Promise<void> = this.onceAsync("loaded");

  constructor(public name: string) {
    super();
    globalThis[name] = this;
    this.init();
  }

  async init() {
    await this.loadItems().then((x) => {
      this.emit("loaded");
      this.emit("change");
    });

    if (location.pathname.match(/\.reload/)) {
      await this.clear();
    }
  }

  async clear() {
    for (let [key, item] of this.items) {
      await this.addOrUpdate({
        ...item,
        deleted: true,
      }, true);
    }
    this.emit("change", {
      type: "delete",
      key: undefined,
    });
  }

  async loadItems() {
    const keys = await this.db.keys();

    this.items = new Map();
    for (let key of keys) {
      this.items.set(key as string, await this.db.get(key as string));
    }
    this.emit("change", {
      type: "init",
      value: Array.from(this.values()),
    });
  }

  get(id: string): T {
    return this.items.get(id);
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

  async remove(key: string) {
    const existed = this.get(key);
    if (!existed) return;
    return this.addOrUpdate({
      ...existed,
      deleted: true,
    });
  }

  async set(value: T) {
    await this.db.set(value._id, value);
    this.items.set(value._id, value);
  }

  async addOrUpdate(diff: Partial<T> & { _id: string }, skipChange = false) {
    await this.isLoaded;
    const value = { ...this.items.get(diff._id), ...diff };
    await this.set(value);
    if (!skipChange) {
      this.emit("change", {
        type: "addOrUpdate",
        key: value._id,
        value,
      });
    }
  }

  toArray(): T[] {
    return Array.from(this.items.values()).filter((x) => !x["deleted"]);
  }
}
