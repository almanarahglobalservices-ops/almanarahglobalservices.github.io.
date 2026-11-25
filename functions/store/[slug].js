import { storePage, SLUG } from "../../lib/storepage.js";
// Old long links /store/<name> keep working and redirect to the short link.
export async function onRequestGet(ctx) {
  const slug = String(ctx.params.slug || "").toLowerCase();
  if (!SLUG.test(slug)) return ctx.next();
  return Response.redirect(new URL("/" + slug, ctx.request.url).toString(), 301);
}
