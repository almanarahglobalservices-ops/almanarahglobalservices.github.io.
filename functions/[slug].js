import { storePage, SLUG } from "../lib/storepage.js";
// Existing pages and files are served normally; only unknown single names become store pages.
export async function onRequestGet(ctx) {
  const res = await ctx.next();
  if (res.status !== 404) return res;
  const slug = String(ctx.params.slug || "").toLowerCase();
  if (!SLUG.test(slug)) return res;
  return storePage(ctx, slug);
}
