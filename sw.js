const CACHE_NAME = 'focus-v2';
// 监听安装事件，缓存基础资源
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(['/', '/index.html']); 
        })
    );
});

// 动态拦截：Stale-While-Revalidate 策略
// 即使是 /src/ 下的文件也会被自动缓存
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            const fetchPromise = fetch(e.request).then(networkResponse => {
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(e.request, networkResponse.clone());
                });
                return networkResponse;
            });
            return cachedResponse || fetchPromise;
        })
    );
});