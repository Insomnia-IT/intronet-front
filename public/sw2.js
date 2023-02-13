/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
self.isDebug = true;

const assets = [
  "/",
  "/root.version",
  "/index.html",
  "/sw/index.js",
  "/icons/96x96.png",
  "/icons/32x32.png",
  "/icons/192x192.png",
  "/fonts/fonts.css",
  "/manifest.json",
  "/images/map_17_78306_41656_78314_41663.png",
  "/images/schema4.webp",
  "/images/insomnia_intro_1.webp",
  "/images/insomnia_intro_2.webp",
  "/images/insomnia_intro_3.webp",
  "/images/insomnia_intro_4.webp",
  "/images/insomnia_intro_5.webp",
  "/fonts/Open-Sans_Regular.woff2",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  self.skipWaiting();
  setInterval(() => storage.checkUpdate(), 10*60*1000);
});
self.addEventListener("fetch", async (event) => {
  console.log(`Handling fetch event for ${event.request.url}`);
  event.respondWith(storage.getResponse(event.request));
});

self.addEventListener("message", (event) => {
  switch (event.data?.action){
    case "init":
      storage.init().then(() => {
        event.source.postMessage({
          action: 'init'
        });
      });
      break;
  }
});

class SwStorage{
  resolve = () => {};
  loading = new Promise(resolve => this.resolve = resolve);

  constructor(name) {
    this.name = name;
  }

  async init(){
    if (self.origin.includes('local')) {
      await caches.delete(this.name);
    }
    return this.load();
  }

  async checkUpdate(){
    const url = '/root.version';
    try {
      const version = await fetch(url);
      await caches.open(this.name).then(async cache => {
        const current = await cache.match(url);
        const newVersion = await version.text();
        const currentVersion = await current.text();
        if (newVersion !== currentVersion){
          const newStorage = new SwStorage(newVersion);
          newStorage.load().then(async newCache => {
            for (let key of await newCache.keys()) {
              cache.put(key, await newCache.match(key));
            }
            this.sendAll({action:'switch-new-version'})
          })
          this.sendAll({action: 'new-version'})
        }
      });
    }catch (e){
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

  load(){
    return caches.open(this.name).then(cache => Promise.all(
      assets.map(a => this.getFromCacheOrFetch(cache, a).catch(e => void 0))
    ).then(() => {
      this.resolve(cache);
      return cache;
    }));
  }

  async getFromCacheOrFetch(cache, request){
    return (await cache.match(request)) ?? this.fetchWithNotify(request).then(res => {
      cache.put(request, res)
    });
  }

  async fetchWithNotify(request){
    return fetch(request).then(res => {
      this.sendAll({
        action: 'loading',
        size: res.url
      });
      return res;
    })
  }

  getResponse(request){
    if (request.url.match(/\.\w+$/))
      return this.loading.then(cache => this.getFromCacheOrFetch(cache, request));
    return this.loading.then(cache => this.getFromCacheOrFetch(cache, '/'));
  }
}

const storage = new SwStorage('root');
