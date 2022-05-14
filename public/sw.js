self.isDebug = true;
importScripts('./sw/module.sw.js');

const env = new SwEnv('/', {
  database: {
    name: 'db_local',
    version: 1,
    storeNames: {
      cacheVersion: 'cache_version',
    }
  },
  cache: {
    controlExtentions: ['js', 'css', 'woff2', 'ttf', 'otf', 'eot', 'ico'],
    items: [
      {
        title: 'root',
        version: {
          fetchPath: '/root.version' // !!!ВНИМАНИЕ!!! По этому path делается wake up. При изменении не забудь актуализировать path в sw[main] части кода.
        },
        match: {
          order: 100, // все подконтрольные файлы, что не попадают в свои кеши(фильтр по pathStart), попадают в кеш 'root'
          pathStart: '/',
          useInCacheControl: false
        },
        precachePaths: [
          '/',
          '/sw/index.js',
          '/icons/favicon-96x96.png',
          '/manifest.json',
          '/pdf.min.js',
          '/pdf.worker.js',
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
    ],
  }
});
self.env = env;
env.init();

self.addEventListener('install', event => {
  self.skipWaiting(); // выполнить принудительную активацию новой версии sw - без информирования пользователя и без ожидания его реакции на это событие
  event.waitUntil(
    env.waitForReady() // ожидание инициализации ТЕКУЩЕЙ(ранее установленной) версии sw, либо первичной инициализации sw (перед первой установкой)
      .then(() => self.log(`INSTALLING…  [${self?.serviceWorker?.state}], ${new Date()}`)) // начинается установка НОВОЙ версии sw
      .then(() => env.correctCacheVersions())
      .then(() => env.cache.precache.run({
        strategy: 'fetch -> cache',
        paths: [...env.cache.precache.getItemsPrecachePaths()],
        timeout: 10_000,
        throwError: true,
      }))
      .then(() => self.log('INSTALLED'))
  );
});

self.addEventListener('activate', event => {
  self.log(`ACTIVATING…  [${self?.serviceWorker?.state}], ${new Date()}`);
  event.waitUntil(
    self.clients.claim() // переключить всех потенциальных клиентов на новый sw
      .then(() => env.cache.clean('delete-uncontrolled')) // клиенты уже смотрят на новый sw, значит можно почистить кеш
      .finally(() => {
        env.exchange.send('RELOAD_PAGE'); // важно для кеширующего sw, т.к. рефреш страницы гарантирует, что новая версия приложения запустилась на клиентах
        self.log('ACTIVATED');
      })
  );
});

self.addEventListener('fetch', async event => {
  if (env.isReady)
    event.respondWith(env.get(event.request));
});

self.addEventListener('message', event => {
  if (env.isReady)
    env.exchange.process(event);
});
