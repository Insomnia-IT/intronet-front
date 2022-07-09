self.isDebug = true;
importScripts("./sw/module.sw.js");
fetch("/asset-manifest.json")
  .then((x) => x.json())
  .then((assets) => {
    const reactFiles = Object.values(assets.files).filter(
      (x) => !x.endsWith(".map")
    );
    self.env.options.cache.items[0].precachePaths.push(...reactFiles);
    self.env.init();
  });
self.env = new SwEnv("/", {
  database: {
    name: "db_local",
    version: 1,
    storeNames: {
      cacheVersion: "cache_version",
    },
  },
  cache: {
    controlExtentions: [
      "js",
      "css",
      "woff2",
      "ttf",
      "png",
      "webp",
      "jpg",
      "json",
      "otf",
      "eot",
      "ico",
    ],
    items: [
      {
        title: "root",
        version: {
          fetchPath: "/root.version", // !!!ВНИМАНИЕ!!! По этому path делается wake up. При изменении не забудь актуализировать path в sw[main] части кода.
        },
        match: {
          order: 100, // все подконтрольные файлы, что не попадают в свои кеши(фильтр по pathStart), попадают в кеш 'root'
          pathStart: "/",
          useInCacheControl: false,
        },
        precachePaths: [
          "/",
          "/index.html",
          "/sw/index.js",
          "/icons/96x96.png",
          "/icons/32x32.png",
          "/icons/192x192.png",
          "/fonts/fonts.css",
          "/manifest.json",
          "/pdf.min.js",
          "/pdf.worker.js",
          "/images/map2.webp",
          "/images/schema.jpg",
          "/images/insomnia_intro_1.webp",
          "/images/insomnia_intro_2.webp",
          "/images/insomnia_intro_3.webp",
          "/images/insomnia_intro_4.webp",
          "/images/insomnia_intro_5.webp",
          "/fonts/Open-Sans_Regular.woff2",
          // '/static/js/bundle.js',
          // '/fonts/PT_Root_UI/light/PT_Root_UI_Light.woff2',
          // '/fonts/PT_Root_UI/medium/PT_Root_UI_Medium.woff2',
          // '/fonts/PT_Root_UI/regular/PT_Root_UI_Regular.css',
          // '/fonts/PT_Root_UI/regular/PT_Root_UI_Regular.eot',
          // '/fonts/PT_Root_UI/regular/PT_Root_UI_Regular.woff2',
          // '/fonts/PT_Root_UI/regular/PT_Root_UI_Regular.woff',
          // '/fonts/PT_Root_UI/bold/PT_Root_UI_Bold.woff2',
        ],
      },
      {
        title: "login",
        version: {
          fetchPath: "/root.version", // !!!ВНИМАНИЕ!!! По этому path делается wake up. При изменении не забудь актуализировать path в sw[main] части кода.
        },
        match: {
          order: 90, // все подконтрольные файлы, что не попадают в свои кеши(фильтр по pathStart), попадают в кеш 'root'
          pathStart: "/login",
          useInCacheControl: false,
        },
        precachePaths: [
          "/login/index.html",
          "/login/index.js",
          "/login/layout.css",
          "/login/custom.css",
          "/login/adaptive.css",
          "/login/colors.css",
          "/login/distance.css",
        ],
      },
    ],
  },
});

self.addEventListener("install", (event) => {
  self.skipWaiting(); // выполнить принудительную активацию новой версии sw - без информирования пользователя и без ожидания его реакции на это событие
  event.waitUntil(
    self.env
      .waitForReady() // ожидание инициализации ТЕКУЩЕЙ(ранее установленной) версии sw, либо первичной инициализации sw (перед первой установкой)
      .then(() =>
        self.log(`INSTALLING…  [${self?.serviceWorker?.state}], ${new Date()}`)
      ) // начинается установка НОВОЙ версии sw
      .then(() => self.env.correctCacheVersions())
      .then(() =>
        self.env.cache.precache.run({
          strategy: "fetch -> cache",
          paths: [...self.env.cache.precache.getItemsPrecachePaths()],
          timeout: 10_000,
          throwError: true,
        })
      )
      .then(() => self.log("INSTALLED"))
  );
});

self.addEventListener("activate", (event) => {
  self.log(`ACTIVATING…  [${self?.serviceWorker?.state}], ${new Date()}`);
  event.waitUntil(
    self.clients
      .claim() // переключить всех потенциальных клиентов на новый sw
      .then(() => self.env.cache.clean("delete-uncontrolled")) // клиенты уже смотрят на новый sw, значит можно почистить кеш
      .finally(() => {
        self.env.exchange.send("RELOAD_PAGE"); // важно для кеширующего sw, т.к. рефреш страницы гарантирует, что новая версия приложения запустилась на клиентах
        self.log("ACTIVATED");
      })
  );
});

self.addEventListener("fetch", async (event) => {
  if (self.env.isReady) event.respondWith(self.env.get(event.request));
});

self.addEventListener("message", (event) => {
  if (self.env.isReady) self.env.exchange.process(event);
});
