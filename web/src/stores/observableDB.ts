import { Fn } from "@cmmn/core";
import { IsConnected } from "./connection";
import { authStore } from "./auth.store";
import { api } from "./api";
import { LocalObservableDB } from "./localObservableDB";

export class ObservableDB<T extends { _id: string }> extends LocalObservableDB<
  T & { version: string }
> {
  async init() {
    await super.init();
    await this.sync().catch(console.error);
    setInterval(() => this.sync().catch(console.error), 300);
  }

  async addOrUpdate(value: Partial<T> & { _id: string }, skipChange = false) {
    const valueWithVersion = {
      ...value,
      version: Fn.ulid(),
    } as Partial<T & { version: string }> & { _id: string };
    await super.addOrUpdate(valueWithVersion, skipChange);
  }

  async set(value: T & {version: string}){
    await super.set(value);
    if (value.version > this.localVersion)
      this.localVersion = value.version;
  }

  private syncLock = false;
  async sync() {
    await VersionsDB.Instance.isLoaded;
    if (this.syncLock) return;
    this.syncLock = true;
    try {
      await Promise.all([this.loadFromServer(), this.saveToServer()]);
      this.syncVersion =
        this.localVersion > this.remoteVersion
          ? this.localVersion
          : this.remoteVersion;
    } finally {
      this.syncLock = false;
    }
  }
  private errorTimeout = 300;
  private saveLock = false;
  async saveToServer() {
    // nothing changed since sync
    if (this.localVersion <= this.syncVersion) return;
    if (this.saveLock) return;
    this.saveLock = true;
    const updates = [] as Array<{ db: string; value: T }>;
    for (let item of this.items.values()) {
      // item has not changed since sync
      if (item.version <= this.syncVersion) continue;
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
    this.saveLock = false;
  }

  private loadLock = false;
  async loadFromServer() {
    // nothing changed since sync
    if (this.remoteVersion <= this.syncVersion) return;
    if (this.loadLock) return;
    this.loadLock = true;
    const newItems = (await fetch(
      `${api}/data/${this.name}?since=${this.localVersion}`,
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
    this.loadLock = false;
  }

  // max version of remote items
  get remoteVersion() {
    return VersionsDB.Instance.get(this.name)?.remote ?? "";
  }
  // max version of local items
  get localVersion() {
    return VersionsDB.Instance.get(this.name)?.local ?? "";
  }
  set localVersion(version: string) {
    VersionsDB.Instance.addOrUpdate({ _id: this.name, local: version });
  }
  // synced version (data loaded from remote to local)
  get syncVersion() {
    return VersionsDB.Instance.get(this.name)?.synced ?? "";
  }
  set syncVersion(version: string) {
    VersionsDB.Instance.addOrUpdate({ _id: this.name, synced: version });
  }
}

class VersionsDB extends LocalObservableDB<{
  _id: string;
  local: string;
  remote: string;
  synced: string;
}> {
  private static _instance: VersionsDB | undefined;
  public static get Instance() {
    return (this._instance ??= new VersionsDB());
  }

  constructor() {
    super("versions");
  }

  async init() {
    await this.loadItems();
    await this.loadFromServer();
    this.emit("loaded");
    setInterval(() => this.loadFromServer(), 1000);
  }

  private loadingLock = false;
  async loadFromServer() {
    if (this.loadingLock) return;
    this.loadingLock = true;
    try {
      const actual = (await fetch(`${api}/versions`, {
        headers: authStore.headers,
      }).then((x) => x.json())) as Record<string, string>;
      for (let name in actual) {
        await this.set({
          ...this.get(name),
          _id: name,
          remote: actual[name],
        });
      }
      IsConnected.set(true);
    } catch (e) {
      IsConnected.set(false);
    } finally {
      this.loadingLock = false;
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
