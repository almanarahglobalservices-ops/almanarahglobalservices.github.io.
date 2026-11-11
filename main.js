/* AL MANARAH — site behaviour: language switch, navigation, enquiry routing, forms, lightbox. */
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG || {};
  var MAIN = CFG.whatsappMain || "2250506122337";
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Language (EN default in HTML, FR in data-fr* attributes) ---------- */
  var lang = "en";
  var T = {
    en: {
      wa_hello: "Hello AL MANARAH GLOBAL SERVICES, I would like information about: ",
      opened: "WhatsApp has opened with your enquiry. It is NOT sent until you press Send in WhatsApp. If WhatsApp did not open, please use “Send by email” or call +225 05 06 12 23 37.",
      mail_opened: "Your email app has opened with your enquiry. It is NOT sent until you press Send in your email app. If nothing opened, write to almanarahglobalservices@gmail.com.",
      fix: "Please correct the highlighted fields.",
      sending: "Sending…",
      sent: "Thank you — your enquiry has been received. We will reply by WhatsApp, phone or email.",
      failed: "Sorry, your enquiry could not be sent. Nothing was submitted. Please try again or contact us on WhatsApp.",
      spam: "Your enquiry could not be processed.",
      captcha: "Please complete the security check.",
      ref_label: "Your reference number:",
      ref_keep: "Keep this number — use it on the Track page or when you contact us.",
      continue_wa: "Continue on WhatsApp",
      track_bad: "Please check your reference number and phone number.",
      track_none: "No file matches this reference and phone number. Check both and try again, or contact us on WhatsApp.",
      track_limit: "Too many attempts. Please wait 15 minutes and try again.",
      track_off: "Online tracking is not active yet. Please contact us on WhatsApp with your reference number.",
      t_status: "Current status", t_payment: "Payment", t_updated: "Last updated", t_note: "Message from our team", t_progress: "Booking progress",
      subject: "Website enquiry",
      partner: "Travel partnership",
      services: { umrah: "Umrah package", hajj: "Hajj guidance", visa: "Saudi visa", flights: "Flights", hotels: "Hotels in Makkah / Madinah", transfer: "Transfers / ground transport", train: "Haramain train", ziyarah: "Ziyarah", partner: "Travel partnership", trade: "Import / export", general: "General enquiry" }
    },
    fr: {
      wa_hello: "Bonjour AL MANARAH GLOBAL SERVICES, je souhaite des informations sur : ",
      opened: "WhatsApp s’est ouvert avec votre demande. Elle N’EST PAS envoyée tant que vous n’appuyez pas sur Envoyer dans WhatsApp. Si WhatsApp ne s’est pas ouvert, utilisez « Envoyer par e-mail » ou appelez le +225 05 06 12 23 37.",
      mail_opened: "Votre messagerie s’est ouverte avec votre demande. Elle N’EST PAS envoyée tant que vous n’appuyez pas sur Envoyer. Si rien ne s’est ouvert, écrivez à almanarahglobalservices@gmail.com.",
      fix: "Veuillez corriger les champs signalés.",
      sending: "Envoi en cours…",
      sent: "Merci — votre demande a bien été reçue. Nous vous répondrons par WhatsApp, téléphone ou e-mail.",
      failed: "Désolé, votre demande n’a pas pu être envoyée. Rien n’a été transmis. Réessayez ou contactez-nous sur WhatsApp.",
      spam: "Votre demande n’a pas pu être traitée.",
      captcha: "Veuillez compléter la vérification de sécurité.",
      ref_label: "Votre numéro de référence :",
      ref_keep: "Conservez ce numéro — utilisez-le sur la page Suivi ou lorsque vous nous contactez.",
      continue_wa: "Continuer sur WhatsApp",
      track_bad: "Veuillez vérifier votre numéro de référence et votre téléphone.",
      track_none: "Aucun dossier ne correspond à cette référence et à ce numéro. Vérifiez et réessayez, ou contactez-nous sur WhatsApp.",
      track_limit: "Trop de tentatives. Veuillez patienter 15 minutes.",
      track_off: "Le suivi en ligne n’est pas encore actif. Contactez-nous sur WhatsApp avec votre référence.",
      t_status: "Statut actuel", t_payment: "Paiement", t_updated: "Dernière mise à jour", t_note: "Message de notre équipe", t_progress: "Avancement de la réservation",
      subject: "Demande depuis le site",
      partner: "Partenariat voyage",
      services: { umrah: "Forfait Omra", hajj: "Accompagnement Hajj", visa: "Visa saoudien", flights: "Vols", hotels: "Hôtels La Mecque / Médine", transfer: "Transferts / transport", train: "Train Haramain", ziyarah: "Ziyarah", partner: "Partenariat agence", trade: "Import / export", general: "Demande générale" }
    }
  };

  function swap(el, attr, prop, toFr) {
    var key = "en" + attr;
    if (el.dataset[key] === undefined) el.dataset[key] = prop === "html" ? el.innerHTML : (prop === "text" ? el.textContent : el.getAttribute(prop) || "");
    var frKey = "fr" + attr;
    var val = toFr ? el.dataset[frKey] : el.dataset[key];
    if (prop === "html") el.innerHTML = val; else if (prop === "text") el.textContent = val; else el.setAttribute(prop, val);
  }
  function applyLang(l) {
    lang = l === "fr" ? "fr" : "en";
    var fr = lang === "fr";
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-fr]").forEach(function (el) {
      if (el.tagName === "META") swap(el, "", "content", fr); else swap(el, "", "text", fr);
    });
    document.querySelectorAll("[data-fr-html]").forEach(function (el) { swap(el, "Html", "html", fr); });
    document.querySelectorAll("[data-fr-placeholder]").forEach(function (el) { swap(el, "Placeholder", "placeholder", fr); });
    document.querySelectorAll("[data-fr-alt]").forEach(function (el) { swap(el, "Alt", "alt", fr); });
    document.querySelectorAll("[data-setlang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.setlang === lang)); });
    var og = document.querySelector('meta[property="og:locale"]'); if (og) og.content = fr ? "fr_FR" : "en_GB";
    store.set("lang", lang);
    updateWaLinks();
  }
  // data-fr="" on attribute-based swaps must not wipe text: dataset keys are frPlaceholder etc.
  // (data-fr-placeholder -> dataset.frPlaceholder; data-fr -> dataset.fr)

  /* ---------- WhatsApp links ---------- */
  function waUrl(num, text) { return "https://wa.me/" + num + "?text=" + encodeURIComponent(text); }
  function updateWaLinks() {
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      var svc = a.dataset.wa;
      var label = T[lang].services[svc] || T[lang].services.general;
      a.href = waUrl(a.dataset.waNumber || MAIN, T[lang].wa_hello + label + ".");
    });
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    var burger = document.querySelector(".burger"), menu = document.getElementById("menu"), header = document.querySelector(".header");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        burger.setAttribute("aria-expanded", String(open));
        burger.textContent = open ? "✕" : "☰";
      });
      menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.textContent = "☰"; }); });
    }
    if (header) {
      var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 10); };
      window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    }
    // Active section highlight
    var links = menu ? Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]')) : [];
    if ("IntersectionObserver" in window && links.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id); });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      links.forEach(function (l) { var s = document.querySelector(l.getAttribute("href")); if (s) io.observe(s); });
    }
  }

  /* ---------- Reveal animation ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Missing images: show brand gradient instead of a broken icon ---------- */
  function initImages() {
    document.querySelectorAll("img").forEach(function (img) {
      var fail = function () { if (img.parentElement) img.parentElement.classList.add("img-missing"); };
      if (img.complete && img.naturalWidth === 0 && img.src) fail(); else img.addEventListener("error", fail);
    });
  }

  /* ---------- Service-specific enquiry routing ---------- */
  var svcSelect;
  function showFieldsets() {
    if (!svcSelect) return;
    var v = svcSelect.value;
    document.querySelectorAll("#enquiryForm fieldset.svc").forEach(function (fs) {
      var on = fs.dataset.for.split(" ").indexOf(v) > -1;
      fs.classList.toggle("show", on);
      fs.disabled = !on; // disabled fieldsets are excluded from the message
    });
  }
  function selectService(svc, pkg) {
    if (svc === "partner") { var p = document.getElementById("partners"); if (p) p.scrollIntoView(); return; }
    if (!svcSelect) return;
    svcSelect.value = svc || "general";
    showFieldsets();
    if (pkg) { var ps = document.getElementById("u_pkg"); if (ps) ps.value = pkg; }
  }
  function initRouting() {
    svcSelect = document.getElementById("f_service");
    if (svcSelect) svcSelect.addEventListener("change", showFieldsets);
    document.querySelectorAll("[data-enquire]").forEach(function (a) {
      a.addEventListener("click", function () { selectService(a.dataset.enquire, a.dataset.package); });
    });
    var q = new URLSearchParams(location.search);
    if (q.get("service")) selectService(q.get("service"), q.get("package"));
    showFieldsets();
  }

  /* ---------- Forms ---------- */
  var PHONE_RE = /^\+?[0-9\s().-]{7,20}$/, EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validate(form) {
    var ok = true, first = null;
    form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("invalid"); });
    form.querySelectorAll("input,select,textarea").forEach(function (el) {
      if (el.disabled || el.closest(".hp") || el.closest("fieldset:disabled")) return;
      var v = (el.type === "checkbox") ? el.checked : el.value.trim();
      var bad = false;
      if (el.required && !v) bad = true;
      if (!bad && el.type === "tel" && v && !PHONE_RE.test(v)) bad = true;
      if (!bad && el.type === "email" && v && !EMAIL_RE.test(v)) bad = true;
      if (!bad && el.name === "message" && el.required && v.length < 10) bad = true;
      if (bad) { ok = false; var f = el.closest(".field"); if (f) f.classList.add("invalid"); if (!first) first = el; }
    });
    if (first) first.focus();
    return ok;
  }
  function labelFor(el) {
    var l = el.id && document.querySelector('label[for="' + el.id + '"]');
    return l ? l.textContent.replace("*", "").trim() : el.name;
  }
  function collect(form) {
    var lines = [], data = {};
    form.querySelectorAll("input,select,textarea").forEach(function (el) {
      if (el.disabled || el.closest(".hp") || el.closest("fieldset:disabled") || el.name === "consent") return;
      if (el.type === "checkbox") { if (el.checked) { (data[el.name] = data[el.name] || []).push(el.value); } return; }
      var v = el.value.trim(); if (!v) return;
      if (el.tagName === "SELECT" && el.selectedIndex > -1) v = el.options[el.selectedIndex].textContent.trim();
      data[el.name] = el.tagName === "SELECT" ? el.value : v;
      lines.push(labelFor(el) + ": " + v);
    });
    if (data.interests) lines.push((lang === "fr" ? "Services" : "Services of interest") + ": " + data.interests.join(", "));
    return { lines: lines, data: data };
  }
  function setStatus(form, cls, msg) {
    var s = form.querySelector(".status"); if (!s) return;
    s.className = "status show " + cls; s.textContent = msg;
  }
  function initForms() {
    if (!CFG.formEndpoint) document.querySelectorAll("[data-needs-crm]").forEach(function (e) { e.hidden = true; });
    document.querySelectorAll("form[data-formtype]").forEach(function (form) {
      if (CFG.formEndpoint) { // CRM connected: one submit button that stores the enquiry and returns a reference
        var em = form.querySelector('[data-channel="email"]'); if (em) em.remove();
        var wb = form.querySelector('[data-channel="whatsapp"]');
        if (wb) { wb.className = "btn btn-primary"; wb.innerHTML = ""; var sp = document.createElement("span");
          sp.textContent = form.dataset.formtype === "partner" ? "Submit application" : "Submit enquiry";
          sp.setAttribute("data-fr", form.dataset.formtype === "partner" ? "Envoyer la candidature" : "Envoyer la demande"); wb.appendChild(sp); }
      }
      var lastChannel = "whatsapp";
      form.querySelectorAll("[data-channel]").forEach(function (b) { b.addEventListener("click", function () { lastChannel = b.dataset.channel; }); });
      form.querySelectorAll("input,select,textarea").forEach(function (el) {
        el.addEventListener("input", function () { var f = el.closest(".field"); if (f) f.classList.remove("invalid"); });
      });
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (form.querySelector('.hp input').value) { setStatus(form, "error", T[lang].spam); return; } // honeypot
        if (!validate(form)) { setStatus(form, "error", T[lang].fix); return; }
        var c = collect(form), type = form.dataset.formtype;
        var title = type === "partner" ? T[lang].partner : (T[lang].services[c.data.service] || T[lang].subject);
        var body = T[lang].wa_hello + title + "\n\n" + c.lines.join("\n");

        if (CFG.formEndpoint) { return postToBackend(form, type, c.data, body); }

        if (lastChannel === "email") {
          location.href = "mailto:" + (CFG.email || "almanarahglobalservices@gmail.com") + "?subject=" + encodeURIComponent(T[lang].subject + " — " + title) + "&body=" + encodeURIComponent(body);
          setStatus(form, "info", T[lang].mail_opened);
        } else {
          var w = window.open(waUrl(MAIN, body), "_blank", "noopener");
          if (!w) location.href = waUrl(MAIN, body);
          setStatus(form, "info", T[lang].opened);
        }
      });
    });
  }
  function api(payload) {
    // text/plain avoids a CORS preflight, which Google Apps Script cannot answer.
    return fetch(CFG.formEndpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), redirect: "follow" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }
  function token(form) { var t = form.querySelector('[name="cf-turnstile-response"]'); return t ? t.value : ""; }
  function resetCaptcha() { if (window.turnstile) try { window.turnstile.reset(); } catch (e) {} }
  function postToBackend(form, type, data, body) {
    if (CFG.turnstileSiteKey && !token(form)) { setStatus(form, "error", T[lang].captcha); return; }
    var btns = form.querySelectorAll("button[type=submit]"); btns.forEach(function (b) { b.disabled = true; });
    setStatus(form, "info", T[lang].sending);
    data.action = type; data.language = lang; data.page = location.pathname; data.turnstile_token = token(form);
    data.website = form.querySelector(".hp input").value;
    api(data).then(function (res) {
      if (!res || !res.ok || !res.ref) throw new Error((res && res.error) || "failed");
      var s = form.querySelector(".status");
      s.className = "status show ok"; s.textContent = "";
      var p1 = document.createElement("p"); p1.style.margin = "0"; p1.textContent = T[lang].sent; s.appendChild(p1);
      var box = document.createElement("div"); box.className = "ref-box";
      var lab = document.createElement("span"); lab.textContent = T[lang].ref_label;
      var code = document.createElement("code"); code.textContent = res.ref;
      var wa = document.createElement("a"); wa.className = "btn btn-wa btn-sm"; wa.target = "_blank"; wa.rel = "noopener";
      wa.href = waUrl(MAIN, "[" + res.ref + "] " + body); wa.textContent = T[lang].continue_wa;
      box.appendChild(lab); box.appendChild(code); box.appendChild(wa); s.appendChild(box);
      var p2 = document.createElement("p"); p2.className = "note"; p2.style.margin = "10px 0 0"; p2.textContent = T[lang].ref_keep; s.appendChild(p2);
      form.reset(); showFieldsets();
    }).catch(function () { setStatus(form, "error", T[lang].failed); })
      .then(function () { btns.forEach(function (b) { b.disabled = false; }); resetCaptcha(); });
  }

  /* ---------- Tracking page ---------- */
  var REF_RE = /^AMG-\d{6}-[A-Z0-9]{6}$/;
  var STEP_LABELS = {
    en: { documents: "Documents", visa: "Visa", flight: "Flight", hotel: "Hotel", transport: "Transport" },
    fr: { documents: "Documents", visa: "Visa", flight: "Vol", hotel: "Hôtel", transport: "Transport" } };
  var STATE = { done: ["done", { en: "Confirmed", fr: "Confirmé" }], doing: ["doing", { en: "In progress", fr: "En cours" }],
    todo: ["todo", { en: "Not started", fr: "Pas commencé" }], na: ["na", { en: "Not included", fr: "Non inclus" }] };
  function initTrack() {
    var form = document.getElementById("trackForm"), out = document.getElementById("trackResult");
    if (!form) return;
    var q = new URLSearchParams(location.search); if (q.get("ref")) form.ref.value = q.get("ref").toUpperCase();
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      form.ref.value = form.ref.value.trim().toUpperCase();
      var okRef = REF_RE.test(form.ref.value), okPhone = PHONE_RE.test(form.phone.value.trim());
      form.ref.closest(".field").classList.toggle("invalid", !okRef);
      form.phone.closest(".field").classList.toggle("invalid", !okPhone);
      if (!okRef || !okPhone) { setStatus(form, "error", T[lang].track_bad); return; }
      if (!CFG.formEndpoint) { setStatus(form, "info", T[lang].track_off); return; }
      if (CFG.turnstileSiteKey && !token(form)) { setStatus(form, "error", T[lang].captcha); return; }
      setStatus(form, "info", T[lang].sending.replace("Sending", "Checking").replace("Envoi en cours", "Vérification"));
      api({ action: "track", ref: form.ref.value, phone: form.phone.value.trim(), turnstile_token: token(form) })
        .then(function (r) {
          if (r && r.error === "rate_limited") return setStatus(form, "error", T[lang].track_limit);
          if (!r || !r.ok) return setStatus(form, "error", T[lang].track_none);
          form.querySelector(".status").className = "status";
          render(out, r.file);
        }).catch(function () { setStatus(form, "error", T[lang].failed); }).then(resetCaptcha);
    });
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function render(out, f) {
    var L = T[lang], panel = el("div", "panel");
    panel.appendChild(el("p", "note", f.ref));
    panel.appendChild(el("h3", "", (f.service && (L.services[f.service] || f.service)) || ""));
    var st = el("p"); st.appendChild(el("b", "", L.t_status + " ")); st.appendChild(el("span", "badge-status", (f.status_label && f.status_label[lang]) || f.status)); panel.appendChild(st);
    if (f.payment_label) { var pay = el("p"); pay.appendChild(el("b", "", L.t_payment + ": ")); pay.appendChild(document.createTextNode(f.payment_label[lang] || "")); panel.appendChild(pay); }
    panel.appendChild(el("h4", "", L.t_progress));
    var ul = el("ul", "timeline");
    ["documents", "visa", "flight", "hotel", "transport"].forEach(function (k) {
      var v = (f.progress || {})[k] || "todo", s = STATE[v] || STATE.todo, li = el("li");
      li.appendChild(el("span", "", STEP_LABELS[lang][k])); li.appendChild(el("span", "st " + s[0], s[1][lang])); ul.appendChild(li);
    });
    panel.appendChild(ul);
    if (f.note) { var n = el("div", "secure-note"); n.style.marginTop = "16px"; n.appendChild(el("b", "", L.t_note + ": ")); n.appendChild(document.createTextNode(f.note)); panel.appendChild(n); }
    if (f.updated) panel.appendChild(el("p", "note", L.t_updated + ": " + f.updated));
    out.innerHTML = ""; out.appendChild(panel); out.classList.add("in");
  }
  function initTurnstile() {
    if (!CFG.formEndpoint || !CFG.turnstileSiteKey) return;
    document.querySelectorAll(".cf-turnstile-slot").forEach(function (slot) {
      var d = document.createElement("div"); d.className = "cf-turnstile"; d.dataset.sitekey = CFG.turnstileSiteKey; slot.appendChild(d);
    });
    var s = document.createElement("script"); s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"; s.async = true; s.defer = true; document.head.appendChild(s);
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var grid = document.getElementById("galleryGrid"), lb = document.getElementById("lightbox");
    if (!grid || !lb) return;
    var all = Array.prototype.slice.call(grid.querySelectorAll("button")), items = all, idx = 0, lastFocus;
    var img = lb.querySelector("img"), cap = lb.querySelector("p");
    // Category filter
    document.querySelectorAll("[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        all.forEach(function (it) { it.hidden = !(f === "all" || it.dataset.cat === f); });
      });
    });
    function visible() { return all.filter(function (it) { return !it.hidden; }); }
    function show(i) {
      idx = (i + items.length) % items.length;
      var t = items[idx].querySelector("img"), fc = items[idx].querySelector("figcaption");
      img.src = items[idx].dataset.full || t.getAttribute("src"); img.alt = t.alt; cap.textContent = fc ? fc.textContent : "";
    }
    function open(el) { items = visible(); lastFocus = document.activeElement; show(items.indexOf(el)); lb.classList.add("open"); document.body.style.overflow = "hidden"; lb.querySelector(".lb-close").focus(); }
    function close() { lb.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
    all.forEach(function (b) { b.addEventListener("click", function () { open(b); }); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".year").forEach(function (y) { y.textContent = new Date().getFullYear(); });
    var q = new URLSearchParams(location.search).get("lang");
    var initial = q || store.get("lang") || ((navigator.language || "").toLowerCase().indexOf("fr") === 0 ? "fr" : "en");
    document.querySelectorAll("[data-setlang]").forEach(function (b) { b.addEventListener("click", function () { applyLang(b.dataset.setlang); }); });
    initNav(); initReveal(); initImages(); initRouting(); initForms(); initLightbox(); initTrack(); initTurnstile();
    applyLang(initial);
  });
})();
