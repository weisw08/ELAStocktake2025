// 每次你修改了 index.html，请把这里的版本号 +1 (例如 v6 改为 v7)
const CACHE_NAME = 'energetic-stocktake-v5';

// 需要缓存的资源列表
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js'
];

// 1. 安装阶段：下载并保存资源
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 【关键】强制让新版 Service Worker 立即生效，不用等旧页面关闭
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 激活阶段：清理旧版本的缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // 【关键】让新版立即控制所有打开的标签页
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// 3. 拦截请求：优先从缓存读取，实现离线使用
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果命中缓存则返回，否则发起网络请求
        return response || fetch(event.request);
      })
  );
});


