// Short store links: almanarahglobalservices.com/<store-name>
// Serves the store page and fills the link preview (WhatsApp, Facebook) with the store's own name and logo.
const SB = "https://rcioefzhysholnfogljy.supabase.co";
const KEY = "sb_publishable_ziTls2YuI4JKUqno8BQyQg_-We_mL49"; // public key (safe), data protected by Row Level Security
const SLUG = /^[a-z0-9][a-z0-9-]{2,40}$/;

function esc(s) { return String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

export async function storePage(ctx, slug) {
  const url = new URL(ctx.request.url);
  const page = await ctx.env.ASSETS.fetch(new URL("/store", url.origin));
  let store = null;
  try {
    const r = await fetch(`${SB}/rest/v1/stores?slug=eq.${slug}&status=eq.approved&select=name,description,logo_url,cover_url,city`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    if (r.ok) store = (await r.json())[0] || null;
  } catch (e) {}
  const headers = new Headers(page.headers);
  headers.set("Cache-Control", "public, max-age=300");
  const resp = new Response(page.body, { status: 200, headers });
  if (!store) return resp;
  const title = `${store.name} | AL MANARAH`;
  const desc = (store.description || `${store.name}${store.city ? " — " + store.city : ""}`).slice(0, 180);
  const img = store.logo_url || store.cover_url || `${url.origin}/og-market.jpg`;
  const link = `${url.origin}/${slug}`;
  const setContent = v => ({ element(el) { el.setAttribute("content", v); } });
  return new HTMLRewriter()
    .on("title", { element(el) { el.setInnerContent(title); } })
    .on('meta[name="description"]', setContent(desc))
    .on('meta[property="og:title"]', setContent(title))
    .on('meta[property="og:description"]', setContent(desc))
    .on('meta[property="og:image"]', setContent(img))
    .on('meta[property="og:image:alt"]', setContent(store.name))
    .on('meta[property="og:url"]', setContent(link))
    .on('link[rel="canonical"]', { element(el) { el.setAttribute("href", link); } })
    .transform(resp);
}
export { SLUG };
