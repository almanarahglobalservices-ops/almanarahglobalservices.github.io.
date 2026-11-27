/* AL MANARAH — app service worker.
   Pages: always fresh from the internet (saved copy only when offline).
   Versioned files (?v=…), icons and images: kept on the phone so the app opens fast.
   Supabase, payments, admin and other sites: never touched. */
var VER = "am-app-3";
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
    /* fresh page from the internet; if the connection is very slow (over 3 s), show the saved copy */
    var net = fetch(req).then(function (res) { return put(req, res); });
    e.respondWith(new Promise(function (resolve) {
      var done = false;
      function fallback() {
        caches.match(req).then(function (m) {
          if (done) return;
          if (m) { done = true; resolve(m); }
        });
      }
      var t = setTimeout(fallback, 3000);
      net.then(function (res) { if (!done) { done = true; clearTimeout(t); resolve(res); } })
        .catch(function () {
          clearTimeout(t);
          caches.match(req).then(function (m) { if (!done) { done = true; resolve(m || caches.match("/offline.html")); } });
        });
    }));
    e.waitUntil(net.catch(function () {}));
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
