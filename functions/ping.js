// Diagnostic: shows which server answered (Cloudflare = new site).
export function onRequestGet(ctx) {
  const c = ctx.request.cf || {};
  return new Response("OK - Cloudflare (new site) - " + (c.colo || "") + " " + (c.country || ""), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
