import { Fn } from "@cmmn/core";
import { IsConnected } from "./connection";
import { authStore } from "./auth.store";
import { api } from "./api";
import { LocalObservableDB } from "./localObservableDB";

export class ObservableDB<T extends { _id: string }> extends LocalObservableDB<
  T & { version: string }
> {
  private syncInterval: any | undefined;
  async init() {
    await super.init();
    await this.sync().catch(console.error);
    this.syncInterval = setInterval(
      () => this.sync().catch(console.error),
      300
    );
  }

  async refresh() {
    clearInterval(this.syncInterval);
    await this.db.purge();
    await VersionsDB.Instance.addOrUpdate({
      _id: this.name,
      synced: "",
      init: "",
      local: "",
      remote: "",
    });
    await VersionsDB.Instance.loadFromServer();
    await this.init();
  }

  async addOrUpdate(value: Partial<T> & { _id: string }, skipChange = false) {
    const valueWithVersion = {
      ...value,
      version: Fn.ulid(),
    } as Partial<T & { version: string }> & { _id: string };
    await super.addOrUpdate(valueWithVersion, skipChange);
  }

  async set(value: T & { version: string }) {
    await super.set(value);
    if (value.version > this.localVersion) this.localVersion = value.version;
  }

  private syncLock = false;
  async sync() {
    await VersionsDB.Instance.isLoaded;
    if (this.syncLock) return;
    this.syncLock = true;
    try {
      // Очистка устаревших элементов
      for (let item of this.items.values()) {
        if (item.version < this.initVersion) {
          await this.db.remove(item._id);
          this.items.delete(item._id);
        }
      }

      // Проверяем, есть ли изменения для синхронизации
      const needsSync = this.localVersion > this.syncVersion || this.remoteVersion > this.syncVersion;
      if (needsSync) {
        await Promise.all([this.loadFromServer(), this.saveToServer()]);

        // Определяем новую версию синхронизации как большую из локальной и удаленной
        const syncVersion = this.localVersion > this.remoteVersion ? this.localVersion : this.remoteVersion;
        if (syncVersion > this.syncVersion) {
          this.syncVersion = syncVersion;
          this.emit("change", {
            type: "init",
            value: Array.from(this.items.values()),
          });
        }
      }
    } finally {
      this.syncLock = false;
    }
  }
  private errorTimeout = 300;
  private saveLock = false;
  async saveToServer() {
    // Проверяем, есть ли локальные изменения для отправки
    if (this.localVersion <= this.syncVersion) return;

    if (this.saveLock) return;
    this.saveLock = true;

    try {
      // Загружаем последние данные с сервера перед сохранением
      // Это помогает избежать конфликтов при одновременном редактировании
      await this.loadFromServer();

      const updates = [] as Array<{ db: string; value: T }>;
      for (let item of this.items.values()) {
        // Отправляем только те элементы, которые изменились после последней синхронизации
        if (item.version > this.syncVersion) {
          updates.push({ db: this.name, value: item });
        }
      }

      if (updates.length > 0) {
        await fetch(`${api}/batch`, {
          method: "POST",
          headers: authStore.headers,
          body: JSON.stringify(updates),
        });

        // Обновляем syncVersion после успешного сохранения
        this.syncVersion = this.localVersion;
      }
    } catch (error) {
      console.error('Error saving to server:', error);
      // В случае ошибки ждем перед следующей попыткой
      await new Promise((resolve) => setTimeout(resolve, this.errorTimeout));
    } finally {
      this.saveLock = false;
    }
  }

  private loadLock = false;
  async loadFromServer() {
    // Проверяем, есть ли новые данные на сервере
    if (this.remoteVersion <= this.syncVersion) return;
    if (this.loadLock) return;
    this.loadLock = true;

    try {
      // Запрашиваем только новые элементы, используя текущую версию синхронизации
      const newItems = await fetch(
        `${api}/data/${this.name}?since=${this.syncVersion}`,
        {
          headers: authStore.headers
        }
      ).then((x) => x.json()) as (T & { version: string })[];

      let updated = false;
      for (let newItem of newItems) {
        const local = this.items.get(newItem._id);
        // Обновляем локальный элемент, если его нет или если серверная версия новее
        if (!local || local.version < newItem.version) {
          await this.set(newItem);
          updated = true;
        }
      }

      // Оповещаем о изменениях только если были реальные обновления
      if (updated) {
        this.emit("change", {
          type: "init",
          value: Array.from(this.items.values()),
        });
      }
    } finally {
      this.loadLock = false;
    }
  }
  // version of db data loading
  get initVersion() {
    return VersionsDB.Instance.get(this.name)?.init ?? "";
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
  init: string;
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
    setInterval(() => this.loadFromServer(), 3000);
  }

  private loadingLock = false;
  async loadFromServer() {
    if (this.loadingLock) return;
    this.loadingLock = true;
    try {
      const actual = (await fetch(`${api}/versions`, {
        headers: authStore.headers,
      }).then((x) => x.json())) as Record<string, { min: string; max: string }>;
      for (let name in actual) {
        await this.set({
          ...this.get(name),
          _id: name,
          remote: actual[name].max,
          init: actual[name].min,
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
