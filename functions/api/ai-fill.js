// AI product filling for merchants: photo + a few words -> title, description, category, condition.
// Needs a secret named GEMINI_API_KEY in Cloudflare Pages > Settings > Variables and Secrets.
// Optional: GEMINI_MODEL (default "gemini-2.5-flash").
// Only signed-in users can call it; images are accepted only from our own Supabase storage.

const SB_URL = "https://rcioefzhysholnfogljy.supabase.co";
const SB_KEY = "sb_publishable_ziTls2YuI4JKUqno8BQyQg_-We_mL49";
const IMG_PREFIX = SB_URL + "/storage/v1/object/public/market/";

function json(o, status) {
  return new Response(JSON.stringify(o), { status: status || 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}

function b64(buf) {
  const bytes = new Uint8Array(buf); let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

export async function onRequestPost({ request, env }) {
  const key = env.GEMINI_API_KEY;
  if (!key) return json({ error: "AI_OFF" }, 503);

  // 1. signed-in merchants only
  const auth = request.headers.get("authorization") || "";
  if (!/^Bearer\s+\S+/.test(auth)) return json({ error: "AUTH" }, 401);
  const who = await fetch(SB_URL + "/auth/v1/user", { headers: { apikey: SB_KEY, authorization: auth } });
  if (!who.ok) return json({ error: "AUTH" }, 401);

  // 2. input
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "BAD" }, 400); }
  const hint = String(body.hint || "").slice(0, 200);
  const image = String(body.image || "");
  const lang = ["en", "fr", "ar"].includes(body.lang) ? body.lang : "fr";
  const cats = Array.isArray(body.cats) ? body.cats.slice(0, 40).map((c) => ({ slug: String(c.slug || "").slice(0, 40), name: String(c.name || "").slice(0, 80) })) : [];
  if (!hint && !image) return json({ error: "EMPTY" }, 400);

  const parts = [];
  if (image) {
    if (!image.startsWith(IMG_PREFIX)) return json({ error: "IMG" }, 400);
    const ir = await fetch(image);
    if (!ir.ok) return json({ error: "IMG" }, 400);
    const buf = await ir.arrayBuffer();
    if (buf.byteLength > 4 * 1024 * 1024) return json({ error: "IMG" }, 400);
    const mime = (ir.headers.get("content-type") || "image/jpeg").split(";")[0];
    parts.push({ inline_data: { mime_type: mime, data: b64(buf) } });
  }

  const language = lang === "en" ? "simple English" : lang === "ar" ? "simple Arabic" : "simple, easy French (as spoken in Côte d'Ivoire)";
  const prompt =
`You help small shop owners in Côte d'Ivoire and Nigeria list ONE product on an online marketplace.
Look at the photo (if any) and the seller's words: "${hint.replace(/"/g, "'")}".
Write in ${language}. Return JSON only:
{"title": "...", "description": "...", "category": "...", "condition": "new|used|refurbished"}
Rules:
- title: max 70 characters, precise (product type, brand, model, colour, size if visible). No prices, no emojis, no shouting capitals.
- description: 2 to 4 short sentences a buyer will understand. Describe only what is visible or stated by the seller. Never invent technical specs, warranties, prices or quantities.
- Health products (supplements, herbs, honey, oils): never claim the product cures, treats or prevents any illness. Describe ingredients/use only.
- category: exactly one slug from this list: ${JSON.stringify(cats)}
- condition: "new" unless the photo or words clearly show used or refurbished.`;
  parts.push({ text: prompt });

  const model = env.GEMINI_MODEL || "gemini-2.5-flash";
  const gr = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + encodeURIComponent(key), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature: 0.3, responseMimeType: "application/json" } })
  });
  if (!gr.ok) return json({ error: "AI_" + gr.status }, 502);
  const gj = await gr.json().catch(() => ({}));
  const txt = (((gj.candidates || [])[0] || {}).content || {}).parts?.map((p) => p.text || "").join("") || "";
  let out;
  try { out = JSON.parse(txt.replace(/^```(json)?|```$/g, "").trim()); } catch (e) { return json({ error: "AI_PARSE" }, 502); }
  return json({
    title: String(out.title || "").slice(0, 120),
    description: String(out.description || "").slice(0, 1500),
    category: cats.some((c) => c.slug === out.category) ? out.category : "",
    condition: ["new", "used", "refurbished"].includes(out.condition) ? out.condition : "new"
  });
}

// Diagnostic (temporary): GET /api/ai-fill?check=1 tells whether the AI service answers. No secret is shown.
export async function onRequestGet({ request, env }) {
  if (new URL(request.url).searchParams.get("check") !== "1") return json({ error: "NO" }, 404);
  const key = env.GEMINI_API_KEY;
  if (!key) return json({ key: false });
  const model = env.GEMINI_MODEL || "gemini-2.5-flash";
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + encodeURIComponent(key), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Reply with the word OK" }] }] }) });
  const txt = await r.text();
  return json({ key: true, keyLength: key.length, model, status: r.status, body: txt.slice(0, 600) });
}
