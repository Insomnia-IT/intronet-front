import { Fn } from "@cmmn/core";
import { IsConnected } from "@stores/connection";
import { authStore } from "@stores/auth.store";
import { api } from "./api";
import { LocalObservableDB } from "./localObservableDB";

export class ObservableDB<T extends { _id: string }> extends LocalObservableDB<
  T & { version: string }
> {
  async init() {
    await super.init();
    await this.sync().catch(console.error);
    setInterval(() => this.sync().catch(console.error), 10_000);
  }

  toArray(): T[] {
    return Array.from(this.items.values()).filter((x) => !x["deleted"]);
  }

  async addOrUpdate(value: T, skipChange = false) {
    const valueWithVersion = {
      ...value,
      version: Fn.ulid(),
    };
    await super.addOrUpdate(valueWithVersion, skipChange);
    if (!skipChange) {
      await VersionsDB.Instance.set({
        _id: this.name,
        version: valueWithVersion.version,
      });
    }
  }

  private syncLock = false;
  async sync() {
    await VersionsDB.Instance.isLoaded;
    if (this.syncLock) return;
    this.syncLock = true;
    try {
      if (this.lastRemoteVersion < this.remoteVersion) {
        await this.loadFromServer();
      } else if (this.lastRemoteVersion > this.remoteVersion) {
        await this.saveToServer();
      }
    } finally {
      this.syncLock = false;
    }
  }
  private errorTimeout = 300;
  async saveToServer() {
    if (this.localOnly) return;
    const updates = [] as Array<{ db: string; value: T }>;
    for (let item of this.items.values()) {
      if (item.version <= this.remoteVersion) continue;
      updates.push({ db: this.name, value: item });
    }
    if (updates.length > 0) {
      await fetch(`${api}/batch`, {
        method: "POST",
        headers: authStore.headers,
        body: JSON.stringify(updates),
      }).catch(
        () =>
          new Promise((resolve) => setTimeout(resolve, this.errorTimeout * 1.2))
      );
    }
    await VersionsDB.Instance.loadFromServer();
  }

  async loadFromServer() {
    if (this.localOnly) return;
    const newItems = (await fetch(
      `${api}/data/${this.name}?since=${this.lastRemoteVersion}`,
      {
        headers: authStore.headers,
      }
    ).then((x) => x.json())) as (T & { version: string })[];
    for (let newItem of newItems) {
      const local = this.items.get(newItem._id);
      if (!local || local.version < newItem.version) {
        await this.set(newItem);
      }
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

  get lastRemoteVersion() {
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

  private isLoading = false;
  async loadFromServer() {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      this.remote = await fetch(`${api}/versions`, {
        headers: authStore.headers,
      }).then((x) => x.json());
      IsConnected.set(true);
    } catch (e) {
      IsConnected.set(false);
    } finally {
      this.isLoading = false;
    }
  }
}

export type ObservableDBEvents<T> = {
  loaded: void;
  change:
    | { type: "init"; value: T[] }
    | ((
        | { type: "addOrUpdate"; key: string | number; value: T }
        | { type: "delete"; key: string | number }
      ) & { fromReplication?: boolean });
};
