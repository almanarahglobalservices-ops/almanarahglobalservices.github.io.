// Fallback for store links when served without Cloudflare functions, or when copied with extra characters.
(function () {
  var p = location.pathname;
  try { p = decodeURIComponent(p); } catch (e) {}
  var m = p.toLowerCase().match(/^\/(?:store\/)?([^\/]+)\/?$/);
  if (!m) return;
  var s = m[1].replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "").replace(/[^a-z0-9-]/g, "");
  if (/^[a-z0-9][a-z0-9-]{2,40}$/.test(s) && s !== "store") location.replace("/store.html?s=" + s);
})();
