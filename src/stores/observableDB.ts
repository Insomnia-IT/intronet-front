import { EventEmitter, Fn, AsyncQueue } from "@cmmn/cell/lib";
import indexeddbWrapper from 'indexeddb-wrapper'

console.log(indexeddbWrapper);
export class ObservableDB<
  T extends { _id: string }
> extends EventEmitter<{
  loaded: void;
  change: {type: "init"; value: T[]; } | (
    {type: "update"; key: string | number; value: T;} |
    {type: "batch-update"; keys: string[]; values: T[];} |
    {type: "add"; key: string | number; value: T;} |
    {type: "batch-add"; keys: string[]; values: T[];} |
    {type: "delete"; key: string | number;}
    ) & {fromReplication?: boolean;}
}> {

  private db: Store<T> = createStore(this.name);

  protected items = new Map<string, T>();

  public isLoaded: Promise<void> = this.onceAsync("loaded");

  constructor(public name: string) {
    super();
    globalThis[name] = this;
    this.init();
  }

  async init() {
    await this.loadItems().then(x => this.emit('loaded'));
    await this.sync();
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
    this.emit('change',{
      type: 'delete',
      key: undefined
    })
  }

  async addOrUpdate(value: T, skipChange = false) {
    await this.isLoaded;
    await this.db.set(value._id, value);
    this.items.set(value._id, value);
    if (!skipChange) {
      await VersionsDB.Instance.addOrUpdate({
        _id: this.name,
        version: value['version'] ?? Fn.ulid()
      });
      this.emit("change", {
        type: "add",
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

  async loadItems(){
    const keys = await this.db.keys();
    this.items = new Map();
    for (let key of keys) {
      this.items.set(key, await this.db.get(key));
    }
    this.emit("change", {
      type: "init",
      value: Array.from(this.values())
    });
  }

  public syncQueue = new AsyncQueue();
  async sync() {
    // const remote = new PouchDB(`${ObservableDB.Remote}/${this.name}`);
    const versions = VersionsDB.Instance;
    // versions.on('change', async e => {
    //   if (e.type == 'update' && e.key == this.name && e.fromReplication){
    //     const currentVersion = this.items.map(x => x.version)
    //     await remote.replicate.to(this.db);
    //     await this.loadItems();
    //   }
    //   if (e.type == 'batch-update' && e.keys.includes(this.name) && e.fromReplication){
    //     await remote.replicate.to(this.db);
    //     await this.loadItems();
    //   }
    // });
    // return;
    // this.on('change', async e => {
    //   if (e.type !== 'init' && !e.fromReplication) {
    //     this.syncQueue.Invoke(async () => {
    //       await versions.addOrUpdate({
    //         _id: this.name,
    //         version: Fn.ulid()
    //       });
    //     });
    //   }
    // })
    await versions.isLoaded;
    if (versions.local[this.name] !== versions.remote[this.name]) {
      const newItems = await fetch(`/api/data/${this.name}?since=${versions.local[this.name] ?? ''}`).then(x => x.json()) as T[];
      for (let newItem of newItems) {
        await this.addOrUpdate(newItem, true);
      }
      this.emit('change', {
        type: 'init',
        value: Array.from(this.items.values()),
      });
      await VersionsDB.Instance.addOrUpdate({
        _id: this.name,
        version: versions.remote[this.name]
      });
    }
  }
}


class VersionsDB extends ObservableDB<{version: string; _id: string;}> {

  private static _instance: VersionsDB | undefined;
  public static get Instance(){
    return (this._instance ??= new VersionsDB());
  }

  constructor() {
    super('versions');
  }

  public remote: Record<string, string> = {};

  async init(){
    await this.loadItems();
    try {
      this.remote = await fetch(`/api/versions`).then(x => x.json());
    }finally {
      this.emit("loaded");
    }
  }

  public get local(): Record<string, string>{
    return Object.fromEntries(Array.from(this.values()).map(x => [x._id, x.version]));
  }

}

function createStore(name: string){
  // @ts-ignore
  return indexeddbWrapper.default({
    stores: [name],
    databaseName: name,
    version: 1
  }).stores[name];
}

interface Store<T = any> {
  get: (key: string) => Promise<T>;
  keys: () => Promise<string[]>;
  set: (key: string, value: T) => Promise<void>;
  purge: () => Promise<void>;
  remove: (key: string) => Promise<void>;
  destroy: () => Promise<void>;
}
