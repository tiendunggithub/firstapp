const nvtdung = 'nvt_dung'
const assets = [
    "/",
    "home.html",
    "./css/style.css",
    "./js/app.js",
    "./images/sniper.jpg"
]

self.addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(nvtdung).then(cache => {
            cache.addAll(assets)
        })
    )
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request);
        })
    );
});