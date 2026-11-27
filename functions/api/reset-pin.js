// Admin only: give a seller who signed up with phone + PIN a new 6-digit PIN.
// Needs the Cloudflare Pages secret SUPABASE_SERVICE_ROLE_KEY (Supabase → Project settings → API → service_role).
const SB = "https://rcioefzhysholnfogljy.supabase.co";
const KEY = "sb_publishable_ziTls2YuI4JKUqno8BQyQg_-We_mL49";
const json = (o, s) => new Response(JSON.stringify(o), { status: s || 200, headers: { "content-type": "application/json" } });

export async function onRequestPost({ request, env }) {
  try {
    const svc = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!svc) return json({ error: "setup" }, 503);
    const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "auth" }, 401);
    // who is calling? must be an admin
    const me = await fetch(`${SB}/auth/v1/user`, { headers: { apikey: KEY, Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null);
    if (!me || !me.id) return json({ error: "auth" }, 401);
    const prof = await fetch(`${SB}/rest/v1/profiles?id=eq.${me.id}&select=role`, { headers: { apikey: KEY, Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []);
    if (!prof[0] || prof[0].role !== "admin") return json({ error: "forbidden" }, 403);
    const body = await request.json().catch(() => ({}));
    const userId = String(body.user_id || ""), pin = String(body.pin || "");
    if (!/^[0-9a-f-]{36}$/i.test(userId) || !/^\d{6}$/.test(pin)) return json({ error: "input" }, 400);
    // only phone + PIN accounts can be reset this way
    const u = await fetch(`${SB}/auth/v1/admin/users/${userId}`, { headers: { apikey: svc, Authorization: `Bearer ${svc}` } }).then(r => r.ok ? r.json() : null);
    if (!u || !/@phone\.almanarahglobalservices\.com$/.test(u.email || "")) return json({ error: "not_phone" }, 400);
    const r = await fetch(`${SB}/auth/v1/admin/users/${userId}`, { method: "PUT", headers: { apikey: svc, Authorization: `Bearer ${svc}`, "content-type": "application/json" }, body: JSON.stringify({ password: "AMG-" + pin + "-pin" }) });
    if (!r.ok) return json({ error: "update" }, 500);
    return json({ ok: true });
  } catch (e) {
    return json({ error: "server" }, 500);
  }
}
