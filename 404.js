// Fallback for short store links when the page is served without Cloudflare functions (e.g. old DNS cache).
(function () {
  var m = location.pathname.match(/^\/(?:store\/)?([a-z0-9][a-z0-9-]{2,40})\/?$/i);
  if (m && m[1].toLowerCase() !== "store") location.replace("/store.html?s=" + m[1].toLowerCase());
})();
