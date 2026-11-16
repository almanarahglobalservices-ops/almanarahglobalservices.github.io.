/* AL MANARAH — private dashboard (admin.html). Talks only to the CRM (Google Apps Script). */
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG || {}, API = CFG.formEndpoint, $ = function (s, r) { return (r || document).querySelector(s); };
  var D = null, TAB = "check", Q = "";
  function tok() { try { return sessionStorage.getItem("amgTok") || ""; } catch (e) { return ""; } }
  function setTok(t) { if (!t) { try { sessionStorage.removeItem("amgList"); } catch (e) {} } try { t ? sessionStorage.setItem("amgTok", t) : sessionStorage.removeItem("amgTok"); } catch (e) {} }
  function call(op, data) {
    data = data || {}; data.action = "admin"; data.op = op; data.token = tok();
    return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(data), redirect: "follow" })
      .then(function (r) { return r.json(); })
      .then(function (r) { if (r && r.error === "auth") { setTok(""); showLogin("Your session has ended. Please log in again."); throw new Error("auth"); } return r; });
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function num(n) { return (Number(n) || 0).toLocaleString("en-US"); }
  function wa(phone, text) { return "https://wa.me/" + String(phone || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(text); }
  function toast(m, bad) { var t = $("#adToast"); t.textContent = m; t.className = "ad-toast on" + (bad ? " bad" : ""); clearTimeout(t._t); t._t = setTimeout(function () { t.className = "ad-toast"; }, 3500); }
  function busy(on) { document.body.classList.toggle("ad-busy", !!on); }
  function enqByRef(ref) { return (D.enquiries || []).filter(function (e) { return e.Ref === ref; })[0] || {}; }
  function fr(e) { return /fr/i.test(e["Reply language"] || ""); }

  /* ---------- login ---------- */
  function showLogin(msg) {
    $("#adApp").hidden = true; $("#adLogin").hidden = false; $("#adLoginMsg").textContent = msg || "";
  }
  $("#adLoginForm").addEventListener("submit", function (ev) {
    ev.preventDefault(); var pw = $("#adPw").value; if (!pw) return;
    $("#adLoginMsg").textContent = "Checking…";
    call("login", { password: pw }).then(function (r) {
      if (!r.ok) { $("#adLoginMsg").textContent = r.error === "locked" ? "Too many wrong attempts. Wait 15 minutes." : "Wrong password."; return; }
      setTok(r.token); $("#adPw").value = ""; load();
    }).catch(function () { $("#adLoginMsg").textContent = "Connection problem. Try again."; });
  });
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-eye]"); if (!t) return;
    var inp = document.getElementById(t.dataset.eye); var show = inp.type === "password";
    inp.type = show ? "text" : "password"; t.classList.toggle("on", show); t.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });
  $("#adForgot").addEventListener("click", function () { $("#adLoginForm").hidden = true; $("#adResetBox").hidden = false; $("#adLoginMsg").textContent = ""; });
  $("#adBack").addEventListener("click", function () { $("#adLoginForm").hidden = false; $("#adResetBox").hidden = true; $("#adLoginMsg").textContent = ""; });
  $("#adSendCode").addEventListener("click", function () {
    var bt = this; bt.disabled = true; $("#adLoginMsg").textContent = "Sending…";
    call("forgot").then(function (r) {
      bt.disabled = false;
      $("#adLoginMsg").textContent = r.ok ? "A 6-digit code was sent to almanarahglobalservices@gmail.com (check spam too). It is valid for 15 minutes." : (r.error === "rate_limited" ? "Too many requests. Try again in 1 hour." : "Could not send the code.");
      if (r.ok) $("#adCodeStep").hidden = false;
    }).catch(function () { bt.disabled = false; $("#adLoginMsg").textContent = "Connection problem. Try again."; });
  });
  $("#adDoReset").addEventListener("click", function () {
    var code = $("#adCode").value.trim(), np = $("#adResetPw").value;
    if (!/^\d{6}$/.test(code)) { $("#adLoginMsg").textContent = "Enter the 6-digit code from the email."; return; }
    if (np.length < 8) { $("#adLoginMsg").textContent = "The new password needs at least 8 characters."; return; }
    $("#adLoginMsg").textContent = "Saving…";
    call("reset", { code: code, newPassword: np }).then(function (r) {
      if (!r.ok) { $("#adLoginMsg").textContent = r.error === "wrong_code" ? "Wrong code. Check the email and try again." : r.error === "expired" ? "The code has expired. Send a new code." : "Could not change the password."; return; }
      $("#adCode").value = ""; $("#adResetPw").value = ""; $("#adCodeStep").hidden = true; $("#adResetBox").hidden = true; $("#adLoginForm").hidden = false;
      $("#adLoginMsg").textContent = "Password changed ✓ Log in with your new password.";
    }).catch(function () { $("#adLoginMsg").textContent = "Connection problem. Try again."; });
  });
  $("#adLogout").addEventListener("click", function () { call("logout").catch(function () {}); setTok(""); showLogin("Logged out."); });

  /* ---------- data ---------- */
  function load() {
    var first = !D || !D.enquiries;
    if (first) { try { var c = JSON.parse(sessionStorage.getItem("amgList") || "null"); if (c && c.ok) { D = c; $("#adLogin").hidden = true; $("#adApp").hidden = false; draw(); } } catch (e) {} }
    busy(true);
    return call("list").then(function (r) {
      busy(false); if (!r.ok) { toast("Could not load: " + (r.error || ""), true); return; }
      D = r; try { sessionStorage.setItem("amgList", JSON.stringify(r)); } catch (e) {}
      var y = window.scrollY; $("#adLogin").hidden = true; $("#adApp").hidden = false; draw(); window.scrollTo(0, y);
    }).catch(function (e) { busy(false); if (String(e.message) !== "auth") toast("Connection problem. Try again.", true); });
  }
  $("#adRefresh").addEventListener("click", load);
  document.querySelectorAll("[data-tab]").forEach(function (b) { b.addEventListener("click", function () { TAB = b.dataset.tab; draw(); }); });
  $("#adSearch").addEventListener("input", function () { Q = this.value.trim().toLowerCase(); draw(); });

  function counts() {
    var c = { check: 0, open: 0 };
    (D.proofs || []).forEach(function (p) { if (p["Check status"] === "To check") c.check++; });
    (D.enquiries || []).forEach(function (e) { if (["Completed", "Cancelled", "Closed - no booking"].indexOf(e.Status) < 0) c.open++; });
    return c;
  }
  function match(o) { if (!Q) return true; return JSON.stringify(o).toLowerCase().indexOf(Q) > -1; }
  function draw() {
    var c = counts();
    $("#cCheck").textContent = c.check; $("#cOpen").textContent = c.open;
    document.querySelectorAll("[data-tab]").forEach(function (b) { b.classList.toggle("on", b.dataset.tab === TAB); });
    var box = $("#adList"), html = "";
    if (TAB === "check") {
      var list = (D.proofs || []).filter(function (p) { return p["Check status"] === "To check" && match(p); });
      html = list.length ? list.map(proofCard).join("") : '<p class="ad-empty">No payment to check. ✓</p>';
      var done = (D.proofs || []).filter(function (p) { return p["Check status"] !== "To check" && match(p); }).slice(0, 30);
      if (done.length) html += '<h3 class="ad-sub">Already checked</h3>' + done.map(proofCard).join("");
    } else if (TAB === "enq") {
      var en = (D.enquiries || []).filter(match);
      html = en.length ? en.map(enqCard).join("") : '<p class="ad-empty">No enquiry found.</p>';
    } else if (TAB === "pay") {
      var pa = (D.payments || []).filter(match);
      html = pa.length ? pa.map(payCard).join("") : '<p class="ad-empty">No payment recorded yet.</p>';
    } else if (TAB === "hotels") {
      html = hotelsEditor();
    } else if (TAB === "site") {
      html = siteEditor();
    } else if (TAB === "settings") {
      html = '<div class="ad-card"><h3>Change dashboard password</h3><p class="ad-muted">At least 8 characters. You will use it next time you log in.</p><div class="ad-row"><span class="pw-wrap"><input type="password" id="adNewPw" placeholder="New password" autocomplete="new-password"><button type="button" class="eye" data-eye="adNewPw" aria-label="Show password"></button></span><button class="btn btn-primary btn-sm" data-act="pw">Save password</button></div></div>' +
        '<div class="ad-card"><h3>Google Sheet</h3><p class="ad-muted">Everything you do here is saved in your CRM Google Sheet, which stays as your full record and backup.</p></div>';
    }
    box.innerHTML = html;
  }
  function statusSel(cur) { return '<select data-f="Status">' + (D.statuses || []).map(function (s) { return '<option' + (s === cur ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select>"; }
  function progSel(k, cur) { return '<label class="ad-mini">' + k + '<select data-f="' + k + '">' + (D.progress || []).map(function (s) { return '<option' + (s === cur ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select></label>"; }
  function proofCard(p) {
    var e = enqByRef(p.Ref), st = p["Check status"];
    return '<div class="ad-card proof ' + (st === "To check" ? "todo" : st === "Confirmed" ? "ok" : "no") + '" data-id="' + esc(p["Proof ID"]) + '">' +
      '<div class="ad-top"><b>' + num(p.Amount) + " " + esc(p.Currency) + '</b><span class="ad-badge">' + esc(st) + "</span></div>" +
      '<p><b>' + esc(p.Name) + "</b> · " + esc(p.Phone) + "<br>" + esc(p["Paid for"]) + "</p>" +
      '<p class="ad-muted">' + esc(p.Method) + " · Transaction: <b>" + esc(p["Transaction ID"]) + "</b><br>" + esc(p.Created) + " · " + esc(p.Ref) + (p.Notes ? "<br>" + esc(p.Notes) : "") + "</p>" +
      '<div class="ad-actions">' + (p["Receipt file"] ? '<a class="btn btn-outline btn-sm" href="' + esc(p["Receipt file"]) + '" target="_blank" rel="noopener">See customer receipt</a>' : '<span class="ad-badge">🏨 Pay at hotel — collect cash</span>') +
      (st === "To check" ? '<button class="btn btn-primary btn-sm" data-act="confirm">' + (/hotel/i.test(p.Method) ? "✓ Cash received at hotel" : "✓ Confirm payment") + '</button><button class="btn btn-outline btn-sm ad-danger" data-act="reject">Reject</button>' : "") +
      '<a class="btn btn-outline btn-sm" href="' + wa(p.Phone, (fr(e) ? "Bonjour " : "Hello ") + p.Name + ", AL MANARAH GLOBAL SERVICES — " + p.Ref + ". ") + '" target="_blank" rel="noopener">WhatsApp</a></div></div>';
  }
  function enqCard(e) {
    var bal = e["Quote total"] ? num(e.Balance) + " " + esc(e.Currency) : "—";
    return '<details class="ad-card enq" data-ref="' + esc(e.Ref) + '"><summary><div class="ad-top"><b>' + esc(e.Name) + '</b><span class="ad-badge">' + esc(e.Status) + '</span></div>' +
      '<p class="ad-muted">' + esc(e.Ref) + " · " + esc(e.Service) + " · " + esc(e.Created) + " · " + esc(e.Phone) + "</p>" +
      '<p class="ad-money">Quoted: <b>' + (e["Quote total"] ? num(e["Quote total"]) + " " + esc(e.Currency) : "—") + "</b> · Paid: <b>" + num(e.Paid) + "</b> · Balance: <b>" + bal + "</b> · " + esc(e["Payment status"]) + "</p></summary>" +
      (e.Details ? '<p class="ad-pre">' + esc(e.Details) + "</p>" : "") + (e.Message ? '<p class="ad-pre">' + esc(e.Message) + "</p>" : "") +
      '<div class="ad-grid"><label class="ad-mini">Status' + statusSel(e.Status) + "</label>" + ["Documents", "Visa", "Flight", "Hotel", "Transport"].map(function (k) { return progSel(k, e[k]); }).join("") + "</div>" +
      '<label class="ad-mini">Message to customer (shown on the Track page)<textarea data-f="Customer note (visible on Track page)" rows="2">' + esc(e["Customer note (visible on Track page)"]) + "</textarea></label>" +
      '<label class="ad-mini">Private notes (only you)<textarea data-f="Internal notes" rows="2">' + esc(e["Internal notes"]) + "</textarea></label>" +
      '<div class="ad-actions"><button class="btn btn-primary btn-sm" data-act="save">Save changes</button>' +
      '<a class="btn btn-outline btn-sm" href="' + wa(e.Phone, (fr(e) ? "Bonjour " : "Hello ") + e.Name + ", AL MANARAH GLOBAL SERVICES — " + e.Ref + ". ") + '" target="_blank" rel="noopener">WhatsApp</a></div>' +
      '<div class="ad-box"><h4>Make a quotation</h4><p class="ad-muted">One line per item: description | quantity | unit price. Example: Umrah package 10 days | 2 | 1650000</p>' +
      '<textarea class="q-items" rows="3" placeholder="Umrah package 10 days | 1 | 1650000"></textarea><div class="ad-row"><select class="q-cur"><option>XOF</option><option>NGN</option><option>SAR</option><option>USD</option><option>EUR</option></select><input class="q-notes" placeholder="Notes (optional)"><button class="btn btn-gold btn-sm" data-act="quote">Create quotation PDF</button></div></div>' +
      '<div class="ad-box"><h4>Record a payment &amp; make receipt</h4><div class="ad-row"><input class="p-amt" inputmode="numeric" placeholder="Amount"><select class="p-meth">' + (D.methods || []).map(function (m) { return "<option>" + esc(m) + "</option>"; }).join("") + '</select><input class="p-txn" placeholder="Transaction no. (optional)"><button class="btn btn-gold btn-sm" data-act="pay">Record + receipt PDF</button></div></div>' +
      '<div class="ad-out"></div></details>';
  }
  function payCard(p) {
    var e = enqByRef(p.Ref);
    return '<div class="ad-card" data-pid="' + esc(p["Payment ID"]) + '"><div class="ad-top"><b>' + num(p.Amount) + " " + esc(p.Currency) + '</b><span class="ad-badge">' + esc(p["Payment ID"]) + "</span></div>" +
      '<p><b>' + esc(e.Name || p["Paid by"]) + "</b> · " + esc(p.Ref) + " · " + esc(p.Date) + "<br>" + esc(p.Method) + (p["Reference / transaction no."] ? " · " + esc(p["Reference / transaction no."]) : "") + "</p>" +
      '<div class="ad-actions">' + (p["Receipt PDF"] ? '<a class="btn btn-outline btn-sm" href="' + esc(p["Receipt PDF"]) + '" target="_blank" rel="noopener">Open receipt</a>' : "") +
      '<button class="btn btn-primary btn-sm" data-act="receipt">' + (p["Receipt PDF"] ? "Make receipt again" : "Make receipt PDF") + "</button>" +
      (p["Receipt PDF"] && e.Phone ? sendLinks(e, p["Receipt PDF"], "receipt") : "") + '</div><div class="ad-out"></div></div>';
  }
  function sendLinks(e, url, kind) {
    var f = fr(e), t = kind === "quote"
      ? (f ? "Bonjour " + e.Name + ", voici votre devis AL MANARAH GLOBAL SERVICES (" + e.Ref + ") : " + url + "\nPaiement : MTN MoMo ou Wave au +225 05 06 12 23 37, puis envoyez votre reçu sur almanarahglobalservices.com/pay.html" : "Hello " + e.Name + ", here is your AL MANARAH GLOBAL SERVICES quotation (" + e.Ref + "): " + url + "\nPayment: MTN MoMo or Wave to +225 05 06 12 23 37, then upload your receipt at almanarahglobalservices.com/pay.html")
      : (f ? "Bonjour " + e.Name + ", merci pour votre paiement. Voici votre reçu AL MANARAH GLOBAL SERVICES (" + e.Ref + ") : " + url : "Hello " + e.Name + ", thank you for your payment. Here is your AL MANARAH GLOBAL SERVICES receipt (" + e.Ref + "): " + url);
    return '<a class="btn btn-wa btn-sm" href="' + wa(e.Phone, t) + '" target="_blank" rel="noopener">Send on WhatsApp</a>' +
      (e.Email ? '<a class="btn btn-outline btn-sm" href="mailto:' + esc(e.Email) + "?subject=" + encodeURIComponent("AL MANARAH GLOBAL SERVICES — " + e.Ref) + "&body=" + encodeURIComponent(t) + '">Send by email</a>' : "");
  }
  /* ---------- hotel name database, suggestions and paste-to-fill ---------- */
  /* names: our own list + OpenStreetMap (hotels-raw.json, ODbL) + Booking.com listings */
  var BOOKING = { makkah: "Rotana Jabal Omar Makkah|Orvana Thakher Hotel|Selat Al Bait Hotel|Al Ghufran Safwah Hotel Makkah|Radisson Hotel Makkah Thakher City|Knoz Al Anood Hotel Makkah|Loulouat Al Anood Hotel Makkah|Al Kiswah Towers Hotel|voco Makkah by IHG|Douof Al Maqam One Hotel|Al Tawheed Park Hotel|Paradise Land Al-Azizia Hotel|Thakher Plaza Elite Hotel|TIME Ruba Hotel & Suites|Courtyard by Marriott Makkah|Al Safwah Hotel First Tower|Al Safwah Orchid Hotel|Taj Park Hotel Makkah|Emaar Al Khalil Makkah|Abed Masoudi Ajyad Hotel Makkah|Orvana Soul Serviced Apartments|Jasmine Garden Makkah|Qira Hotel|Poinciana Hotel Makkah|Orvana Al Otaibiya Hotel|Diouf Al Maqam Connect Hotel|Al Ebaa Hotel|Luluat Al Badaie Hotel|Nour Althuria Hotel - Elaf Almaqam|Maysan Al Maqam Hotel|Royal Majestic Hotel Makkah|Rawha Al Maqam Ajyad Hotel|Saif Al Majd Hotel|Violet Al Shisha Hotel|Casablanca Hotel Makkah|Tilal Jabal Al Kabah|Novotel Makkah Thakher City|Elaf Qinwan Hotel|Mercure Makkah Aziziah|Violet Al Azizia Hotel|Hotel 21 Makkah|Midan Hotel & Suites Al Aziziya|Le Méridien Towers Makkah|Park Inn by Radisson Makkah Al Naseem|Park Inn by Radisson Makkah Aziziyah|Wahat Almisk Hotel|Makkah Al Aziziah by IHG|M Hotel Makkah by Millennium|Nasamat Makkah Hotel|Mahd Al Resala 1 Hotel|Osturat Emaar Hotel|Worth Elite Hotel|Askant Al Hafayer Hotel|Zwar Alharam Makkah Hotel|Grand Al Rawda Hotel|Malak Al Safwa Hotel|Refaq Alaliah Hotel|Rehab Al Taqwa Hotel|Grand Softel Hotel Makkah", madinah: "Makarem Burj Al Madinah|Peninsula Worth Hotel|Jadah Residence|MADEN Taiba Hotel|Maien Taiba|View Al Madinah Hotel|VALY Al-Madinah Hotel|E Hotel Madinah|Elaf Al Taqwa Hotel|Mysk Al Balad|Millennium Madinah Airport|Tulip Inn Al Daar Rawafid|Nozol Royal Hotel|Radisson Hotel Madinah|MADEN Hotel|Al Manakha Rotana Madinah|Grand Millennium Al Haram Hotel|Taiba Front Hotel|Ruh Almadinah Hotel|Roaa Alandalus Platinum Hotel|Grand Plaza Badr Al Maqam|Gewar Alandalus Hotel|Shaza Regency Plaza Al Madinah|One Inn Hotel|Al Madina Golden Hotel|Madinah Manazeli|Golden Tulip Al Shakreen|Nusk Al Hijrah|Bosphorus Hotel Medina|MADEN Al Rawda|Diyar Ajwa, Tapestry Collection by Hilton|Emaar Royal Hotel|Waqf Othman Bin Affan Hotel|Rehab Harmony Hotel|Afaq Taiba Hotel|Zaha Al Munawara Hotel|Lafeef Hotel Al-Aridh|AVAL Hotel|Zaha Taiba Hotel|Diwan Rose Hotel|Zamzam Pullman Madina|SAJA by Warwick Madinah Hotel|Ajyal Al Madinah Gacine Hotel|Bosphorus Hotel Waqf Safi|Mias Al Madina Hotel|Maysan Rotana El Mysk|Ancyra Hotel|Johra International Hotel|Durrat Balensia Hotel|The Seasons Hotel Madinah|Sofitel Shahd Al Madinah" };
  var HDB = { makkah: [], madinah: [] };
  function hkey(x) { return String(x || "").toLowerCase().replace(/hotel|makkah|madinah/g, "").replace(/[^a-z0-9\u0600-\u06ff]/g, ""); }
  function buildDB(raw) {
    var H = window.AMG_HOTELS || {};
    ["makkah", "madinah"].forEach(function (c) {
      var rows = [], seen = {};
      function add(en, ar, st, d) { var k = hkey(en) || hkey(ar); if (!k || seen[k]) return; seen[k] = 1; rows.push([en || "", ar || "", st, d]); }
      [5, 4, 3, 2].forEach(function (st) { ((H[c] || {})[st] || []).forEach(function (h) { add(h[0], "", st, 0); }); });
      ((raw || {})[c] || []).forEach(function (r) { var st = Math.round(Number(r[2]) || 0); add(r[0], r[1], st >= 1 && st <= 5 ? st : 0, Number(r[3]) || 0); });
      BOOKING[c].split("|").forEach(function (n) { add(n.trim(), "", 0, 0); });
      HDB[c] = rows;
    });
    IDX = null;
  }
  buildDB(null);
  fetch("hotels-raw.json").then(function (r) { return r.json(); }).then(function (raw) { buildDB(raw); var c = document.querySelector("#nhCount"); if (c) c.textContent = dbCount(); }).catch(function () {});
  function DB() { return window.AMG_HOTEL_DB || HDB; }
  function dbCount() { var d = DB(); return ((d.makkah || []).length + (d.madinah || []).length).toLocaleString("en-US"); }
  var AD = { "٠": 0, "١": 1, "٢": 2, "٣": 3, "٤": 4, "٥": 5, "٦": 6, "٧": 7, "٨": 8, "٩": 9, "۰": 0, "۱": 1, "۲": 2, "۳": 3, "۴": 4, "۵": 5, "۶": 6, "۷": 7, "۸": 8, "۹": 9 };
  function digits(t) { return String(t || "").replace(/[٠-٩۰-۹]/g, function (c) { return AD[c]; }).replace(/٫/g, ".").replace(/٬/g, ","); }
  function norm(t) {
    return digits(t).toLowerCase().normalize("NFD").replace(/[̀-ًͯ-ٰٟـ]/g, "")
      .replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
      .replace(/\b(the|hotel|hotels|makkah|mecca|madinah|medina|al madinah|by|and|&)\b/g, " ").replace(/(^|\s)(فندق|فنادق|مكه|المدينه|المنوره)(?=\s|$)/g, " ")
      .replace(/[^a-z0-9؀-ۿ]+/g, " ").trim();
  }
  function distTxt(m) { m = Number(m) || 0; if (!m) return ["", "", ""]; var t = m < 1000 ? Math.round(m / 10) * 10 + " m" : (Math.round(m / 100) / 10) + " km";
    return [t + " from the Haram", "à " + t.replace(".", ",") + " du Haram", "على بعد " + t.replace(" m", " م").replace(" km", " كم") + " من الحرم"]; }
  var IDX = null;
  function index() { if (IDX) return IDX; IDX = []; ["makkah", "madinah"].forEach(function (c) { (DB()[c] || []).forEach(function (h, i) { IDX.push({ c: c, i: i, h: h, ke: norm(h[0]), ka: norm(h[1]) }); }); }); return IDX; }
  function suggest(q, city) {
    q = norm(q); if (q.length < 2) return [];
    var words = q.split(" "), out = [];
    index().forEach(function (x) {
      var hay = x.ke + " | " + x.ka; if (!words.every(function (w) { return hay.indexOf(w) > -1; })) return;
      var sc = (x.ke.indexOf(q) === 0 || x.ka.indexOf(q) === 0 ? 0 : 1) + (x.c === city ? 0 : 2) + (x.h[3] ? x.h[3] / 100000 : 0.5);
      out.push([sc, x]);
    });
    return out.sort(function (a, b) { return a[0] - b[0]; }).slice(0, 8).map(function (p) { return p[1]; });
  }
  function showSug() {
    var box = $("#nhSug"), list = suggest($("#nhName").value, $("#nhCity").value);
    if (!list.length) { box.hidden = true; return; }
    box.innerHTML = list.map(function (x) { var h = x.h; return '<button type="button" data-act="nh-pick" data-city="' + x.c + '" data-i="' + x.i + '"><b>' + esc(h[0] || h[1]) + "</b><small>" + (x.c === "makkah" ? "Makkah" : "Madinah") + (h[2] ? " · " + "★".repeat(h[2]) : "") + (h[3] ? " · ≈" + distTxt(h[3])[0].replace(" from the Haram", "") : "") + (h[0] && h[1] ? ' · <span dir="rtl">' + esc(h[1]) + "</span>" : "") + "</small></button>"; }).join("");
    box.hidden = false;
  }
  function pickHotel(city, i, keep) {
    var h = (DB()[city] || [])[i]; if (!h) return;
    keep = keep || {};
    $("#nhName").value = h[0] || h[1]; $("#nhCity").value = city;
    var st = keep.stars || h[2]; if (st >= 2 && st <= 5) $("#nhStars").value = String(st);
    var d = distTxt(keep.dist || h[3]);
    if (d[0]) { $("#nhLoc").value = d[0]; $("#nhLocFr").value = d[1]; $("#nhLocAr").value = d[2]; }
    $("#nhSug").hidden = true;
    if (!h[0] && h[1]) translateName(h[1]);
  }
  function translateName(ar) {
    $("#nhInfo").textContent = "Translating the Arabic name…";
    return call("translate", { text: ar, to: "en" }).then(function (r) { if (r.ok && r.text) { $("#nhName").value = r.text.replace(/^(the )?hotel /i, "").replace(/\b\w/g, function (c) { return c.toUpperCase(); }) + (/hotel/i.test(r.text) ? "" : " Hotel"); $("#nhInfo").innerHTML = "Arabic name translated: <b>" + esc(ar) + "</b> → <b>" + esc($("#nhName").value) + "</b>. Check the spelling before saving."; } }).catch(function () {});
  }
  var WEAK = /^(al|el|the|royal|grand|plaza|tower|towers|palace|stars?|golden|suites?|inn|new|international|رويال|جراند|بلازا|برج|ابراج|قصر|الذهبي|انترناشونال|جديد)$/;
  function strong(k) { var w = k.split(" ").filter(function (x) { return x.length > 1 && !WEAK.test(x); }); return k.length >= 6 && (w.length >= 2 || (w.length === 1 && w[0].length >= 6)); }
  function fillFromPaste() {
    var raw = $("#nhPaste").value, t = digits(raw), low = t.toLowerCase(), info = [];
    if (!raw.trim()) return toast("Paste the hotel details first.", true);
    var city = /madin|medin|المدينة|المدينه|طيبة|النبوي/i.test(t) ? "madinah" : /makk|mecca|mekka|مكة|مكه|الحرم المكي|ajyad|أجياد|اجياد|aziz|عزيزية|misfal|مسفلة/i.test(t) ? "makkah" : "";
    var st = 0, m = low.match(/([1-5])\s*(?:-|\s)?\s*(?:star|stars|étoiles?|etoiles?|نجوم|نجمة|نجمات|\*)/) || low.match(/(?:فئة|category)\s*([1-5])/);
    if (m) st = +m[1]; else { var k = (t.match(/[★⭐]/g) || []).length; if (k >= 2 && k <= 5) st = k; }
    var dist = 0; m = low.match(/(\d+(?:[.,]\d+)?)\s*(?:km|kilomet|كم|كيلو)/); if (m) dist = Math.round(parseFloat(m[1].replace(",", ".")) * 1000);
    else { m = low.match(/(\d{2,4})\s*(?:m\b|meters?|metres?|mètres?|م\b|متر|مترا|متراً)/); if (m) dist = +m[1]; }
    var price = ""; m = t.match(/(?:SAR|SR|ر\.?\s?س|ريال)\s*([\d][\d,\.]*)/i) || t.match(/([\d][\d,\.]*)\s*(?:SAR|SR|ر\.?\s?س|ريال)/i); if (m) price = String(Math.round(parseFloat(m[1].replace(/,/g, ""))));
    // find hotel name in the database (longest name contained in the text)
    var nt = " " + norm(t) + " ", best = null;
    index().forEach(function (x) { [x.ke, x.ka].forEach(function (k) { if (k && strong(k) && nt.indexOf(" " + k + " ") > -1 && (!city || x.c === city) && (!best || k.length > best.len)) best = { x: x, len: k.length }; }); });
    if (city) $("#nhCity").value = city;
    if (st) $("#nhStars").value = String(Math.min(5, Math.max(2, st)));
    if (price) $("#nhPrice").value = price;
    if (best) { pickHotel(best.x.c, best.x.i, { stars: st, dist: dist }); info.push("Found in the hotel list: <b>" + esc(best.x.h[0] || best.x.h[1]) + "</b>"); }
    else {
      var first = raw.split(/\n|·|\||,|،|-\s/)[0].trim();
      if (!/[\u0600-\u06ff]/.test(first)) first = first.split(/\s(?=\d|\(|★|-\s*\d)/)[0].trim();
      if (/[\u0600-\u06ff]/.test(first)) first = digits(first).split(/\s(?=مكة|مكه|المدينة|المدينه|في\s|[0-9]|نجوم|نجمة|يبعد|على بعد|بالقرب|قرب|السعر|ريال|ر\.س)/)[0].trim();
      var d = distTxt(dist); if (d[0]) { $("#nhLoc").value = d[0]; $("#nhLocFr").value = d[1]; $("#nhLocAr").value = d[2]; }
      if (/[؀-ۿ]/.test(first) && !/[a-z]{3}/i.test(first)) translateName(first.replace(/^فندق\s*/, "")); else $("#nhName").value = first.replace(/\s*[-–]\s*$/, "");
      info.push("Not in the list — name taken from the first line" + (/[؀-ۿ]/.test(first) ? " and translated" : ""));
    }
    info.push(city ? "City: " + (city === "makkah" ? "Makkah" : "Madinah") : "City not found — choose it");
    info.push(st ? "Stars: " + st : "Stars not found — choose them");
    info.push(dist ? "Distance: ≈ " + distTxt(dist)[0].replace(" from the Haram", "") : "Distance not found");
    if (price) info.push("Price: " + price + " SAR");
    $("#nhInfo").innerHTML = info.join(" · ") + ". Check, then press <b>Add hotel</b>.";
    $("#nhName").focus();
  }
  document.addEventListener("input", function (ev) { if (ev.target.id === "nhName") showSug(); });
  document.addEventListener("change", function (ev) {
    var t = ev.target; if (!t.classList || !t.classList.contains("sel-all")) return;
    var q = t.dataset.city === "removed" ? ".ad-price.removed .hsel" : '.ad-price:not(.removed)[data-city="' + t.dataset.city + '"] .hsel';
    document.querySelectorAll(q).forEach(function (c) { c.checked = t.checked; });
  });
  document.addEventListener("keydown", function (ev) { if (ev.target.id === "nhPaste" && ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); fillFromPaste(); } });
  document.addEventListener("click", function (ev) { var s = $("#nhSug"); if (s && !s.hidden && !ev.target.closest(".nh-wrap")) s.hidden = true; });

  /* ---------- Website content (fixed list) + edit mode launcher ---------- */
  var SITE = null;
  function siteLoad() { busy(true); call("content_list").then(function (r) { busy(false); if (!r.ok) return toast("Error: " + r.error, true); SITE = {}; (r.items || []).forEach(function (x) { SITE[x.Key] = x; }); draw(); }).catch(function () { busy(false); toast("Connection problem.", true); }); }
  var SITE_FIELDS = [
    ["Announcement bar (top of every page, leave empty to hide)", [["txt:announce", "Text", "3"]]],
    ["December Umrah offer", [["cfg:promo.on", "Show the offer (yes / no)", "yn", "promo.on"], ["cfg:promo.title", "Title", "3", "promo.title"], ["cfg:promo.dates", "Dates", "3", "promo.dates"], ["cfg:promo.from", "Departure", "3", "promo.from"], ["price:dec2026", "Price per person (FCFA)", "n", "promo.price"], ["cfg:promo.departure", "Departure date (YYYY-MM-DD)", "1", "promo.departure"], ["cfg:promo.endsOn", "Booking closes (YYYY-MM-DD)", "1", "promo.endsOn"], ["cfg:promo.lastPlaces", "Show “last places” (yes / no)", "yn", "promo.lastPlaces"]]],
    ["Fixed prices (Pay page and Visas page)", [["price:visa-umrah-ng", "Umrah visa — Nigerian passport (FCFA)", "n", "item.visa-umrah-ng"], ["price:visa-umrah-ci", "Umrah visa — Ivorian passport (FCFA)", "n", "item.visa-umrah-ci"]]],
    ["Badal Umrah (home page advert)", [["cfg:badal.on", "Show Badal Umrah (yes / no)", "yn", "badal.on"], ["price:badal", "Price (SAR)", "n", "badal.price"]]],
    ["Mobile money numbers (Pay page)", [["cfg:payments.mtn", "MTN MoMo number", "1", "payments.mtn"], ["cfg:payments.wave", "Wave number", "1", "payments.wave"]]]
  ];
  function cfgVal(path) {
    var C = window.SITE_CONFIG || {}, p = path.split(".");
    if (p[0] === "item") { var it = ((C.payments || {}).items || []).filter(function (x) { return x.id === p[1]; })[0]; return it ? it.price : ""; }
    if (p[0] === "badal") return p[1] === "on" ? "yes" : 500;
    var o = C[p[0]] || {}, v = o[p[1]]; if (v === true) return "yes"; if (v === false) return "no";
    return v == null ? "" : v;
  }
  function siteEditor() {
    if (!SITE) { siteLoad(); return '<p class="ad-empty">Loading…</p>'; }
    var h = '<div class="ad-card"><h3>✏️ Edit any text or picture</h3><p class="ad-muted">Opens the website in edit mode: tap any title, paragraph or photo, change it in English, French and Arabic, and save.</p><a class="btn btn-gold" href="index.html?edit=1">Open the website in edit mode</a></div>';
    SITE_FIELDS.forEach(function (g) {
      h += '<div class="ad-card"><h3>' + esc(g[0]) + "</h3>";
      g[1].forEach(function (f) {
        var r = SITE[f[0]] || {}, def = f[3] ? cfgVal(f[3]) : "", set = !!SITE[f[0]];
        if (f[2] === "3") {
          var C = window.SITE_CONFIG || {}, pp = (f[3] || "").split("."), o = C[pp[0]] || {};
          h += '<label class="ad-mini">' + esc(f[1]) + (set ? ' <em class="ad-new">changed</em>' : "") + '</label><div class="site-3" data-k="' + f[0] + '">' +
            '<input data-l="en" placeholder="English" value="' + esc(set ? r.English : (f[3] ? o[pp[1]] || "" : "")) + '">' +
            '<input data-l="fr" placeholder="Français" value="' + esc(set ? r.French : (f[3] ? o[pp[1] + "Fr"] || "" : "")) + '">' +
            '<input data-l="ar" dir="rtl" placeholder="العربية" value="' + esc(set ? r.Arabic : "") + '"></div>';
        } else {
          h += '<label class="ad-mini">' + esc(f[1]) + (set ? ' <em class="ad-new">changed</em>' : "") + '<input class="site-1" data-k="' + f[0] + '" ' + (f[2] === "n" ? 'inputmode="numeric" ' : "") + 'value="' + esc(set ? r.English : def) + '" data-def="' + esc(def) + '"></label>';
        }
      });
      h += "</div>";
    });
    var edits = Object.keys(SITE).filter(function (k) { return k.indexOf("e:") === 0; });
    h += '<div class="ad-card"><h3>Your edits on the pages (' + edits.length + ")</h3>" + (edits.length ? edits.map(function (k) { var r = SITE[k]; return '<div class="ad-price"><span><b>' + esc(r.Page || k.split("|")[0].slice(2)) + "</b><small>" + esc(r.Image ? "Picture changed" : String(r.English || r.Arabic || r.French).slice(0, 90)) + '</small></span><button class="btn btn-outline btn-sm" data-act="site-undo" data-k="' + esc(k) + '">Undo</button></div>'; }).join("") : '<p class="ad-muted">None yet.</p>') + "</div>";
    return h + '<div class="ad-sticky"><button class="btn btn-primary" data-act="site-save">Save website content</button></div>';
  }
  function siteSave() {
    var items = [];
    document.querySelectorAll(".site-1").forEach(function (i) {
      var k = i.dataset.k, v = i.value.trim(), had = !!SITE[k];
      if (!v || (v === String(i.dataset.def) && !had)) { if (had && !v) items.push({ key: k, remove: true }); return; }
      if (had && v === String(SITE[k].English)) return;
      items.push({ key: k, en: v });
    });
    document.querySelectorAll(".site-3").forEach(function (d) {
      var k = d.dataset.k, g = function (l) { return d.querySelector('[data-l="' + l + '"]').value.trim(); }, it = { key: k, en: g("en"), fr: g("fr"), ar: g("ar") }, had = SITE[k];
      if (!it.en && !it.fr && !it.ar) { if (had) items.push({ key: k, remove: true }); return; }
      if (had && it.en === had.English && it.fr === had.French && it.ar === had.Arabic) return;
      if (!had && k !== "txt:announce" && !it.ar && d.querySelector('[data-l="en"]').defaultValue === it.en && d.querySelector('[data-l="fr"]').defaultValue === it.fr) return;
      items.push(it);
    });
    if (!items.length) return toast("Nothing changed.");
    busy(true); call("content_set", { items: items }).then(function (r) { busy(false); if (!r.ok) return toast("Error: " + r.error, true); toast("Saved ✓ — the website shows it within 5 minutes."); SITE = null; draw(); }).catch(function () { busy(false); toast("Connection problem.", true); });
  }

  var STAR = { 5: "★★★★★", 4: "★★★★", 3: "★★★", 2: "★★" };
  function hotelRows() {
    var H = window.AMG_HOTELS || {}, P = {}, list = [];
    (D.prices || []).forEach(function (r) { P[r.City + "|" + r.Hotel] = r; });
    ["makkah", "madinah"].forEach(function (city) {
      [5, 4, 3, 2].forEach(function (st) {
        (H[city] && H[city][st] || []).forEach(function (h) { var r = P[city + "|" + h[0]] || {}; list.push({ hotel: h[0], city: city, stars: st, loc: h[1], locFr: h[2], price: r["From price (SAR / night)"] || "", status: r.Status === "Removed" ? "Removed" : "", builtin: true }); delete P[city + "|" + h[0]]; });
      });
    });
    Object.keys(P).forEach(function (k) { var r = P[k]; if (r.Status === "Added" || r.Status === "Removed") list.push({ hotel: r.Hotel, city: r.City, stars: Number(r.Stars) || 3, loc: r.Location || "", locFr: r["Location (FR)"] || "", locAr: r["Location (AR)"] || "", price: r["From price (SAR / night)"] || "", status: r.Status, builtin: false }); });
    return list;
  }
  function hotelsEditor() {
    var list = hotelRows(), html = '<div class="ad-card"><h3>Hotel “from” prices</h3><p class="ad-muted">Enter the lowest price per room per night (SAR) for each hotel — for example 5% under Booking.com for the season. Update it only when the season changes. Leave empty to show no price.</p></div>';
    html += '<details class="ad-card" id="nhBox"><summary><b>+ Add a new hotel</b></summary><div class="ad-box" style="border:0;padding:0;background:none">' +
      '<label class="ad-mini">① Paste hotel details here (English or Arabic) — then press Enter or “Fill automatically”<textarea id="nhPaste" rows="4" placeholder="e.g. Swissôtel Al Maqam Makkah · 5 stars · 300 m from Haram · SAR 950&#10;أو: فندق سويس أوتيل المقام مكة 5 نجوم يبعد 300 متر عن الحرم"></textarea></label>' +
      '<div class="ad-row"><button class="btn btn-primary btn-sm" data-act="nh-fill">✨ Fill automatically</button><button class="btn btn-outline btn-sm" data-act="nh-tr">Translate Arabic → English</button></div><p class="ad-muted" id="nhInfo"></p>' +
      '<label class="ad-mini">② Hotel name (start typing — suggestions from <span id="nhCount">' + dbCount() + '</span> hotels)<span class="nh-wrap"><input id="nhName" autocomplete="off" placeholder="e.g. Swissôtel Al Maqam"><span id="nhSug" class="nh-sug" hidden></span></span></label>' +
      '<div class="ad-row"><select id="nhCity"><option value="makkah">Makkah</option><option value="madinah">Madinah</option></select><select id="nhStars"><option value="5">★★★★★ (5)</option><option value="4">★★★★ (4)</option><option value="3" selected>★★★ (3)</option><option value="2">★★ (2)</option></select></div>' +
      '<label class="ad-mini">Location / distance (English)<input id="nhLoc" placeholder="e.g. 300 m from the Haram"></label>' +
      '<label class="ad-mini">Location / distance (French)<input id="nhLocFr" placeholder="ex. à 300 m du Haram"></label>' +
      '<label class="ad-mini">Location / distance (Arabic)<input id="nhLocAr" dir="rtl" placeholder="على بعد 300 م من الحرم"></label>' +
      '<div class="ad-row"><input id="nhPrice" inputmode="numeric" placeholder="From price SAR / night (optional)"><button class="btn btn-gold btn-sm" data-act="hotel-add">Add hotel</button></div></div></details>';
    ["makkah", "madinah"].forEach(function (city) {
      html += '<h3 class="ad-sub">' + (city === "makkah" ? "Makkah" : "Madinah") + '</h3><div class="ad-bulk" data-city="' + city + '"><label><input type="checkbox" class="sel-all" data-city="' + city + '"> Select all</label><button class="btn btn-outline btn-sm" data-act="bulk-remove" data-city="' + city + '">Remove selected</button></div>';
      list.filter(function (x) { return x.city === city && x.status !== "Removed"; }).sort(function (a, b) { return b.stars - a.stars; }).forEach(function (x) {
        html += '<div class="ad-price" data-city="' + x.city + '" data-stars="' + x.stars + '" data-hotel="' + esc(x.hotel) + '" data-loc="' + esc(x.loc) + '" data-locfr="' + esc(x.locFr) + '" data-locar="' + esc(x.locAr || "") + '" data-status="' + (x.builtin ? "" : "Added") + '"><input type="checkbox" class="hsel" aria-label="Select"><span><b>' + esc(x.hotel) + (x.builtin ? "" : ' <em class="ad-new">added</em>') + '</b><small>' + STAR[x.stars] + " · " + esc(x.loc) + '</small></span><input inputmode="numeric" class="hp-p" value="' + esc(x.price) + '" placeholder="SAR"><button class="ad-x" data-act="hotel-remove" title="Remove this hotel" aria-label="Remove">✕</button></div>';
      });
    });
    var rem = list.filter(function (x) { return x.status === "Removed"; });
    if (rem.length) {
      html += '<h3 class="ad-sub">Removed hotels (hidden on the website)</h3><div class="ad-bulk" data-city="removed"><label><input type="checkbox" class="sel-all" data-city="removed"> Select all</label><button class="btn btn-outline btn-sm" data-act="bulk-restore">Restore selected</button></div>';
      rem.forEach(function (x) { html += '<div class="ad-price removed" data-city="' + x.city + '" data-stars="' + x.stars + '" data-hotel="' + esc(x.hotel) + '" data-loc="' + esc(x.loc) + '" data-locfr="' + esc(x.locFr) + '" data-locar="' + esc(x.locAr || "") + '" data-status="' + (x.builtin ? "" : "Added") + '"><input type="checkbox" class="hsel" aria-label="Select"><span><b>' + esc(x.hotel) + "</b><small>" + (x.city === "makkah" ? "Makkah" : "Madinah") + " · " + STAR[x.stars] + '</small></span><input type="hidden" class="hp-p" value="' + esc(x.price) + '"><button class="btn btn-outline btn-sm" data-act="hotel-restore">Restore</button></div>'; });
    }
    return html + '<div class="ad-sticky"><button class="btn btn-primary" data-act="prices">Save hotel prices</button></div>';
  }
  function rowData(x, status) { return { hotel: x.dataset.hotel, city: x.dataset.city, stars: x.dataset.stars, price: x.querySelector(".hp-p").value, loc: x.dataset.loc, locFr: x.dataset.locfr, locAr: x.dataset.locar || "", status: status }; }
  function saveHotels(rows, msg) {
    busy(true);
    return call("prices_set", { rows: rows }).then(function (r) {
      busy(false); if (!r.ok) return toast("Error: " + r.error, true);
      D.prices = D.prices || [];
      rows.forEach(function (x) {
        var row = { Hotel: x.hotel, City: x.city, Stars: x.stars, "From price (SAR / night)": x.price, Location: x.loc || "", "Location (FR)": x.locFr || "", "Location (AR)": x.locAr || "", Status: x.status || "" };
        var i = -1; D.prices.forEach(function (p, j) { if (p.Hotel === x.hotel && p.City === x.city) i = j; });
        if (i > -1) D.prices[i] = row; else D.prices.push(row);
      });
      var y = window.scrollY; toast(msg); draw(); window.scrollTo(0, y);
    }).catch(function () { busy(false); toast("Connection problem.", true); });
  }


  /* ---------- actions ---------- */
  function out(el, html) { var o = el.querySelector(".ad-out"); if (o) o.innerHTML = html; }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-act]"); if (!b) return;
    var act = b.dataset.act, card = b.closest("[data-ref],[data-id],[data-pid]") || document;
    if (act === "confirm" || act === "reject") {
      if (act === "confirm" && !confirm("Confirm this payment? Only confirm after you have seen the money in your MTN / Wave account.")) return;
      b.disabled = true; busy(true);
      call("proof", { id: card.dataset.id, status: act === "confirm" ? "Confirmed" : "Rejected" }).then(function (r) {
        busy(false); if (!r.ok) { b.disabled = false; return toast("Error: " + r.error, true); }
        toast(act === "confirm" ? "Payment confirmed — receipt created." : "Payment rejected.");
        return load().then(function () { if (r.url) { TAB = "pay"; draw(); } });
      }).catch(function () { busy(false); b.disabled = false; toast("Connection problem.", true); });
    } else if (act === "save") {
      var f = {}; card.querySelectorAll("[data-f]").forEach(function (x) { f[x.dataset.f] = x.value; });
      busy(true); call("update", { ref: card.dataset.ref, fields: f }).then(function (r) { busy(false); if (!r.ok) return toast("Error: " + r.error, true); toast("Saved."); load(); }).catch(function () { busy(false); toast("Connection problem.", true); });
    } else if (act === "quote") {
      var items = card.querySelector(".q-items").value.trim(); if (!items) return toast("Write at least one item line.", true);
      busy(true); b.disabled = true;
      call("quote", { ref: card.dataset.ref, items: items, currency: card.querySelector(".q-cur").value, notes: card.querySelector(".q-notes").value }).then(function (r) {
        busy(false); b.disabled = false; if (!r.ok) return toast("Error: " + r.error, true);
        var e = enqByRef(card.dataset.ref);
        out(card, '<p class="ad-okmsg">Quotation ' + esc(r.quote) + ' created.</p><div class="ad-actions"><a class="btn btn-outline btn-sm" href="' + esc(r.url) + '" target="_blank" rel="noopener">Open PDF</a>' + sendLinks(e, r.url, "quote") + "</div>");
        toast("Quotation created.");
      }).catch(function () { busy(false); b.disabled = false; toast("Connection problem.", true); });
    } else if (act === "pay") {
      var amt = card.querySelector(".p-amt").value; if (!amt) return toast("Enter the amount.", true);
      if (!confirm("Record a payment of " + amt + " for " + card.dataset.ref + "?")) return;
      busy(true); b.disabled = true;
      call("pay", { ref: card.dataset.ref, amount: amt, method: card.querySelector(".p-meth").value, txn: card.querySelector(".p-txn").value }).then(function (r) {
        busy(false); b.disabled = false; if (!r.ok) return toast("Error: " + r.error, true);
        var e = enqByRef(card.dataset.ref);
        out(card, '<p class="ad-okmsg">Payment ' + esc(r.payment) + ' recorded.</p><div class="ad-actions"><a class="btn btn-outline btn-sm" href="' + esc(r.url) + '" target="_blank" rel="noopener">Open receipt</a>' + sendLinks(e, r.url, "receipt") + "</div>");
        toast("Payment recorded, receipt created.");
      }).catch(function () { busy(false); b.disabled = false; toast("Connection problem.", true); });
    } else if (act === "receipt") {
      busy(true); b.disabled = true;
      call("receipt", { id: card.dataset.pid }).then(function (r) {
        busy(false); b.disabled = false; if (!r.ok) return toast("Error: " + r.error, true);
        var p = (D.payments || []).filter(function (x) { return x["Payment ID"] === card.dataset.pid; })[0] || {}, e = enqByRef(p.Ref);
        out(card, '<div class="ad-actions"><a class="btn btn-outline btn-sm" href="' + esc(r.url) + '" target="_blank" rel="noopener">Open receipt</a>' + (e.Phone ? sendLinks(e, r.url, "receipt") : "") + "</div>");
        toast("Receipt created.");
      }).catch(function () { busy(false); b.disabled = false; toast("Connection problem.", true); });
    } else if (act === "prices") {
      var rows = [].map.call(document.querySelectorAll(".ad-price:not(.removed)"), function (x) { return rowData(x, x.dataset.status); });
      saveHotels(rows, "Hotel prices saved — the website shows them within 10 minutes.");
    } else if (act === "hotel-remove") {
      var hr = b.closest(".ad-price"); if (!confirm("Remove “" + hr.dataset.hotel + "” from the website? You can restore it later.")) return;
      saveHotels([rowData(hr, "Removed")], "Hotel removed from the website.");
    } else if (act === "hotel-restore") {
      var rr = b.closest(".ad-price"); saveHotels([rowData(rr, rr.dataset.status === "Added" ? "Added" : "")], "Hotel restored.");
    } else if (act === "hotel-add") {
      var nm = $("#nhName").value.replace(/[<>"]/g, "").trim(); if (nm.length < 3) return toast("Write the hotel name.", true);
      var exists = hotelRows().some(function (x) { return x.hotel.toLowerCase() === nm.toLowerCase() && x.city === $("#nhCity").value; });
      if (exists) return toast("This hotel is already in the list.", true);
      saveHotels([{ hotel: nm, city: $("#nhCity").value, stars: $("#nhStars").value, price: $("#nhPrice").value, loc: $("#nhLoc").value.trim(), locFr: $("#nhLocFr").value.trim() || $("#nhLoc").value.trim(), locAr: $("#nhLocAr").value.trim(), status: "Added" }], "Hotel added — it appears on the website within 10 minutes.");
    } else if (act === "bulk-remove" || act === "bulk-restore") {
      var restore = act === "bulk-restore", sel = [].filter.call(document.querySelectorAll(restore ? ".ad-price.removed" : '.ad-price:not(.removed)[data-city="' + b.dataset.city + '"]'), function (x) { var c = x.querySelector(".hsel"); return c && c.checked; });
      if (!sel.length) return toast("Tick the hotels first.", true);
      if (!restore && !confirm("Remove " + sel.length + " hotel(s) from the website? You can restore them later.")) return;
      saveHotels(sel.map(function (x) { return rowData(x, restore ? (x.dataset.status === "Added" ? "Added" : "") : "Removed"); }), sel.length + (restore ? " hotel(s) restored." : " hotel(s) removed from the website."));
    } else if (act === "site-save") {
      siteSave();
    } else if (act === "site-undo") {
      if (!confirm("Undo this change on the website?")) return;
      busy(true); call("content_set", { items: [{ key: b.dataset.k, remove: true }] }).then(function (r) { busy(false); if (!r.ok) return toast("Error: " + r.error, true); toast("Undone ✓"); SITE = null; draw(); }).catch(function () { busy(false); toast("Connection problem.", true); });
    } else if (act === "nh-fill") {
      fillFromPaste();
    } else if (act === "nh-tr") {
      var src = $("#nhPaste").value.trim(); if (!src) return toast("Paste some Arabic text first.", true);
      busy(true); call("translate", { text: src, to: "en" }).then(function (r) { busy(false); if (!r.ok) return toast("Could not translate.", true); $("#nhInfo").innerHTML = "<b>English:</b> " + esc(r.text); $("#nhPaste").value = r.text + "\n" + src; }).catch(function () { busy(false); toast("Connection problem.", true); });
    } else if (act === "nh-pick") {
      pickHotel(b.dataset.city, +b.dataset.i);
    } else if (act === "pw") {
      var pw = $("#adNewPw").value; if (pw.length < 8) return toast("At least 8 characters.", true);
      busy(true); call("password", { newPassword: pw }).then(function (r) { busy(false); if (!r.ok) return toast("Error: " + r.error, true); $("#adNewPw").value = ""; toast("Password changed."); }).catch(function () { busy(false); toast("Connection problem.", true); });
    }
  });

  if (tok()) load(); else showLogin("");
})();
