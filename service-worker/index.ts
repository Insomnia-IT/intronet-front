import { SwStorage } from "./sw-storage";
import { ServiceWorkerAction } from "./actions";
declare var self: ServiceWorkerGlobalScope;

const storage = new SwStorage("root");

self.addEventListener("install", (event) => {
  // event.waitUntil(caches.delete('root').catch())
});
self.addEventListener("activate", (event) => {
  self.skipWaiting();
});
setInterval(() => storage.checkUpdate(), 60 * 1000);
self.addEventListener("fetch", async (event) => {
  try {
    if (event.request.url.match(".reload")) {
      await storage.clear();
    }
    event.respondWith(storage.getResponse(event.request));
  } catch (e) {
    console.error(e);
  }
});

self.addEventListener("message", (event) => {
  try {
    switch (event.data?.action as ServiceWorkerAction) {
      case "reload":
        storage.clear().then((x) => storage.load());
        break;
      case "check":
        storage.checkUpdate(event.data.force);
        break;
      case "init":
        storage.isIOS = event.data.isIOS;
        storage
          .load()
          .then(() => self.clients.claim())
          .then(() => {
            event.source.postMessage({
              action: "init" as ServiceWorkerAction,
            });
          });
        break;
    }
  } catch (e) {
    console.error(e);
  }
});
