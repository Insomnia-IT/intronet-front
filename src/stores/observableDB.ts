import { EventEmitter, compare, Fn } from "@cmmn/cell/lib";
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
  protected db= new PouchDB<T>(this.name);

  protected items = new Map<string, T>();

  public isLoaded: Promise<void> = this.onceAsync("loaded");

  constructor(public name: string) {
    super();
    window[name] = this;
    this.init();
  }

  async init() {
    await this.sync();

    this.emit("loaded");
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
      this.db.remove({
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
    this.db.allDocs().then(x => Promise.all(x.rows.map(d => this.db.remove(d.id, d.value.rev))))
      .then(x => this.db.compact())
      .then(x => this.db.viewCleanup())
      .then(x => versions.update({_id: this.name, version: Fn.ulid()}));
    this.items.clear();
  }

  addOrUpdate(value: T, source: "user" | "server" | "db" = "user") {
    if (this.items.has(value._id)) this.update(value, source);
    else this.add(value, source);
  }

  add(value: T, source: "user" | "server" | "db" = "user") {
    const key = value._id;
    if (source !== "db") {
      this.db.put(value).catch(console.log);
      this.items.set(key, value);
    }
    this.emit("change", {
      type: "add",
      key,
      value,
      source,
    });
    return value;
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
      this.db.get(value._id).then(res => this.db.put(({
        ...value,
        _rev: res._rev
      }))).catch(console.log);
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

  async loadItems(){
    const items = await this.db.allDocs<T>({
      include_docs: true,
    });
    this.items = new Map<string, T>(items.rows.map((x) => [x.id, x.doc]));
    this.emit("change", {
      source: "db",
      type: "init",
      value: items.rows.map(x => x.doc),
    });
  }

  async sync() {
    await versions.isLoaded;
    const remote = new PouchDB(`${location.protocol}//admin:password@${location.host}/db/${this.name}`);
    if (!versions.items.has(this.name)) {
      versions.add({_id: this.name, version: Fn.ulid()});
    } else if (versions.haveChanges.get(this.name)) {
      await remote.replicate.to(this.db);
    }
    versions.on('change', async e => {
      if (e.type == 'update' && e.key == this.name){
        await remote.replicate.to(this.db);
        await this.loadItems();
      }
    });
    this.on('change', async e => {
      if (e.type !== 'init') {
        await this.db.replicate.to(remote);
        await versions.addOrUpdate({
          _id: this.name,
          version: Fn.ulid()
        });
      }
    })
    await this.loadItems();
  }
}

class VersionsDB extends ObservableDB<{version: string; _id: string;}> {
  constructor() {
    super('versions');
  }

  public haveChanges = new Map<string, boolean>();

  async init(){
    await this.loadItems();
    const versions = new Map(this.items);
    const remote = new PouchDB(`${location.protocol}//admin:password@${location.host}/db/${this.name}`);
    await remote.replicate.to(this.db);
    await this.loadItems();
    for (let item of this.items.values()) {
      this.haveChanges.set(item._id, item.version !== versions.get(item._id)?.version);
    }
    const sync = PouchDB.sync(remote, this.db, {
      live: true,
      retry: true
    });
    sync.on('change', event => {
      if (event.direction == "push")
        return;
      for (let doc of event.change.docs) {
        this.items.set(doc._id, doc as any);
        this.emit("change", {
          source: "server",
          type: "update",
          key: doc._id,
          value: doc as any
        });
      }
    });
    this.emit("loaded");
  }

}

const versions = new VersionsDB();
