const cacheName = 'nvt_dung'
var dynamicCacheName = "dynamic-cache"
const assets = [
    "/",
    "/index.html",
    "/admin.html",
    "/css/style.css",
    "/js/app.js",
    "/images/sniper.jpg"
]

self.addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll(assets)
        })
    )
});

self.addEventListener('activate', activateEvent => {
    activateEvent.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                    .filter(key => key !== cacheName)
                    .map(key => caches.delete())
                    )
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    // console.log(fetchEvent)

    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    );
});