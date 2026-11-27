/* AL MANARAH — app service worker.
   Pages: always fresh from the internet (saved copy only when offline).
   Versioned files (?v=…), icons and images: kept on the phone so the app opens fast.
   Supabase, payments, admin and other sites: never touched. */
var VER = "am-app-1";
var CORE = ["/offline.html", "/logo.png", "/img/app/icon-192.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VER).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VER; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function put(req, res) {
  if (res && res.ok && res.type === "basic") { var copy = res.clone(); caches.open(VER).then(function (c) { c.put(req, copy); }); }
  return res;
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;              // Supabase, fonts, chat…: browser handles it
  if (/^\/(api|functions)\//.test(url.pathname)) return;
  if (/admin|manage/.test(url.pathname)) return;                // private pages: never stored
  if (url.pathname === "/sw.js") return;

  // Pages: network first, offline copy as fallback
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(function (res) { return put(req, res); }).catch(function () {
      return caches.match(req).then(function (m) { return m || caches.match("/offline.html"); });
    }));
    return;
  }

  // Scripts/styles without a version number: network first (never stale)
  if (/\.(js|css)$/.test(url.pathname) && !/[?&]v=/.test(url.search)) {
    e.respondWith(fetch(req).then(function (res) { return put(req, res); }).catch(function () { return caches.match(req); }));
    return;
  }

  // Versioned scripts/styles and images: phone copy first, refresh in background
  if (/\.(js|css|png|jpg|jpeg|webp|svg|woff2?)$/.test(url.pathname)) {
    e.respondWith(caches.match(req).then(function (m) {
      var net = fetch(req).then(function (res) { return put(req, res); }).catch(function () { return m; });
      return m || net;
    }));
  }
});
