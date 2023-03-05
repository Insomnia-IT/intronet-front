/// <reference lib="WebWorker" />
import {ServiceWorkerAction} from "./actions";

declare var self: ServiceWorkerGlobalScope;
import assets from "./assets.json";

const versionUrl = '/root.version';

export class SwStorage {
  resolve: () => void;
  loading = new Promise<void>(resolve => this.resolve = resolve);
  cache: Cache;

  constructor(protected name, protected version: string | undefined = undefined) {
    if (self.origin.includes('local')) {
      this.clear().then(() => this.load())
    }else {
      this.load();
    }
  }


  clear(){
    return caches.delete(this.name);
  }

  async checkUpdate(force = false){
    console.log(`check ${versionUrl} for update`);
    try {
      const version = await fetch(versionUrl).then(x => x.text());
      if (version === this.version && !force) {
        console.log(`check ${versionUrl} for update: same version found, ${version}`);
        return;
      }
      console.log(`start update to version ${version}`);
      const newStorage = new SwStorage('tmp', version);
      newStorage.load().then(async newCache => {
        for (let key of await newCache.keys()) {
          await this.cache.delete(key);
          await this.cache.put(key, await newCache.match(key));
        }
        await newStorage.clear();
        await this.sendAll({action: 'new-version' as ServiceWorkerAction})
      })
      console.log(`updated to version ${version}`);
    }catch (e){
      console.error(e);
    }
  }

  async sendAll(data){
    const clients = await self.clients.matchAll({
      includeUncontrolled: true
    });
    for (let client of clients){
      client.postMessage(data);
    }
  }

  async load(){
    this.version ??= await fetch(versionUrl).then(x => x.text());
    this.cache = await caches.open(this.name);
    await Promise.all(
      assets.map(a => this.getFromCacheOrFetch(new Request(a)).catch(console.error))
    )
    this.resolve();
    return this.cache;
  }

  async getFromCacheOrFetch(request: Request){
    return (await this.cache.match(request)) ?? this.fetchAndPut(request)
  }

  async fetchAndPut(request: Request){
    const res = await fetch(new Request(request.url + `?hash=${+new Date()}`));
    const clone = res.clone();
    const blob = await clone.blob()
    await this.sendAll({
      action: 'loading' as ServiceWorkerAction,
      size: blob.size,
      cache: this.name,
      url: request.url
    });
    await this.cache.put(request, res);
    return res;
  }

  async getResponse(request: Request){
    if (new URL(request.url).pathname.match(/^\/(api|db)/))
      return fetch(request);
    await this.loading;
    // routes with extensions: .js, .css, .json...
    if (request.url.match(/\.\w+$/))
      return this.getFromCacheOrFetch(request);
    // routes without extension: /, /map, /info, ...
    return this.getFromCacheOrFetch(new Request('/'));
  }
}

