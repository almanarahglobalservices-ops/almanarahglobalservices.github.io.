// Product pages: /product?id=<id>
// Gives each product its own address for Google (canonical) and its own link preview (WhatsApp, Facebook):
// product name, description and photo. If anything fails, the normal page is served unchanged.
const SB = "https://rcioefzhysholnfogljy.supabase.co";
const KEY = "sb_publishable_ziTls2YuI4JKUqno8BQyQg_-We_mL49"; // public key (safe), data protected by Row Level Security
const ID = /^[0-9a-z-]{1,40}$/i;

export async function onRequestGet(ctx) {
  const res = await ctx.next();
  try {
    const url = new URL(ctx.request.url);
    const id = (url.searchParams.get("id") || "").trim();
    if (!ID.test(id) || res.status !== 200) return res;
    const link = `${url.origin}/product?id=${id}`;
    let p = null;
    try {
      const r = await fetch(`${SB}/rest/v1/products?id=eq.${id}&status=eq.approved&select=title,description,images,stores(name,city)`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
      if (r.ok) p = (await r.json())[0] || null;
    } catch (e) {}
    const setContent = v => ({ element(el) { el.setAttribute("content", v); } });
    let rw = new HTMLRewriter()
      .on('link[rel="canonical"]', { element(el) { el.setAttribute("href", link); } })
      .on('meta[property="og:url"]', setContent(link));
    if (p) {
      const s = p.stores || {};
      const title = `${p.title}${s.name ? " — " + s.name : ""} | AL MANARAH`;
      const desc = String(p.description || `${p.title}${s.city ? " — " + s.city : ""}`).replace(/\s+/g, " ").slice(0, 180);
      const img = (p.images || [])[0] || `${url.origin}/og-market.jpg`;
      rw = rw
        .on("title", { element(el) { el.setInnerContent(title); } })
        .on('meta[name="description"]', setContent(desc))
        .on('meta[property="og:title"]', setContent(title))
        .on('meta[property="og:description"]', setContent(desc))
        .on('meta[property="og:image"]', setContent(img))
        .on('meta[property="og:image:alt"]', setContent(p.title));
    }
    const headers = new Headers(res.headers);
    headers.set("Cache-Control", "public, max-age=300");
    return rw.transform(new Response(res.body, { status: 200, headers }));
  } catch (e) {
    return res;
  }
}
