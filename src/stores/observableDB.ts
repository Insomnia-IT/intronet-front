import { EventEmitter, compare, Fn, AsyncQueue } from "@cmmn/cell/lib";
import PouchDB from "pouchdb-browser";

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

  public static Remote = globalThis.location
    ? `${location.protocol}//admin:password@${location.host}/db`
    : `http://admin:password@localhost:5984`;

  protected db= new PouchDB<T>(this.name);

  protected items = new Map<string, T>();

  public isLoaded: Promise<void> = this.onceAsync("loaded");

  constructor(public name: string) {
    super();
    globalThis[name] = this;
    this.init();
  }

  async init() {
    try {
      await this.sync();
    } finally {
      this.emit('loaded');
    }
  }

  async remove(key: string) {
    await this.db.remove({
      _id: key.toString(),
      _rev: null
    });
    this.items.delete(key);
    this.emit("change", {
      type: "delete",
      key,
    });
  }

  async clear() {
    await this.db.allDocs().then(x => Promise.all(x.rows.map(d => this.db.remove(d.id, d.value.rev))))
      .then(x => this.db.compact())
      .then(x => this.db.viewCleanup())
    this.items.clear();
    this.emit('change',{
      type: 'delete',
      key: undefined
    })
  }

  async addOrUpdate(value: T, skipChange = false) {
    if (this.items.has(value._id)) {
      await this.update(value, skipChange);
    } else {
      await this.add(value, skipChange);
    }
  }

  async add(value: T, skipChange = false) {
    const key = value._id;
    await this.db.put(value).catch(console.log);
    this.items.set(key, value);
    if (!skipChange) {
      this.emit("change", {
        type: "add",
        key,
        value,
      });
    }
    return value;
  }

  async addRange(valueArr: T[]) {
    for (const value of valueArr) {
      await this.add(value, true);
    }
    this.emit("change", {
      type: "batch-add",
      keys: valueArr.map(x => x._id),
      values: valueArr,
    });
  }

  update(value: T,  skipChange = false) {
    const key = value._id;
    this.db.get(value._id).then(res => this.db.put(({
      ...value,
      _rev: res._rev
    }))).catch(console.log);
    this.items.set(key, value);
    if (!skipChange) {
      this.emit("change", {
        type: "update",
        key,
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
    const items = await this.db.allDocs<T>({
      include_docs: true,
    });
    this.items = new Map<string, T>(items.rows.map((x) => [x.id, x.doc]));
    this.emit("change", {
      type: "init",
      value: items.rows.map(x => x.doc),
    });
    console.log(items);
  }

  public syncQueue = new AsyncQueue();
  async sync() {
    const versions = VersionsDB.Instance;
    await versions.isLoaded;
    const remote = new PouchDB(`${ObservableDB.Remote}/${this.name}`);
    if (!versions.items.has(this.name)) {
      await versions.add({_id: this.name, version: Fn.ulid()});
    } else if (versions.haveChanges.get(this.name)) {
      await remote.replicate.to(this.db);
    }
    versions.on('change', async e => {
      if (e.type == 'update' && e.key == this.name && e.fromReplication){
        await remote.replicate.to(this.db);
        await this.loadItems();
      }
      if (e.type == 'batch-update' && e.keys.includes(this.name) && e.fromReplication){
        await remote.replicate.to(this.db);
        await this.loadItems();
      }
    });
    this.on('change', async e => {
      if (e.type !== 'init' && !e.fromReplication) {
        this.syncQueue.Invoke(async () => {
          await this.db.replicate.to(remote);
          await versions.addOrUpdate({
            _id: this.name,
            version: Fn.ulid()
          });
        });
      }
    })
    await this.loadItems();
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

  public haveChanges = new Map<string, boolean>();

  async init(){
    await this.loadItems();
    const versions = new Map(this.items);
    try {
      const remote = new PouchDB(`${ObservableDB.Remote}/${this.name}`);
      const info = await remote.info().catch(e => {
        return null;
      })
      if (info) {
        await remote.replicate.to(this.db);
      }
      await this.loadItems();
      for (let item of this.items.values()) {
        this.haveChanges.set(item._id, item.version !== versions.get(item._id)?.version);
      }
      const sync = PouchDB.sync(remote, this.db, {
        live: true,
        retry: true,
        timeout: 10_000,
        heartbeat: 10_000
      });
      sync.on('change', event => {
        if (event.direction == "push")
          return;
        for (let doc of event.change.docs) {
          this.items.set(doc._id, doc as any);
        }
        this.emit("change", {
          type: "batch-update",
          keys: event.change.docs.map(x => x._id),
          values: event.change.docs as any[],
          fromReplication: true
        });
      });
    }finally {
      this.emit("loaded");
    }
  }

}
