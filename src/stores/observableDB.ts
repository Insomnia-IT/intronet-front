import { EventEmitter, Fn } from "@cmmn/cell/lib";
import { IsConnected } from "@stores/connection";
import { IndexedDatabase } from "@stores/indexedDatabase";
import { authStore } from "@stores/auth.store";
import { api } from "./api";

export class ObservableDB<T extends { _id: string }> extends EventEmitter<{
  loaded: void;
  change:
    | { type: "init"; value: T[] }
    | ((
        | { type: "addOrUpdate"; key: string | number; value: T }
        | { type: "delete"; key: string | number }
      ) & { fromReplication?: boolean });
}> {
  private db = new IndexedDatabase(this.name);

  protected items = new Map<string, T & { version: string }>();

  public isLoaded: Promise<void> = this.onceAsync("loaded");

  constructor(public name: string, public localOnly: boolean = false) {
    super();
    globalThis[name] = this;
    if (location.pathname.match(/\.reload/)) {
      this.clear();
    }
    this.init();
  }

  async init() {
    await this.loadItems().then((x) => {
      this.emit("loaded");
      this.emit("change");
    });
    if (!this.localOnly) {
      await this.sync().catch(console.error);
      setInterval(() => this.sync().catch(console.error), 3000);
    }
  }

  async remove(key: string) {
    await this.db.remove(key);
    this.items.delete(key);
    this.emit("change", {
      type: "delete",
      key,
    });
  }

  async clear() {
    await this.db.purge();
    this.items.clear();
    this.emit("change", {
      type: "delete",
      key: undefined,
    });
  }

  async set(value: T & { version: string }) {
    await this.db.set(value._id, value);
    this.items.set(value._id, value);
  }

  async addOrUpdate(value: T, skipChange = false) {
    await this.isLoaded;
    const valueWithVersion = {
      ...value,
      version: Fn.ulid(),
    };
    await this.set(valueWithVersion);
    if (!skipChange) {
      await VersionsDB.Instance.set({
        _id: this.name,
        version: valueWithVersion.version,
      });
      this.emit("change", {
        type: "addOrUpdate",
        key: value._id,
        value,
      });
    }
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

  private syncLock = false;
  async sync() {
    await VersionsDB.Instance.isLoaded;
    if (this.syncLock) return;
    this.syncLock = true;
    try {
      if (this.localVersion < this.remoteVersion) {
        await this.loadFromServer();
      } else if (this.localVersion > this.remoteVersion) {
        await this.saveToServer();
      }
    } finally {
      this.syncLock = false;
    }
  }

  async saveToServer() {
    if (this.localOnly) return;
    for (let item of this.items.values()) {
      if (item.version <= this.remoteVersion) continue;

      await fetch(`${api}/data/${this.name}`, {
        method: "POST",
        headers: authStore.headers,
        body: JSON.stringify(item),
      }).catch();
    }
    await VersionsDB.Instance.loadFromServer();
  }

  async loadFromServer() {
    if (this.localOnly) return;
    const newItems = (await fetch(
      `${api}/data/${this.name}?since=${this.localVersion}`,
      {
        headers: authStore.headers,
      }
    ).then((x) => x.json())) as (T & { version: string })[];
    for (let newItem of newItems) {
      await this.set(newItem);
    }
    this.emit("change", {
      type: "init",
      value: Array.from(this.items.values()),
    });
    await VersionsDB.Instance.set({
      _id: this.name,
      version: VersionsDB.Instance.remote[this.name],
    });
  }

  get remoteVersion() {
    return VersionsDB.Instance.remote[this.name] ?? "";
  }

  get localVersion() {
    return VersionsDB.Instance.get(this.name)?.version ?? "";
  }
}

class VersionsDB extends ObservableDB<{ version: string; _id: string }> {
  private static _instance: VersionsDB | undefined;
  public static get Instance() {
    return (this._instance ??= new VersionsDB());
  }

  constructor() {
    super("versions");
  }

  public remote: Record<string, string> = {};

  async init() {
    await this.loadItems();
    await this.loadFromServer();
    this.emit("loaded");
    setInterval(() => this.loadFromServer(), 3000);
  }

  public get local(): Record<string, string> {
    return Object.fromEntries(
      Array.from(this.values()).map((x) => [x._id, x.version])
    );
  }

  async loadFromServer() {
    try {
      this.remote = await fetch(`${api}/versions`, {
        headers: authStore.headers,
      }).then((x) => x.json());
      IsConnected.set(true);
    } catch (e) {
      IsConnected.set(false);
    }
  }
}
