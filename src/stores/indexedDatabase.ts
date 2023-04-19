export class IndexedDatabase<T> {
  private db = new Promise<IDBDatabase>((resolve, reject) => {
    var request = (
      window.indexedDB ||
      // @ts-ignore
      window.mozIndexedDB ||
      // @ts-ignore
      window.webkitIndexedDB
    ).open(this.name, "1");
    let succRes = undefined;
    request.onsuccess = function (e) {
      resolve(e.target.result);
    };
    request.onerror = function (e) {
      reject(e);
    };
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      // stores.forEach(function (store) {
      if (!db.objectStoreNames.contains(this.name)) {
        db.createObjectStore(this.name);
      }
      // });
    };
    request.onblocked = function (e) {
      reject(e);
    };
  });
  constructor(private name: string) {}

  private request<T>(
    req: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.db.then((db) => {
        var transaction = db.transaction([this.name], "readwrite");
        transaction.onabort = reject;
        const store = transaction.objectStore(this.name);
        const request = req(store);
        request.onerror = reject;
        request.onsuccess = function () {
          resolve(this.result);
        };
        transaction.commit();
      });
    });
  }

  public set(key: string, value: T) {
    return this.request((store) => store.put(value, key));
  }

  public keys() {
    return this.request((store) => store.getAllKeys());
  }

  public get<T>(key: string): Promise<T> {
    return this.request((store) => store.get(key));
  }

  public remove(key: string) {
    return this.request((store) => store.delete(key));
  }

  public purge() {
    return this.request((store) => store.clear());
  }
}
