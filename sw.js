const CACHE="hunters-feast-r7-v1";
const FILES=["./","./index.html","./manifest.json",
"./css/reset.css","./css/variables.css","./css/gothic.css","./css/layout.css","./css/animations.css",
"./js/app.js","./js/ui.js","./js/wheel.js","./js/storage.js","./js/sound.js","./js/maps.js","./js/particles.js",
"./data/foods.json","./assets/icons/icon-192.png","./assets/icons/icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(c=>c||caches.match("./index.html"))))});
