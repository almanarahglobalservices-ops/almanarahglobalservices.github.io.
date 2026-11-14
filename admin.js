/* AL MANARAH — private dashboard (admin.html). Talks only to the CRM (Google Apps Script). */
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG || {}, API = CFG.formEndpoint, $ = function (s, r) { return (r || document).querySelector(s); };
  var D = null, TAB = "check", Q = "";
  function tok() { try { return sessionStorage.getItem("amgTok") || ""; } catch (e) { return ""; } }
  function setTok(t) { try { t ? sessionStorage.setItem("amgTok", t) : sessionStorage.removeItem("amgTok"); } catch (e) {} }
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
  $("#adLogout").addEventListener("click", function () { call("logout").catch(function () {}); setTok(""); showLogin("Logged out."); });

  /* ---------- data ---------- */
  function load() {
    busy(true);
    return call("list").then(function (r) {
      busy(false); if (!r.ok) { toast("Could not load: " + (r.error || ""), true); return; }
      D = r; $("#adLogin").hidden = true; $("#adApp").hidden = false; draw();
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
    } else if (TAB === "settings") {
      html = '<div class="ad-card"><h3>Change dashboard password</h3><p class="ad-muted">At least 8 characters. You will use it next time you log in.</p><div class="ad-row"><input type="password" id="adNewPw" placeholder="New password" autocomplete="new-password"><button class="btn btn-primary btn-sm" data-act="pw">Save password</button></div></div>' +
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
      '<div class="ad-actions"><a class="btn btn-outline btn-sm" href="' + esc(p["Receipt file"]) + '" target="_blank" rel="noopener">See customer receipt</a>' +
      (st === "To check" ? '<button class="btn btn-primary btn-sm" data-act="confirm">✓ Confirm payment</button><button class="btn btn-outline btn-sm ad-danger" data-act="reject">Reject</button>' : "") +
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
  function hotelsEditor() {
    var H = window.AMG_HOTELS || {}, P = {};
    (D.prices || []).forEach(function (r) { P[r.City + "|" + r.Hotel] = r; });
    var html = '<div class="ad-card"><h3>Hotel “from” prices</h3><p class="ad-muted">Enter the lowest price per room per night (SAR) for each hotel — for example 5% under Booking.com for the season. You only need to update it when the season changes. Leave empty to show no price.</p></div>';
    ["makkah", "madinah"].forEach(function (city) {
      html += '<h3 class="ad-sub">' + (city === "makkah" ? "Makkah" : "Madinah") + "</h3>";
      [5, 4, 3, 2].forEach(function (st) {
        (H[city] && H[city][st] || []).forEach(function (h) {
          var r = P[city + "|" + h[0]] || {};
          html += '<div class="ad-price" data-city="' + city + '" data-stars="' + st + '" data-hotel="' + esc(h[0]) + '"><span><b>' + esc(h[0]) + '</b><small>' + "★".repeat(st) + " · " + esc(h[1]) + '</small></span><input inputmode="numeric" class="hp-p" value="' + esc(r["From price (SAR / night)"] || "") + '" placeholder="SAR"></div>';
        });
      });
    });
    return html + '<div class="ad-sticky"><button class="btn btn-primary" data-act="prices">Save hotel prices</button></div>';
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
      var rows = [].map.call(document.querySelectorAll(".ad-price"), function (x) { return { hotel: x.dataset.hotel, city: x.dataset.city, stars: x.dataset.stars, price: x.querySelector(".hp-p").value }; });
      busy(true); call("prices_set", { rows: rows }).then(function (r) { busy(false); if (!r.ok) return toast("Error: " + r.error, true); toast("Hotel prices saved — the website shows them within 10 minutes."); load(); }).catch(function () { busy(false); toast("Connection problem.", true); });
    } else if (act === "pw") {
      var pw = $("#adNewPw").value; if (pw.length < 8) return toast("At least 8 characters.", true);
      busy(true); call("password", { newPassword: pw }).then(function (r) { busy(false); if (!r.ok) return toast("Error: " + r.error, true); $("#adNewPw").value = ""; toast("Password changed."); }).catch(function () { busy(false); toast("Connection problem.", true); });
    }
  });

  if (tok()) load(); else showLogin("");
})();
