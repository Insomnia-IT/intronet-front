!(function (e, t) {
  if ("object" == typeof exports && "object" == typeof module)
    module.exports = t();
  else if ("function" == typeof define && define.amd) define([], t);
  else {
    var s = t();
    for (var r in s) ("object" == typeof exports ? exports : e)[r] = s[r];
  }
})(self, function () {
  return (() => {
    "use strict";
    var e = {
        144: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.CacheCleaner = void 0),
            (t.CacheCleaner = class {
              constructor(e) {
                this.cache = e;
              }

              async clean(e) {
                self.log(`cache cleaning by '${e}' strategy…`),
                  await this.tryToDelete(e, 2).then((e) =>
                    e.forEach((e) =>
                      self.logError(
                        `can't delete cache '${e}', 2 attempts were made`
                      )
                    )
                  ),
                  self.log("cache cleaning complete");
              }

              async tryToDelete(e, t) {
                let s = await this.findToDelete(e);
                for (; t >= 1; ) {
                  if (0 === s.length) return s;
                  await this.delete(s), (s = await this.findToDelete(e)), t--;
                }
                return s;
              }

              async findToDelete(e) {
                const t = await self.caches.keys(),
                  s = this.cache.items().map((e) => e.cacheName.value);
                if ("delete-uncontrolled" === e)
                  return t.filter((e) => !s.includes(e));
                throw new Error(
                  `sw unknown strategy '${e}' of CacheCleaner.findToDelete(…)`
                );
              }

              async delete(e) {
                if (e.length)
                  return Promise.all(
                    e.map(
                      (e) => (
                        self.log(`delete cache '${e}'`), self.caches.delete(e)
                      )
                    )
                  );
              }
            });
        },
        935: (e, t, s) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.CacheContainer = void 0);
          const r = s(626);
          t.CacheContainer = class {
            constructor(e) {
              if (
                ((this.itemsOpt = e),
                (this.container = new Map()),
                !(null == e ? void 0 : e.length))
              )
                throw new Error("sw missing description of cache items");
            }

            async init() {
              for (const e of this.itemsOpt) {
                const { title: t, match: s } = e;
                let o = e.version.value;
                if (
                  !o &&
                  ((o = await self.env.database.getCacheVersionStore().get(t)),
                  !o)
                )
                  throw new Error(
                    `sw cache container can't get version for '${t}'`
                  );
                const i = r.CacheItem.of(t, o, { match: s });
                this.container.set(i.cacheName.value, i);
              }
            }

            items() {
              return Array.from(this.container.values()).sort(
                (e, t) => e.options.match.order - t.options.match.order
              );
            }

            item(e) {
              return (
                this.items().find((t) => t.match(e)) ||
                this.items[this.items.length - 1]
              );
            }

            isControl(e) {
              return !!this.items()
                .filter((e) => e.options.match.useInCacheControl)
                .find((t) => t.match(e));
            }

            size() {
              return this.container.size;
            }

            info() {
              return Promise.all(this.items().map((e) => e.info()));
            }
          };
        },
        310: (e, t, s) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.Cache = void 0);
          const r = s(935),
            o = s(144),
            i = s(787);
          t.Cache = class {
            constructor(e) {
              if (((this.options = e), (this.isReady = !1), !self.caches))
                throw new Error("This browser doesn't support Cache API");
            }

            async init() {
              var e;
              if (!this.options)
                return (this.isReady = !0), void self.logWarn("without cache");
              (this.isReady = !1),
                (this.container = new r.CacheContainer(this.options.items)),
                await this.container.init(),
                (this.precache = new i.Precache(this)),
                (this.cleaner = new o.CacheCleaner(this)),
                (this.isReady = !0);
              const t = this.items()
                .map((e) => e.cacheName.value)
                .sort((e, t) => e.localeCompare(t))
                .join(", ");
              self.log(
                `CACHE IS RUNNING [${
                  null ===
                    (e =
                      null === self || void 0 === self
                        ? void 0
                        : self.serviceWorker) || void 0 === e
                    ? void 0
                    : e.state
                }]: ${t}`
              );
            }

            get controlExtentions() {
              return this.options.controlExtentions || [];
            }

            isControl(e) {
              if (e.origin !== self.location.origin) return !1;
              const t = e.pathname;
              if (t.includes("sw.js")) return !1;
              if (
                t.includes("/static/") ||
                t.startsWith("/index.html") ||
                t.startsWith("/manifest.json") ||
                /\/apple.*\.png/.test(t) ||
                /\/favicon.*\.png/.test(t) ||
                /\/mstile.*\.png/.test(t) ||
                this.container.isControl(e)
              )
                return !0;
              const s = t.split(".").pop();
              return !!s && this.controlExtentions.includes(s);
            }

            get(e, t) {
              return this.item(t.url).getByStrategy(e, t);
            }

            clean(e) {
              return this.cleaner.clean(e);
            }

            item(e) {
              return this.container.item(e);
            }

            items() {
              return this.container.items();
            }

            info() {
              return this.container.info();
            }
          };
        },
        626: (e, t, s) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.CacheItem = void 0);
          const r = s(303),
            o = s(423),
            i = s(570);

          class a {
            constructor(e, t) {
              (this.cacheName = e), (this.options = t);
            }

            static of(e, t, s) {
              const r = new i.CacheName(e, t);
              return new a(r, s);
            }

            cache() {
              return self.caches.open(this.cacheName.value);
            }

            async put(e, t) {
              return (await this.cache()).put(t.req, e.clone());
            }

            async get(e) {
              return (await this.cache()).match(e.req);
            }

            getByStrategy(e, t) {
              switch (e) {
                case "cache || fetch -> cache":
                  return this.getByStrategy1(t);
                case "fetch -> cache || cache":
                  return this.getByStrategy2(t);
                case "fetch -> cache":
                  return this.getByStrategy3(t);
                default:
                  throw new Error(
                    `sw unknown strategy '${e}' of CacheItem.getByStrategy(…)`
                  );
              }
            }

            async getByStrategy1(e) {
              return (await this.get(e)) || this.fetchThenCache(e);
            }

            async getByStrategy2(e) {
              try {
                return await this.fetchThenCache(e);
              } catch (e) {}
              const t = await this.get(e);
              if (t) return t;
              throw new Error(
                `getByStrategy2 for '${o.Resource.path(
                  e.url
                )}', not found in the cache`
              );
            }

            getByStrategy3(e) {
              return this.fetchThenCache(e);
            }

            async fetchThenCache(e) {
              return (
                (e.init = a.requestInit(e.init)),
                self.env.resource
                  .fetchStrict(e)
                  .then(
                    async (t) => (
                      await this.put(t, e), this.log(o.Resource.path(e.url)), t
                    )
                  )
              );
            }

            async info() {
              return {
                cacheName: this.cacheName.info(),
                length: await this.length(),
              };
            }

            async length() {
              return (await this.cache().then((e) => e.keys())).length;
            }

            match(e) {
              const { pathStart: t, urlRegexp: s } = this.options.match;
              return t
                ? e.pathname.startsWith(t)
                : !!s && s.test(o.Resource.path(e));
            }

            log(...e) {
              self.log(`cache '${this.cacheName.value}'`, ...e);
            }

            logError(...e) {
              self.logError(`cache '${this.cacheName.value}'`, ...e);
            }

            static requestInit(e) {
              return void 0 === e
                ? r.noStoreRequestInit
                : { ...e, ...r.noStoreRequestInit };
            }
          }

          t.CacheItem = a;
        },
        570: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.CacheName = void 0);

          class s {
            constructor(e, t) {
              (this.title = e), (this.version = t), (this.value = s.get(e, t));
            }

            info() {
              return {
                scope: self.env.scope,
                title: this.title,
                version: this.version,
              };
            }

            static get(e, t) {
              const r = s.DELIMITER;
              return `${self.env.scope}${r}${e}${r}${t}`;
            }

            static isValid(e) {
              const t = s.parse(e);
              return s.isStructureValid(t);
            }

            static isStructureValid({
              scope: e,
              title: t,
              version: s,
              arr: r,
            }) {
              return 3 === r.length && !!e && !!t && !!s;
            }

            static parse(e) {
              const t = e.split(s.DELIMITER);
              return { scope: t[0], title: t[1], version: t[2], arr: t };
            }
          }

          (t.CacheName = s), (s.DELIMITER = ":");
        },
        787: (e, t, s) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.Precache = void 0);
          const r = s(423),
            o = s(626);
          t.Precache = class {
            constructor(e) {
              this.cache = e;
            }

            get options() {
              return this.cache.options;
            }

            async run({ strategy: e, paths: t, timeout: s, throwError: o }) {
              if (t.length) {
                self.log(`pre-cache [${t.length}] files by strategy '${e}'`);
                for (const i of t)
                  try {
                    await this.cache.get(e, r.Resource.fetchData(i, s));
                  } catch (e) {
                    const t = `can't pre-cache '${i}', ${e.message}`;
                    // if (o) throw new Error("sw " + t);
                    self.logError(t);
                  }
                self.log("pre-cache complete");
              }
            }

            async runForItem({
              item: e,
              strategy: t,
              paths: s,
              timeout: o,
              throwError: i,
            }) {
              if (s.length) {
                self.log(
                  `pre-cache ${e.cacheName.value}, [${s.length}] files by strategy '${t}'`
                );
                for (const a of s)
                  try {
                    await e.getByStrategy(t, r.Resource.fetchData(a, o));
                  } catch (e) {
                    const t = `can't pre-cache '${a}', ${e.message}`;
                    if (i) throw new Error("sw " + t);
                    self.logError(t);
                  }
                self.log("pre-cache complete");
              }
            }

            async runForItemPaths({
              strategy: e,
              title: t,
              version: s,
              timeout: r,
              throwError: i,
            }) {
              const a = this.options.items.find((e) => e.title === t),
                n = null == a ? void 0 : a.precachePaths;
              n &&
                0 !== n.length &&
                (await this.runForItem({
                  item: o.CacheItem.of(t, s, { match: a.match }),
                  strategy: e,
                  paths: n,
                  timeout: r,
                  throwError: i,
                }));
            }

            getItemsPrecachePaths() {
              return this.options.items
                .flatMap((e) => e.precachePaths || [])
                .sort((e, t) => e.localeCompare(t));
            }
          };
        },
        86: (e, t, s) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.DatabaseController = void 0);
          const r = s(680);
          t.DatabaseController = class {
            constructor(e, t) {
              var s;
              (this.database = e), (this.db = t);
              const o =
                null === (s = self.env.options.database) || void 0 === s
                  ? void 0
                  : s.storeNames;
              this.stores = new Map([
                [o.cacheVersion, new r.CacheVersionStore(o.cacheVersion, this)],
              ]);
            }

            getStore(e) {
              return this.stores.get(e);
            }

            getStores() {
              return Array.from(this.stores.values());
            }

            get(e, t) {
              return new Promise((s, r) => {
                const o = this.db
                  .transaction([e], "readonly")
                  .objectStore(e)
                  .get(t);
                (o.onerror = (s) => {
                  this.logError(
                    `error getting value from ${this.logPart(e, t)}`
                  ),
                    r(s);
                }),
                  (o.onsuccess = (r) => {
                    let i = o.result;
                    void 0 === i &&
                      this.logWarn(`value ${this.logPart(e, t)} is undefined`),
                      s(i);
                  });
              });
            }

            put(e, t, s) {
              return new Promise((r, o) => {
                const i = this.db
                  .transaction([e], "readwrite")
                  .objectStore(e)
                  .put(t, s);
                (i.onerror = (r) => {
                  self.logError(
                    `error putting value '${t}' to ${this.logPart(e, s)}`
                  ),
                    o(r);
                }),
                  (i.onsuccess = (e) => r(i.result));
              });
            }

            async restoreContent() {
              const e = this.getStores();
              for (const t of e) await t.restore();
            }

            logPart(e, t) {
              return this.database.logPart(e, t);
            }

            log(...e) {
              this.database.log(...e);
            }

            logWarn(...e) {
              this.database.logWarn(...e);
            }

            logError(...e) {
              this.database.logError(...e);
            }
          };
        },
        472: (e, t, s) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.Database = void 0);
          const r = s(86);
          t.Database = class {
            constructor(e) {
              if (((this.options = e), (this.isReady = !1), !self.indexedDB))
                throw new Error("This browser doesn't support IndexedDB");
            }

            async init() {
              if (!this.options)
                return (
                  (this.isReady = !0), void self.logWarn("without database")
                );
              (this.isReady = !1),
                (this.db = await this.open()),
                (this.controller = new r.DatabaseController(this, this.db)),
                await this.controller.restoreContent(),
                (this.isReady = !0),
                self.log(` - ${this.toString()} is opened`);
            }

            open() {
              this.close();
              const { name: e, version: t } = this.options;
              return new Promise((s, r) => {
                const o = self.indexedDB.open(e, t);
                (o.onerror = (s) => {
                  var o, i;
                  console.error(
                    `error opening database '${e}#${t}'.`,
                    null ===
                      (i =
                        null === (o = null == s ? void 0 : s.target) ||
                        void 0 === o
                          ? void 0
                          : o.error) || void 0 === i
                      ? void 0
                      : i.message
                  ),
                    r(s);
                }),
                  (o.onupgradeneeded = (e) => {
                    const t = o.result;
                    console.log(
                      `>>> ${t.name}#${t.version} upgrade >>>`,
                      `${e.oldVersion} -> ${e.newVersion}`
                    ),
                      Object.entries(this.options.storeNames).forEach(
                        ([e, s]) => {
                          if (!t.objectStoreNames.contains(s)) {
                            let r;
                            "cacheVersion" === e &&
                              (r = {
                                keyPath: null,
                                autoIncrement: !1,
                              }),
                              t.createObjectStore(s, r),
                              console.log(`  - create '${s}'`);
                          }
                        }
                      ),
                      e.newVersion,
                      console.log(">>> upgrade complete >>>");
                  }),
                  (o.onblocked = (e) => {
                    console.error(
                      "Database is blocked. Your database version can't be upgraded because the app is open somewhere else"
                    );
                  }),
                  (o.onsuccess = (e) => {
                    const t = o.result;
                    (t.onversionchange = (e) => {
                      t.close(),
                        console.log(
                          `close ${t.name}#${t.version} in 'db.onversionchange' handler, new version '${e.newVersion}' of this db is ready`
                        );
                    }),
                      s(t);
                  });
              });
            }

            close() {
              var e;
              null === (e = this.db) || void 0 === e || e.close(),
                (this.db = null);
            }

            getCacheVersionStore() {
              var e;
              return null === (e = this.controller) || void 0 === e
                ? void 0
                : e.getStore(this.options.storeNames.cacheVersion);
            }

            toString() {
              var e, t;
              return `${
                null === (e = this.db) || void 0 === e ? void 0 : e.name
              }#${null === (t = this.db) || void 0 === t ? void 0 : t.version}`;
            }

            logPart(e, t) {
              return `${e}.${t}`;
            }

            log(...e) {
              self.log(this.toString(), ...e);
            }

            logWarn(...e) {
              self.logWarn(this.toString(), ...e);
            }

            logError(...e) {
              self.logError(this.toString(), ...e);
            }
          };
        },
        680: (e, t, s) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.CacheVersionStore = void 0);
          const r = s(303),
            o = s(423);
          t.CacheVersionStore = class {
            constructor(e, t) {
              if (
                ((this.name = e),
                (this.dbController = t),
                (this.cacheOptions = self.env.options.cache),
                !this.cacheOptions)
              )
                throw new Error(`sw db store '${e}' can't find cache options`);
            }

            async get(e) {
              return this.action("get", e);
            }

            async put(e, t) {
              return this.action("put", t, e);
            }

            action(e, t, s) {
              if (!t) throw new Error(`sw invalid title '${t}'`);
              switch (e) {
                case "get":
                  return this.dbController.get(this.name, t);
                case "put":
                  if (!s)
                    throw new Error(
                      `sw invalid version '${s}' put to ${this.logPart(t)}'`
                    );
                  return this.dbController.put(this.name, s, t);
              }
            }

            controlledItems() {
              return this.cacheOptions.items.filter((e) => e.version.fetchPath);
            }

            async update() {
              this.log("updating records…");
              let e = 0;
              const t = this.controlledItems();
              for (const s of t) {
                const { title: t } = s,
                  r = await this.get(t),
                  o = await this.getVersionFromServer(s);
                r !== o && (await this.put(o, t), e++);
              }
              return this.log(`updated [${e}] records`), e;
            }

            async restore() {
              this.log("restoring records…");
              let e = 0;
              const t = this.controlledItems();
              for (const s of t) {
                const { title: t } = s;
                if (void 0 === (await this.get(t))) {
                  const r = await this.getVersionFromServer(s);
                  await this.put(r, t), e++;
                }
              }
              return this.log(`restored [${e}] records`), e;
            }

            async findChanges() {
              this.log("finding changes…");
              const e = [],
                t = this.controlledItems();
              for (const s of t) {
                const { title: t } = s,
                  r = await this.get(t),
                  o = await this.getVersionFromServer(s);
                r !== o && e.push({ key: t, value: r, sourceValue: o });
              }
              return this.log(`found [${e.length}] changes`), e;
            }

            async getVersionFromServer(e) {
              const t = e.version.fetchPath;
              this.log(`fetch '${e.title}' version from '${t}'`);
              // try {
              const e2 = o.Resource.fetchData(t, 1e4, r.noStoreRequestInit);
              const s = await self.env.resource.fetchStrict(e2);
              return (await s.text()).trim();
              // } catch (t) {
              //   this.logError(`for '${e.title}': ${t.message}`)
              // }
              // return "unknown"
            }

            logPart(e) {
              return this.dbController.logPart(this.name, e);
            }

            log(...e) {
              this.dbController.log(`store '${this.name}'`, ...e);
            }

            logError(...e) {
              this.dbController.logError(`store '${this.name}'`, ...e);
            }
          };
        },
        946: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.Exchange = void 0),
            (t.Exchange = class {
              async send(e, t, s) {
                if (s) s.postMessage({ type: e, data: t }, []);
                else {
                  const s = await self.clients.matchAll();
                  this.log(`send '${e}' to [${s.length}] clients…`),
                    s.forEach((s) => s.postMessage({ type: e, data: t }));
                }
              }

              async process(e) {
                const { data: t, source: s } = e;
                switch ((this.log(`process '${t.type}'`, new Date()), t.type)) {
                  case "GET_INFO":
                    this.send(
                      "INFO",
                      { caches: await self.env.cache.info() },
                      s
                    );
                    break;
                  case "UPDATE_CACHES":
                    self.env.updateCaches();
                    break;
                  default:
                    throw new Error(
                      `sw unknown message type '${t.type}' of Exchange.process(…)`
                    );
                }
              }

              log(...e) {
                self.log("exchange", ...e);
              }

              logError(...e) {
                self.logError("exchange", ...e);
              }
            });
        },
        210: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.Offline = void 0),
            (t.Offline = class {
              constructor() {
                this.isOffline = null;
              }

              get exchange() {
                return self.env.exchange;
              }

              setByData() {
                this.isOffline ||
                  this.byDataTimeoutId ||
                  (this.byDataTimeoutId = setTimeout(() => {
                    this.setOffline("byData");
                  }, 3e3));
              }

              setByNavigate() {
                this.setOffline("byNavigate");
              }

              stop() {
                this.isOffline && this.setOffline(null);
              }

              async responseForNavigate(e, t) {
                return new Response();
              }

              setOffline(e) {
                if (
                  (this.byDataTimeoutId &&
                    (clearTimeout(this.byDataTimeoutId),
                    (this.byDataTimeoutId = null)),
                  null === this.isOffline && null !== e)
                )
                  this.exchange.send("OFFLINE_START");
                else if (null !== this.isOffline && null === e)
                  switch ((this.exchange.send("OFFLINE_END"), this.isOffline)) {
                    case "byData":
                      break;
                    case "byNavigate":
                      this.exchange.send("RELOAD_PAGE");
                  }
                this.isOffline = e;
              }
            });
        },
        423: (e, t, s) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.Resource = void 0);
          const r = s(210);

          class o {
            constructor() {
              this.offline = new r.Offline();
            }

            fetch(e) {
              const { req: t, url: s, timeout: r, init: i } = e;
              return (r ? self.timeout(r, fetch(t, i)) : fetch(t, i))
                .then((r) =>
                  r.status >= 500 &&
                  r.status <= 599 &&
                  (self.logError(`fetch '${o.path(s)}', status: ${r.status}`),
                  o.isNavigate(t))
                    ? this.offlineByNavigate("5xx", e)
                    : (this.offline.stop(), r)
                )
                .catch((r) => {
                  if (
                    (self.logError(`fetch '${o.path(s)}': ${r.message}`),
                    o.isNavigate(t))
                  )
                    return this.offlineByNavigate("catchError", e);
                  throw (this.offline.setByData(), new Error(r.message));
                });
            }

            fetchStrict(e) {
              return this.fetch(e).then((t) => {
                if (t.ok) return t;
                throw new Error(
                  `fetch '${o.path(e.url)}', status: ${t.status}`
                );
              });
            }

            static fetchData(e, t, s) {
              return { req: e, url: o.url(e), timeout: t, init: s };
            }

            offlineByNavigate(e, t) {
              return (
                this.offline.setByNavigate(),
                this.offline.responseForNavigate(e, t)
              );
            }

            forBrowser(e) {
              const { strategy: t, data: s } = this.browserFetchData(e);
              return "fetch" === t ? this.fetch(s) : this.cache.get(t, s);
            }

            browserFetchData(e) {
              let t = "fetch",
                s = o.fetchData(e);
              const { url: r } = s;
              if (
                "navigate" === e.mode ||
                this.isNavigationToDetachedIndexHtml(r) ||
                this.isNavigationToSlideIndexHtml(r)
              ) {
                const e = this.checkIfNavigationToIndexHtml(r);
                e
                  ? ((s = o.fetchData(e)), (t = "fetch -> cache || cache"))
                  : (t = "fetch");
              } else
                "GET" === e.method &&
                  this.cache.isControl(r) &&
                  (t = "cache || fetch -> cache");
              return { strategy: t, data: s };
            }

            get cache() {
              return self.env.cache;
            }

            static normalizeRequest(e) {
              return "string" != typeof e ||
                e.includes("http:") ||
                e.includes("https:")
                ? e
                : ((e = "/" === e[0] ? e : `/${e}`), self.location.origin + e);
            }

            static url(e) {
              const t =
                "string" == typeof (e = o.normalizeRequest(e)) ? e : e.url;
              return new URL(t);
            }

            static requestModeLog(e) {
              return "string" == typeof e ? "" : ` mode '${e.mode}'`;
            }

            checkIfNavigationToIndexHtml(e) {
              return this.isNavigationToDetachedIndexHtml(e)
                ? "/detached/index.html"
                : this.isNavigationToSlideIndexHtml(e)
                ? "/slide/index.html"
                : /^\/[\w\d\-_=]*$/.test(e.pathname)
                ? "/index.html"
                : void 0;
            }

            isNavigationToDetachedIndexHtml(e) {
              return (
                e.pathname.startsWith("/detached/") &&
                !1 === /^\/detached\/(.*)\.js$/.test(e.pathname)
              );
            }

            isNavigationToSlideIndexHtml(e) {
              return (
                e.pathname.startsWith("/slide/") &&
                !1 === /^\/slide\/(.*)\.js$/.test(e.pathname)
              );
            }
          }

          (t.Resource = o),
            (o.path = (e) => `${e.pathname}${e.search}${e.hash}`),
            (o.isNavigate = (e) =>
              e instanceof Request && "navigate" === e.mode);
        },
        922: (e, t, s) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.SwEnv = void 0);
          const r = s(472),
            o = s(946),
            i = s(423),
            a = s(310);
          t.SwEnv = class {
            constructor(e, t) {
              if (
                ((this.scope = e),
                (this.options = t),
                (this.isUpdatingCaches = !1),
                !e)
              )
                throw new Error("sw scope can't be empty");
              (this.database = new r.Database(t.database)),
                (this.cache = new a.Cache(t.cache)),
                (this.exchange = new o.Exchange()),
                (this.resource = new i.Resource());
            }

            async init() {
              var e, t;
              self.log(
                `INITIALIZATION…  [${
                  null ===
                    (e =
                      null === self || void 0 === self
                        ? void 0
                        : self.serviceWorker) || void 0 === e
                    ? void 0
                    : e.state
                }]`,
                new Date()
              ),
                await this.database.init(),
                await this.cache.init(),
                self.log(
                  `INITIALIZATION complete  [${
                    null ===
                      (t =
                        null === self || void 0 === self
                          ? void 0
                          : self.serviceWorker) || void 0 === t
                      ? void 0
                      : t.state
                  }]`
                );
            }

            get isReady() {
              return this.database.isReady && this.cache.isReady;
            }

            waitForReady() {
              return self.waitFor(
                () => this.isReady,
                1,
                "initialization timeout"
              );
            }

            get(e) {
              return this.resource.forBrowser(e);
            }

            async correctCacheVersions() {
              var e;
              const t = this.database.getCacheVersionStore();
              let s = (await t.update()) > 0;
              if (!s)
                for (const { cacheName: r } of this.cache.items()) {
                  const o = await t.get(r.title);
                  if (o !== r.version) {
                    (s = !0),
                      self.logWarn(
                        `cache "${r.title}" in memory version "${
                          r.version
                        }" differs from storage version "${o}". On [${
                          null ===
                            (e =
                              null === self || void 0 === self
                                ? void 0
                                : self.serviceWorker) || void 0 === e
                            ? void 0
                            : e.state
                        }] sw. Go to re-init cache…`
                      );
                    break;
                  }
                }
              s && (await this.cache.init());
            }

            async updateCaches() {
              if (!this.isUpdatingCaches) {
                this.isUpdatingCaches = !0;
                try {
                  const e = this.database.getCacheVersionStore(),
                    t = await e.findChanges();
                  if (0 === t.length) return;
                  self.log("updating caches…");
                  for (const e of t)
                    await this.cache.precache.runForItemPaths({
                      strategy: "fetch -> cache",
                      title: e.key,
                      version: e.sourceValue,
                      timeout: 1e4,
                      throwError: !1,
                    });
                  await this.correctCacheVersions();
                  try {
                    await this.cache.clean("delete-uncontrolled");
                  } catch (e) {
                    self.logError(e.message);
                  }
                  self.log("updating caches complete"),
                    this.exchange.send("RELOAD_PAGE");
                } catch (e) {
                  self.logError(`updating caches: ${e.message || ""}`);
                } finally {
                  this.isUpdatingCaches = !1;
                }
              }
            }
          };
        },
        303: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.noStoreRequestInit = void 0),
            (t.noStoreRequestInit = { cache: "no-store" });
        },
      },
      t = {};

    function s(r) {
      var o = t[r];
      if (void 0 !== o) return o.exports;
      var i = (t[r] = { exports: {} });
      return e[r](i, i.exports, s), i.exports;
    }

    var r = {};
    return (
      (() => {
        var e = r;
        Object.defineProperty(e, "__esModule", { value: !0 });
        const t = s(922);
        (self.SwEnv = t.SwEnv),
          (self.log = (...e) => {
            self.isDebug && console.log("sw", ...e);
          }),
          (self.logWarn = (...e) => {
            console.warn("sw", ...e);
          }),
          (self.logError = (...e) => {
            console.error("sw", ...e);
          }),
          (self.delay = (e) => new Promise((t) => setTimeout(t, e))),
          (self.timeout = (e, t) =>
            new Promise((s, r) => {
              const o = setTimeout(() => {
                r(new Error("TIMEOUT"));
              }, e);
              t.then((e) => {
                clearTimeout(o), s(e);
              }).catch((e) => {
                clearTimeout(o), r(e);
              });
            })),
          (self.waitFor = (e, t, s) =>
            new Promise(async (r, o) => {
              e() && r();
              for (let s = 0; s < 12 * t && (await self.delay(5e3), !e()); s++);
              e() ? r() : (s && self.logError(s), o());
            }));
      })(),
      r
    );
  })();
});
