import { storePage, SLUG } from "../lib/storepage.js";
// Existing pages and files are served normally; unknown single names become store pages.
// Links copied with extra characters (e.g. "name.", "name*", "Name)") are cleaned and redirected.
export async function onRequestGet(ctx) {
  const res = await ctx.next();
  if (res.status !== 404) return res;
  let raw = String(ctx.params.slug || "");
  try { raw = decodeURIComponent(raw); } catch (e) {}
  const slug = raw.toLowerCase();
  // short entry to the seller dashboard
  if (slug === "ma-boutique" || slug === "mon-espace" || slug === "my-store") return Response.redirect(new URL("/sell.html#prod", ctx.request.url).toString(), 302);
  if (SLUG.test(slug)) return storePage(ctx, slug);
  const clean = slug.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "").replace(/[^a-z0-9-]/g, "");
  if (SLUG.test(clean)) return Response.redirect(new URL("/" + clean, ctx.request.url).toString(), 301);
  return res;
}
