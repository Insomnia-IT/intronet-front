/// <reference lib="WebWorker" />
import { ServiceWorkerAction } from "./actions";

declare var self: ServiceWorkerGlobalScope;
import assets from "./assets.json";
import assetsAndroid from "./assets.android.json";
import assetsIOS from "./assets.ios.json";

const versionUrl = "/public/root.version";

export class SwStorage {
  resolve: () => void;
  loading = new Promise<void>((resolve) => (this.resolve = resolve));
  cache: Cache;
  isIOS = false;
  cacheOpen = caches.open(this.name).then((x) => (this.cache = x));

  constructor(
    protected name,
    protected version: string | undefined = undefined
  ) {
    if (self.origin.includes("local")) {
      this.clear();
    }
    globalThis["storage" + name] = this;
  }

  clear() {
    return caches.delete(this.name);
  }

  private isUpdating = false;
  async checkUpdate(force = false) {
    console.log(`check ${versionUrl} for update`);
    try {
      const version = await this.getVersion();
      if (version === this.version && !force) {
        console.log(
          `check ${versionUrl} for update: same version found, ${version}`
        );
        return;
      }
      this.isUpdating = true;
      console.log(`start update to version ${version}`);
      const newStorage = new SwStorage("tmp", version);
      newStorage.isIOS = this.isIOS;
      newStorage
        .load()
        .then(async (newCache) => {
          await this.cacheOpen;
          for (let key of await newCache.keys()) {
            await this.cache.delete(key);
            await this.cache.put(key, await newCache.match(key));
          }
          await newStorage.clear();
          await this.sendAll({ action: "new-version" as ServiceWorkerAction });
          this.version = version;
          console.log(`updated to version ${version}`);
        })
        .catch((e) => {
          console.log("failed update");
          this.clear();
        })
        .finally(() => {
          this.isUpdating = false;
        });
    } catch (e) {
      console.error(e);
    }
  }

  async sendAll(data) {
    const clients = await self.clients.matchAll({
      includeUncontrolled: true,
    });
    for (let client of clients) {
      client.postMessage(data);
    }
  }

  private async getVersion() {
    return fetch(versionUrl + "?" + +new Date()).then((x) =>
      x.ok ? x.text() : Promise.reject(`Failed load version`)
    );
  }

  async load(ignoreErrors = true) {
    await this.cacheOpen;
    await Promise.all(
      (this.isIOS
        ? assets.concat(assetsIOS)
        : assets.concat(assetsAndroid)
      ).map((a) =>
        this.getFromCacheOrFetch(new Request(a)).catch((e) => {
          if (ignoreErrors) console.error(e);
          else throw e;
        })
      )
    );
    this.version ??= await this.cache.match(versionUrl).then((x) => x.text());
    this.resolve();
    return this.cache;
  }

  async getFromCacheOrFetch(request: Request, notify = true) {
    await this.cacheOpen;
    return (
      (await this.cache.match(request)) ??
      (await this.fetchAndPut(request, notify))
    );
  }

  async fetchAndPut(request: Request, notify = true) {
    const res = await fetch(new Request(request.url + `?hash=${+new Date()}`));
    if (!res.ok) {
      throw new Error(`Failed load ` + request.url + ", status: " + res.status);
    }
    const clone = res.clone();
    const blob = await clone.blob();
    await this.sendAll({
      action: "loading" as ServiceWorkerAction,
      size: blob.size,
      cache: this.name,
      url: request.url,
    });
    await this.cache.put(request, res);
    return res;
  }

  async getResponse(request: Request) {
    if (new URL(request.url).pathname.match(/^\/(api|db|webapi)/))
      return fetch(request);
    // routes with extensions: .js, .css, .json...
    if (request.url.match(/\.\w+$/)) return this.getFromCacheOrFetch(request);
    // routes without extension: /, /map, /info, ...
    return this.getFromCacheOrFetch(new Request("/"));
  }
}
