const cacheName = 'nvt_dung'
var dynamicCacheName = "dynamic-cache"
const assets = [
    "/",
    "/index.html",
    "/admin.html",
    "/css/style.css",
    "/css/home.css",
    "/js/app.js",
    "/js/home.js",
    "/images/sniper.jpg",
    "/images/prod/prod-bac-xiu-1.jpg",
    "/images/prod/prod-bac-xiu-2.jpg",
    "/images/prod/prod-bac-xiu.jpg",
    "/images/prod/prod-coffee-1.jpg",
    "/images/prod/prod-den-sg.jpg",
    "/images/prod/prod-sua-sg.jpg",
    "/images/prod/prod-sua.jpg",
    "/images/icon/cart-plus.svg"
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