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
    refreshBasket();
    renderPromo();
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
      form.reset(); showFieldsets(); bSet([]);
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

  /* ---------- Extras: icons, dropdown fields, search, theme, basket ---------- */
  var WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';
  var SVG_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + WA_PATH + '"/></svg>';
  var SVG_TT = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.37-2.48V9.66a5.730 5.730 0 0 0-.79-.05A5.68 5.68 0 0 0 4.17 15.3 5.68 5.68 0 0 0 9.86 21a5.68 5.68 0 0 0 5.68-5.68V9.01a7.35 7.35 0 0 0 4.29 1.37V7.3a4.3 4.3 0 0 1-3.23-1.48z"/></svg>';
  var SVG_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  var SVG_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var SVG_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';
  var SVG_BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
  function tx(en, fr) { return lang === "fr" ? fr : en; }
  function mk(tag, attrs, html) { var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }

  // 1. WhatsApp icon beside every phone number, TikTok icon beside TikTok links
  function initIcons() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      if (a.closest(".wa-line")) return;
      var num = a.getAttribute("href").replace(/[^0-9]/g, "");
      var wrap = mk("span", { "class": "wa-line" });
      var ico = mk("a", { "class": "wa-ico", href: "https://wa.me/" + num, target: "_blank", rel: "noopener", "aria-label": "WhatsApp +" + num }, SVG_WA);
      a.parentNode.insertBefore(wrap, a); wrap.appendChild(ico); wrap.appendChild(a);
    });
    document.querySelectorAll('a[href*="tiktok.com"]').forEach(function (a) {
      if (a.querySelector(".tt-ico")) return;
      var s = mk("span", { "class": "tt-ico" }, SVG_TT); a.insertBefore(s, a.firstChild); a.classList.add("tt-link");
    });
  }

  // 2. Replace typed fields with ready-made choices
  var COUNTRIES = [["Côte d'Ivoire","Côte d’Ivoire"],["Nigeria","Nigéria"],["Saudi Arabia","Arabie saoudite"],["Ghana","Ghana"],["Senegal","Sénégal"],["Mali","Mali"],["Burkina Faso","Burkina Faso"],["Guinea","Guinée"],["Niger","Niger"],["Benin","Bénin"],["Togo","Togo"],["Cameroon","Cameroun"],["Chad","Tchad"],["Liberia","Libéria"],["Sierra Leone","Sierra Leone"],["Gambia","Gambie"],["Guinea-Bissau","Guinée-Bissau"],["Mauritania","Mauritanie"],["Morocco","Maroc"],["Algeria","Algérie"],["Tunisia","Tunisie"],["Egypt","Égypte"],["Sudan","Soudan"],["Ethiopia","Éthiopie"],["Kenya","Kenya"],["Tanzania","Tanzanie"],["Uganda","Ouganda"],["Somalia","Somalie"],["South Africa","Afrique du Sud"],["DR Congo","RD Congo"],["Congo","Congo"],["Gabon","Gabon"],["Central African Republic","Centrafrique"],["United Arab Emirates","Émirats arabes unis"],["Qatar","Qatar"],["Kuwait","Koweït"],["Oman","Oman"],["Bahrain","Bahreïn"],["Jordan","Jordanie"],["Turkey","Turquie"],["United Kingdom","Royaume-Uni"],["France","France"],["Belgium","Belgique"],["Italy","Italie"],["Spain","Espagne"],["Germany","Allemagne"],["United States","États-Unis"],["Canada","Canada"],["Other","Autre"]];
  var CITIES = [["Abidjan","Abidjan"],["Bouaké","Bouaké"],["Lagos","Lagos"],["Abuja","Abuja"],["Kano","Kano"],["Ilorin","Ilorin"],["Kaduna","Kaduna"],["Accra","Accra"],["Dakar","Dakar"],["Bamako","Bamako"],["Ouagadougou","Ouagadougou"],["Conakry","Conakry"],["Niamey","Niamey"],["Cotonou","Cotonou"],["Lomé","Lomé"],["Douala","Douala"],["Yaoundé","Yaoundé"],["N'Djamena","N’Djamena"],["Other","Autre"]];
  function people(max) { var o = []; for (var i = 1; i <= max; i++) o.push([i + (i === 1 ? " person" : " people"), i + (i === 1 ? " personne" : " personnes")]); o.push(["More than " + max, "Plus de " + max]); return o; }
  function nums(max) { var o = []; for (var i = 1; i <= max; i++) o.push([String(i), String(i)]); o.push([max + "+", max + "+"]); return o; }
  var CHOICES = {
    f_country: COUNTRIES, p_country: COUNTRIES, h_nat: COUNTRIES, v_nat: COUNTRIES,
    u_city: CITIES, fl_from: CITIES,
    u_nights: [["7","7"],["10","10"],["14","14"],["15","15"],["21","21"],["30","30"],["Other","Autre"]],
    u_pax: people(10), fl_pax: people(10), t_pax: people(10),
    h_pax: nums(10), v_pax: nums(10),
    h_year: [["2027","2027"],["2028","2028"],["2029","2029"],["2030","2030"]],
    ho_rooms: [["1 room · 1–2 people","1 chambre · 1–2 personnes"],["1 room · 3–4 people","1 chambre · 3–4 personnes"],["2 rooms","2 chambres"],["3 rooms","3 chambres"],["4 rooms or more (group)","4 chambres ou plus (groupe)"]],
    t_route: [["Jeddah Airport → Makkah","Aéroport de Djeddah → La Mecque"],["Madinah Airport → Madinah","Aéroport de Médine → Médine"],["Makkah → Madinah","La Mecque → Médine"],["Madinah → Makkah","Médine → La Mecque"],["Makkah → Jeddah Airport","La Mecque → Aéroport de Djeddah"],["Madinah → Jeddah Airport","Médine → Aéroport de Djeddah"],["Ziyarah tour in Makkah","Ziyarah à La Mecque"],["Ziyarah tour in Madinah","Ziyarah à Médine"],["Full programme (all transfers)","Programme complet (tous les transferts)"],["Other","Autre"]],
    tr_budget: [["Under $1,000","Moins de 1 000 $"],["$1,000 – $5,000","1 000 – 5 000 $"],["$5,000 – $20,000","5 000 – 20 000 $"],["Over $20,000","Plus de 20 000 $"],["To be discussed","À discuter"]]
  };
  function initChoices() {
    Object.keys(CHOICES).forEach(function (id) {
      var inp = document.getElementById(id);
      if (!inp || inp.tagName !== "INPUT") return;
      var sel = document.createElement("select");
      sel.id = inp.id; sel.name = inp.name; if (inp.required) sel.required = true;
      var first = mk("option", { value: "", "data-fr": "Sélectionner" }); first.textContent = "Select"; sel.appendChild(first);
      CHOICES[id].forEach(function (c) { var o = mk("option", { value: c[0], "data-fr": c[1] }); o.textContent = c[0]; sel.appendChild(o); });
      if (id === "f_country") sel.value = "Côte d'Ivoire";
      inp.parentNode.replaceChild(sel, inp);
      sel.addEventListener("change", function () { var f = sel.closest(".field"); if (f) f.classList.remove("invalid"); });
    });
  }

  // 3. Search
  var PAGES = [
    ["index.html", "Home", "Accueil", "home accueil al manarah global services umrah hajj travel voyage"],
    ["umrah.html", "Umrah packages", "Forfaits Omra", "umrah omra package forfait essential essentiel comfort confort premium makkah madinah price prix"],
    ["hajj.html", "Hajj guidance", "Accompagnement Hajj", "hajj guidance accompagnement registration inscription"],
    ["visas.html", "Saudi visas", "Visas saoudiens", "visa saudi saoudien umrah tourist touristique family business evisa documents passport passeport"],
    ["services.html", "All services", "Tous les services", "services flights vols hotels hôtels transfer transfert transport train haramain ziyarah import export trade commerce"],
    ["services.html#travel", "Flight reservations", "Réservation de vols", "flight flights vol vols plane avion ticket billet jeddah médine"],
    ["hotels.html", "Hotels in Makkah / Madinah", "Hôtels La Mecque / Médine", "hotel hotels hôtel makkah madinah mecque médine room chambre"],
    ["contact.html?service=transfer", "Transfers & ground transport", "Transferts et transport", "transfer transport car voiture bus airport aéroport"],
    ["contact.html?service=train", "Haramain train", "Train Haramain", "train haramain railway"],
    ["contact.html?service=ziyarah", "Ziyarah", "Ziyarah", "ziyarah visit visite tour"],
    ["partners.html", "Agency partnership", "Partenariat agences", "partner partenaire agency agence representative représentant commission"],
    ["experiences.html", "Pilgrim experiences & photos", "Expériences et photos", "photos gallery galerie experiences témoignages testimonials pilgrims pèlerins"],
    ["about.html", "About us", "À propos", "about propos company société abidjan cac registration"],
    ["contact.html", "Contact & quotation", "Contact et devis", "contact quotation devis enquiry demande phone téléphone whatsapp email address adresse"],
    ["track.html", "Track my booking", "Suivre mon dossier", "track suivi reference référence booking réservation status statut"],
    ["terms.html", "Terms, cancellation & refunds", "Conditions, annulation et remboursement", "terms conditions cancellation annulation refund remboursement"],
    ["privacy.html", "Privacy policy", "Confidentialité", "privacy confidentialité data données"]
  ];
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function initSearch(actions) {
    var btn = mk("button", { type: "button", "class": "icon-btn", "aria-label": "Search / Rechercher" }, SVG_SEARCH);
    actions.insertBefore(btn, actions.firstChild);
    var ov = mk("div", { "class": "search-ov", role: "dialog", "aria-modal": "true", hidden: "" });
    ov.innerHTML = '<div class="search-box"><div class="search-row">' + SVG_SEARCH + '<input type="search" autocomplete="off"><button type="button" class="search-x" aria-label="Close">✕</button></div><div class="search-res"></div></div>';
    document.body.appendChild(ov);
    var inp = ov.querySelector("input"), res = ov.querySelector(".search-res");
    function draw() {
      var q = norm(inp.value.trim()), words = q.split(/\s+/).filter(Boolean);
      var hits = PAGES.filter(function (p) { var hay = norm(p[1] + " " + p[2] + " " + p[3]); return words.every(function (w) { return hay.indexOf(w) > -1; }); });
      if (!words.length) hits = PAGES.slice(0, 8);
      res.innerHTML = "";
      if (!hits.length) { res.appendChild(mk("p", { "class": "search-none" })).textContent = tx("No result. Try “Umrah”, “visa”, “hotel”…", "Aucun résultat. Essayez « Omra », « visa », « hôtel »…"); return; }
      hits.forEach(function (p) { var a = mk("a", { href: p[0] }); a.textContent = tx(p[1], p[2]); res.appendChild(a); });
    }
    function open() { ov.hidden = false; inp.placeholder = tx("Search the site…", "Rechercher sur le site…"); inp.value = ""; draw(); setTimeout(function () { inp.focus(); }, 30); }
    function close() { ov.hidden = true; }
    btn.addEventListener("click", open);
    ov.querySelector(".search-x").addEventListener("click", close);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    inp.addEventListener("input", draw);
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { var a = res.querySelector("a"); if (a) location.href = a.href; } if (e.key === "Escape") close(); });
  }

  // 4. Day / night mode
  function initTheme(actions) {
    var btn = mk("button", { type: "button", "class": "icon-btn", "aria-label": "Day / night mode" });
    function set(t) { document.documentElement.setAttribute("data-theme", t); btn.innerHTML = t === "dark" ? SVG_SUN : SVG_MOON; store.set("theme", t); }
    set(store.get("theme") === "dark" ? "dark" : "light");
    btn.addEventListener("click", function () { set(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"); });
    actions.insertBefore(btn, actions.firstChild.nextSibling);
  }

  // 5. Basket
  var basketMem = null;
  function bGet() { try { var v = JSON.parse(localStorage.getItem("basket") || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return basketMem || []; } }
  function bSet(v) { basketMem = v; try { localStorage.setItem("basket", JSON.stringify(v)); } catch (e) {} refreshBasket(); }
  var bCount, bPanel;
  function itemName(it) { return lang === "fr" ? (it.fr || it.en) : it.en; }
  function refreshBasket() {
    var items = bGet();
    if (bCount) { bCount.textContent = items.length; bCount.hidden = !items.length; }
    document.querySelectorAll(".add-basket").forEach(function (b) {
      var inB = items.some(function (it) { return it.id === b.dataset.id; });
      b.classList.toggle("added", inB);
      b.querySelector("span").textContent = inB ? tx("In basket ✓", "Dans le panier ✓") : tx("Add to basket", "Ajouter au panier");
    });
    if (bPanel) {
      var list = bPanel.querySelector(".bk-list"); list.innerHTML = "";
      bPanel.querySelector("h3").textContent = tx("My basket", "Mon panier");
      if (!items.length) list.appendChild(mk("p", { "class": "note" })).textContent = tx("Your basket is empty. Press “Add to basket” on any service or package.", "Votre panier est vide. Appuyez sur « Ajouter au panier » sur un service ou un forfait.");
      items.forEach(function (it, i) {
        var row = mk("div", { "class": "bk-item" }); row.appendChild(mk("span")).textContent = itemName(it);
        var rm = mk("button", { type: "button", "aria-label": "Remove" }, "✕"); rm.addEventListener("click", function () { var v = bGet(); v.splice(i, 1); bSet(v); });
        row.appendChild(rm); list.appendChild(row);
      });
      var go = bPanel.querySelector(".bk-go"); go.textContent = tx("Request a quotation", "Demander un devis"); go.hidden = !items.length;
      var cl = bPanel.querySelector(".bk-clear"); cl.textContent = tx("Empty basket", "Vider le panier"); cl.hidden = !items.length;
    }
    fillBasketField();
  }
  function fillBasketField() {
    var box = document.getElementById("basketBox"); if (!box) return;
    var items = bGet(), f = document.getElementById("f_basket");
    box.hidden = !items.length;
    box.querySelector("b").textContent = tx("Your selection:", "Votre sélection :");
    box.querySelector("span").textContent = items.map(itemName).join(" · ");
    f.value = items.map(itemName).join("; ");
  }
  function initBasket(actions) {
    var btn = mk("button", { type: "button", "class": "icon-btn bk-btn", "aria-label": "Basket / Panier" }, SVG_BAG + '<b class="bk-count" hidden>0</b>');
    actions.insertBefore(btn, actions.querySelector(".lang"));
    bCount = btn.querySelector(".bk-count");
    bPanel = mk("aside", { "class": "bk-panel", hidden: "" });
    bPanel.innerHTML = '<div class="bk-head"><h3></h3><button type="button" class="bk-x" aria-label="Close">✕</button></div><div class="bk-list"></div><a class="btn btn-primary bk-go" href="contact.html?basket=1"></a><button type="button" class="bk-clear"></button>';
    document.body.appendChild(bPanel);
    btn.addEventListener("click", function () { bPanel.hidden = !bPanel.hidden; });
    bPanel.querySelector(".bk-x").addEventListener("click", function () { bPanel.hidden = true; });
    bPanel.querySelector(".bk-clear").addEventListener("click", function () { bSet([]); });
    // "Add to basket" on every service card and package
    document.querySelectorAll("a[data-enquire]").forEach(function (a) {
      var card = a.closest(".card, .pkg"); if (!card || card.querySelector(".add-basket")) return;
      var h = card.querySelector("h3"); if (!h) return;
      var en = h.dataset.en || h.textContent.trim(), fr = h.dataset.fr || en;
      var id = a.dataset.enquire + "|" + (a.dataset.package || en);
      var b = mk("button", { type: "button", "class": "btn btn-outline btn-sm add-basket", "data-id": id }, SVG_BAG + "<span></span>");
      b.addEventListener("click", function () {
        var v = bGet(), i = -1; v.forEach(function (it, k) { if (it.id === id) i = k; });
        if (i > -1) v.splice(i, 1); else v.push({ id: id, svc: a.dataset.enquire, pkg: a.dataset.package || "", en: en, fr: fr });
        bSet(v); if (i < 0) { btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump"); }
      });
      a.parentNode.insertBefore(b, a.nextSibling);
    });
    // Contact form: show the selection and send it with the enquiry
    var form = document.getElementById("enquiryForm");
    if (form) {
      var grid = form.querySelector(".fgrid");
      var box = mk("div", { "class": "field full basket-box", id: "basketBox", hidden: "" }, '<label for="f_basket" class="visually-hidden">Basket</label><div>' + SVG_BAG + '<b></b> <span></span></div><input type="hidden" id="f_basket" name="basket">');
      grid.insertBefore(box, grid.firstChild);
      var items = bGet();
      if (items.length && new URLSearchParams(location.search).get("basket")) {
        var s = document.getElementById("f_service");
        if (s && !s.value) { s.value = items.length === 1 ? items[0].svc : "general"; s.dispatchEvent(new Event("change")); }
        var ps = document.getElementById("u_pkg"); if (ps && items.length === 1 && items[0].pkg) ps.value = items[0].pkg;
      }
    }
  }

  /* ---------- Promotion (settings in config.js → promo) ---------- */
  function fmtPrice(n) { return lang === "fr" ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function promoDays(P) { return Math.ceil((new Date(P.departure + "T00:00:00") - new Date()) / 86400000); }
  function promoActive(P) { return P && P.on && new Date() < new Date((P.endsOn || P.departure) + "T00:00:00"); }
  function promoText(P) {
    var d = promoDays(P), fr = lang === "fr";
    return {
      title: fr ? P.titleFr : P.title,
      dates: fr ? P.datesFr : P.dates,
      from: fr ? P.fromFr : P.from,
      price: fmtPrice(P.price) + " " + P.currency + (fr ? " / personne" : " per person"),
      count: d > 1 ? (fr ? "Départ dans " + d + " jours" : "Departure in " + d + " days") : (fr ? "Départ imminent" : "Departing soon"),
      badge: fr ? "Offre spéciale" : "Special offer",
      book: fr ? "Réserver maintenant" : "Book now",
      now: fr ? "est disponible !" : "is now available!",
      add: fr ? "Ajouter au panier" : "Add to basket"
    };
  }
  function promoItem(P) { return { id: "umrah|promo-" + P.id, svc: "umrah", pkg: "", en: P.title + " (" + P.dates + ") — " + String(P.price).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + P.currency + " per person", fr: P.titleFr + " (" + P.datesFr + ") — " + String(P.price).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + P.currency + " / personne" }; }
  function promoAddToBasket(P) { var v = bGet(), it = promoItem(P); if (!v.some(function (x) { return x.id === it.id; })) { v.push(it); bSet(v); } }
  var promoEls = [];
  function renderPromo() {
    var P = CFG.promo, t = promoActive(P) ? promoText(P) : null;
    promoEls.forEach(function (fn) { fn(t); });
  }
  function initPromo() {
    var P = CFG.promo; if (!promoActive(P)) return;
    var link = "contact.html?service=umrah&promo=" + P.id;
    // Top announcement bar
    var bar = mk("div", { "class": "promo-bar" });
    bar.innerHTML = '<div class="container"><span class="pb-dot"></span><span class="pb-t"></span><a class="pb-btn" href="' + link + '"></a></div>';
    document.body.insertBefore(bar, document.querySelector(".topbar") || document.body.firstChild);
    promoEls.push(function (t) { bar.querySelector(".pb-t").innerHTML = "<b>" + t.title + "</b><span class=\"pb-x\"> " + t.now + " · " + t.dates + "</span> · <b>" + t.price + "</b><span class=\"pb-x\"> · " + t.count + "</span>"; bar.querySelector(".pb-btn").textContent = t.book + " →"; });
    // Floating card
    var closed = false; try { closed = sessionStorage.getItem("promoClosed") === P.id; } catch (e) {}
    var fl = mk("aside", { "class": "promo-float", "aria-label": "Offer" });
    fl.innerHTML = '<button type="button" class="pf-x" aria-label="Close">✕</button><span class="pf-badge"></span><h4 class="pf-title"></h4><p class="pf-dates"></p><p class="pf-price"></p><p class="pf-count"></p><div class="pf-actions"><a class="btn btn-gold btn-sm pf-book" href="' + link + '"></a><button type="button" class="btn btn-outline btn-sm pf-add"></button></div>';
    document.body.appendChild(fl);
    if (!closed) setTimeout(function () { fl.classList.add("show"); }, 2500);
    fl.querySelector(".pf-x").addEventListener("click", function () { fl.classList.remove("show"); try { sessionStorage.setItem("promoClosed", P.id); } catch (e) {} });
    fl.querySelector(".pf-add").addEventListener("click", function () { promoAddToBasket(P); var b = document.querySelector(".bk-btn"); if (b) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); } });
    fl.querySelector(".pf-book").addEventListener("click", function () { promoAddToBasket(P); });
    promoEls.push(function (t) {
      fl.querySelector(".pf-badge").textContent = "★ " + t.badge; fl.querySelector(".pf-title").textContent = t.title;
      fl.querySelector(".pf-dates").textContent = t.dates + " · " + t.from; fl.querySelector(".pf-price").textContent = t.price;
      fl.querySelector(".pf-count").textContent = t.count; fl.querySelector(".pf-book").textContent = t.book; fl.querySelector(".pf-add").textContent = t.add;
    });
    // Big offer block on Home and Umrah pages
    var page = document.body.dataset.page;
    if (page === "index" || page === "umrah") {
      var first = document.querySelector("#main > section");
      var sec = mk("section", { "class": "promo-sec" });
      sec.innerHTML = '<div class="container"><div class="promo-box"><div><span class="pf-badge"></span><h2 class="ps-title"></h2><p class="ps-sub"></p><div class="ps-facts"><span class="ps-dates"></span><span class="ps-from"></span></div></div><div class="ps-right"><p class="ps-price"></p><p class="ps-count"></p><a class="btn btn-gold ps-book" href="' + link + '"></a></div></div></div>';
      if (first && first.parentNode) first.parentNode.insertBefore(sec, first.nextSibling);
      sec.querySelector(".ps-book").addEventListener("click", function () { promoAddToBasket(P); });
      promoEls.push(function (t) {
        sec.querySelector(".pf-badge").textContent = "★ " + t.badge; sec.querySelector(".ps-title").textContent = t.title + " " + t.now;
        sec.querySelector(".ps-sub").textContent = lang === "fr" ? "Places limitées. Visa, vols, hôtels et transferts pris en charge — réservez tôt." : "Limited places. Visa, flights, hotels and transfers handled for you — book early.";
        sec.querySelector(".ps-dates").textContent = "🗓 " + t.dates; sec.querySelector(".ps-from").textContent = "✈ " + t.from;
        sec.querySelector(".ps-price").textContent = t.price; sec.querySelector(".ps-count").textContent = t.count; sec.querySelector(".ps-book").textContent = t.book;
      });
    }
    // Arriving from an offer link: put the offer in the basket
    if (new URLSearchParams(location.search).get("promo") === P.id) promoAddToBasket(P);
  }

  /* ---------- Coming soon announcement (Home + Umrah pages) ---------- */
  function initSoon() {
    var page = document.body.dataset.page;
    if (page !== "index" && page !== "umrah") return;
    var item = { id: "umrah|ramadan2027", svc: "umrah", pkg: "", en: "Ramadan Umrah 2027 — please keep me updated", fr: "Omra du Ramadan 2027 — tenez-moi informé(e)" };
    var sec = mk("section", { "class": "soon-sec" });
    sec.innerHTML = '<div class="container"><div class="soon-box"><span class="soon-ribbon"></span><div class="soon-icon">☾</div><div class="soon-text"><h3></h3><p></p></div><div class="soon-actions"><a class="btn btn-wa btn-sm soon-wa" target="_blank" rel="noopener">' + SVG_WA + '<span></span></a><a class="btn btn-outline btn-sm soon-reg" href="contact.html?service=umrah&basket=1"></a></div></div></div>';
    var after = document.querySelector(".promo-sec") || document.querySelector("#main > section");
    if (after && after.parentNode) after.parentNode.insertBefore(sec, after.nextSibling);
    sec.querySelector(".soon-reg").addEventListener("click", function () { var v = bGet(); if (!v.some(function (x) { return x.id === item.id; })) { v.push(item); bSet(v); } });
    promoEls.push(function () {
      var fr = lang === "fr";
      sec.querySelector(".soon-ribbon").textContent = fr ? "Bientôt disponible" : "Coming soon";
      sec.querySelector("h3").textContent = fr ? "Omra du Ramadan 2027" : "Ramadan Umrah 2027";
      sec.querySelector("p").textContent = fr ? "Les dates, le programme et les prix seront publiés très bientôt. Inscrivez-vous pour être informé(e) en premier." : "Dates, programme and prices will be published very soon. Register now to be the first to know.";
      sec.querySelector(".soon-wa span").textContent = fr ? "M’informer sur WhatsApp" : "Keep me updated on WhatsApp";
      sec.querySelector(".soon-wa").href = waUrl(MAIN, fr ? "Bonjour AL MANARAH GLOBAL SERVICES, merci de me tenir informé(e) de l’Omra du Ramadan 2027." : "Hello AL MANARAH GLOBAL SERVICES, please keep me updated about the Ramadan Umrah 2027.");
      sec.querySelector(".soon-reg").textContent = fr ? "Enregistrer mon intérêt" : "Register my interest";
    });
  }

  /* ---------- Hotel booking builder (hotels.html) ---------- */
  var HOTELS = {
    makkah: {
      5: [["Fairmont Makkah Clock Royal Tower", "Abraj Al Bait · facing the Haram", "Abraj Al Bait · face au Haram"], ["Raffles Makkah Palace", "Abraj Al Bait · next to the Haram", "Abraj Al Bait · à côté du Haram"], ["Swissôtel Makkah", "Abraj Al Bait · next to the Haram", "Abraj Al Bait · à côté du Haram"], ["Swissôtel Al Maqam Makkah", "Abraj Al Bait · next to the Haram", "Abraj Al Bait · à côté du Haram"], ["Pullman ZamZam Makkah", "Abraj Al Bait · next to the Haram", "Abraj Al Bait · à côté du Haram"], ["Mövenpick Hajar Tower Makkah", "Abraj Al Bait · next to the Haram", "Abraj Al Bait · à côté du Haram"], ["Hilton Suites Makkah", "Facing the Haram", "Face au Haram"], ["Conrad Makkah", "Jabal Omar · opposite King Fahd Gate", "Jabal Omar · face à la porte du Roi Fahd"], ["Jabal Omar Hyatt Regency Makkah", "Jabal Omar · walking distance", "Jabal Omar · à pied"], ["Jabal Omar Marriott Hotel Makkah", "Jabal Omar · walking distance", "Jabal Omar · à pied"], ["Jumeirah Jabal Omar Makkah", "Jabal Omar · walking distance", "Jabal Omar · à pied"]],
      4: [["DoubleTree by Hilton Makkah Jabal Omar", "Jabal Omar · near the Haram", "Jabal Omar · près du Haram"], ["Elaf Kinda Hotel", "Central Makkah", "Centre de La Mecque"], ["Le Méridien Towers Makkah", "Kudai · shuttle to the Haram", "Kudai · navette vers le Haram"], ["voco Makkah", "1.3 km · free shuttle", "1,3 km · navette gratuite"], ["Courtyard by Marriott Makkah", "3.3 km from the Haram", "3,3 km du Haram"], ["Ramada by Wyndham Makkah Zad Al Rawda", "5 km · shuttle", "5 km · navette"], ["Novotel Makkah Thakher City", "Thakher City · shuttle", "Thakher City · navette"], ["Mercure Makkah Hotel", "Quiet district · shuttle", "Quartier calme · navette"], ["Wirgan Hotel Al Azizyah", "Aziziyah · shuttle", "Aziziyah · navette"], ["Park Inn by Radisson Makkah Thakher Alsharqi", "Thakher · shuttle", "Thakher · navette"]],
      3: [["Al Kiswah Towers Hotel", "Kudai · shuttle", "Kudai · navette"], ["Saja Hotels Makkah", "Misfalah · 4 min by car", "Misfalah · 4 min en voiture"], ["Worth Elite Hotel", "Misfalah · near the Haram", "Misfalah · près du Haram"], ["ibis Styles Makkah", "Aziziyah · 24h free shuttle", "Aziziyah · navette 24h/24"], ["Al Joud Hotel Makkah", "Third Ring Road", "Troisième périphérique"], ["Emaar Al Khalil", "About 3 km · shuttle", "Environ 3 km · navette"], ["Elaf Qinwan Hotel", "Makkah", "La Mecque"], ["Al Rayyan Makiya Towers Hotel", "Aziziyah", "Aziziyah"], ["Nada Al Deafah Hotel", "Al Hajlah", "Al Hajlah"], ["Qasr Al Sahab Hotel Makkah", "Makkah", "La Mecque"], ["Hibatullah Hotel Makkah", "Makkah", "La Mecque"], ["Mira Al Rawda", "Ar Rawdah · 5 km", "Ar Rawdah · 5 km"]],
      2: [["Elaf Ajyad Hotel", "Ajyad · central", "Ajyad · centre"], ["Al Shahba Hotel Makkah", "Umm Al Qura Road · near the Haram", "Route Umm Al Qura · près du Haram"], ["Emaar Andalusia", "Al Hajlah", "Al Hajlah"], ["Osturat Emaar Hotel", "Makkah", "La Mecque"], ["Snood Al Houda Hotel", "Makkah", "La Mecque"]]
    },
    madinah: {
      5: [["The Oberoi Madina", "Next to the Prophet's Mosque", "À côté de la Mosquée du Prophète"], ["Dar Al Eiman Al Haram", "Steps from the main gate", "À quelques pas de la porte principale"], ["Anwar Al Madinah Mövenpick", "Next to the mosque", "À côté de la mosquée"], ["Pullman ZamZam Madinah", "Near the mosque", "Près de la mosquée"], ["Dar Al Taqwa Hotel", "Next to the mosque", "À côté de la mosquée"], ["Madinah Hilton", "Near the mosque", "Près de la mosquée"], ["InterContinental Dar Al Iman", "Near the mosque", "Près de la mosquée"], ["Sofitel Shahd Al Madinah", "Metres from the mosque", "À quelques mètres de la mosquée"], ["Shaza Regency Plaza", "Walking distance", "À pied"], ["Maden Hotel", "About 160 m", "Environ 160 m"], ["Crowne Plaza Madinah", "Near the mosque", "Près de la mosquée"]],
      4: [["Al Manakha Rotana Madinah", "In front of the mosque", "Face à la mosquée"], ["Emaar Elite Madinah", "Facing the Haram courtyards", "Face aux esplanades du Haram"], ["Novotel Madinah", "About 120 m", "Environ 120 m"], ["Saja Al Madinah", "About 300 m", "Environ 300 m"], ["Millennium Taiba Hotel", "10 min walk", "10 min à pied"], ["Elaf Al Taqwa Hotel", "Quba Street · near the mosque", "Rue Quba · près de la mosquée"], ["Nusk Al Hijrah Hotel", "A few hundred metres", "À quelques centaines de mètres"], ["Waqf Outhman Bin Affan Hotel", "City centre", "Centre-ville"], ["Marriott Executive Apartments Madinah", "King Abdullah Road · 4.4 km", "Route du Roi Abdallah · 4,4 km"]],
      3: [["Durrat Al Eiman Hotel", "About 150 m", "Environ 150 m"], ["Rua Al Hijrah Hotel", "4 min walk", "4 min à pied"], ["Taiba Front Hotel", "Few minutes' walk", "Quelques minutes à pied"], ["New Madinah Hotel", "10 min walk", "10 min à pied"], ["Zaha Al Munawara Hotel", "About 800 m", "Environ 800 m"], ["Emaar Royal Hotel Al Madina", "15 min walk", "15 min à pied"], ["Hotel Taba Al Salam", "15 min walk", "15 min à pied"], ["Season Star Hotel Madinah", "City centre", "Centre-ville"], ["Mysk Al Balad", "Central Madinah", "Centre de Médine"], ["Al Mukhtara International Hotel", "4 min by car", "4 min en voiture"]],
      2: [["Jayden Hotel", "Under 1 km", "Moins de 1 km"], ["coov hotel", "Madinah", "Médine"], ["Zaha Taiba Hotel", "Madinah", "Médine"], ["Jiwar Al Madina Hotel", "Madinah", "Médine"], ["Wardh Rahiq Hotel", "Madinah", "Médine"], ["Madinah Deluxe Hotel", "Madinah", "Médine"], ["Almaghreby Hotel 2", "Qurban · 5 min by car", "Qurban · 5 min en voiture"], ["Al Eairy Apartments Madinah 9", "Furnished apartments", "Appartements meublés"]]
    }
  };
  var HB = { city: "both", nMak: 5, nMed: 4, date: "", stars: 4, hMak: "", hMed: "", oMak: "", oMed: "", dist: "walk", room: "Double", rooms: 1, adults: 2, kids: 0, meals: "bb", budget: "" };
  function initNavHotels() {
    var menu = document.getElementById("menu");
    if (menu && !menu.querySelector('[data-nav="hotels"]')) {
      var u = menu.querySelector('[data-nav="umrah"]');
      var a = mk("a", { href: "hotels.html", "data-nav": "hotels", "data-fr": "Hôtels" }); a.textContent = "Hotels";
      if (document.body.dataset.page === "hotels") { a.className = "active"; a.setAttribute("aria-current", "page"); }
      if (u) u.parentNode.insertBefore(a, u.nextSibling); else menu.appendChild(a);
    }
    document.querySelectorAll('a[href="contact.html?service=hotels"]').forEach(function (l) { l.href = "hotels.html"; });
  }
  function hbText() {
    var fr = lang === "fr", L = [];
    var cityName = { makkah: fr ? "La Mecque" : "Makkah", madinah: fr ? "Médine" : "Madinah" };
    var rec = fr ? "hôtel à choisir" : "hotel not chosen yet", oth = fr ? "autre hôtel (à préciser par téléphone)" : "another hotel (to discuss by phone)";
    function hn(v, city, typed) { if (v === "Other") return typed ? typed + (fr ? " (non listé)" : " (not listed)") : oth; if (!v) return rec; var a = (HOTELS[city][HB.stars] || []).filter(function (h) { return h[0] === v; })[0]; return v + (a ? " (" + (fr ? a[2] : a[1]) + ")" : ""); }
    var distT = { closest: fr ? "Le plus proche du Haram" : "Closest to the Haram", walk: fr ? "À distance de marche" : "Walking distance", shuttle: fr ? "Avec navette (économique)" : "With shuttle (economy)" };
    var mealT = { ro: fr ? "Chambre seule" : "Room only", bb: fr ? "Petit-déjeuner" : "Breakfast", hb: fr ? "Demi-pension" : "Half board", fb: fr ? "Pension complète" : "Full board" };
    L.push((fr ? "Demande d’hôtel" : "Hotel request") + " — " + HB.stars + "★");
    if (HB.city !== "madinah") L.push(cityName.makkah + ": " + HB.nMak + (fr ? " nuits — " : " nights — ") + hn(HB.hMak, "makkah", HB.oMak));
    if (HB.city !== "makkah") L.push(cityName.madinah + ": " + HB.nMed + (fr ? " nuits — " : " nights — ") + hn(HB.hMed, "madinah", HB.oMed));
    L.push((fr ? "Arrivée" : "Check-in") + ": " + (HB.date || (fr ? "à confirmer" : "to be confirmed")));
    L.push((fr ? "Chambres" : "Rooms") + ": " + HB.rooms + " × " + HB.room + " · " + HB.adults + (fr ? " adulte(s)" : " adult(s)") + (HB.kids ? ", " + HB.kids + (fr ? " enfant(s)" : " child(ren)") : ""));
    L.push((fr ? "Repas" : "Meals") + ": " + mealT[HB.meals]);
    if (HB.budget) L.push((fr ? "Budget" : "Budget") + ": " + HB.budget);
    return L.join("\n");
  }
  function initHotels() {
    var box = document.getElementById("hotelBuilder"); if (!box) return;
    var form = document.getElementById("hotelForm"), sum = document.getElementById("h_summary");
    var today = new Date(); today.setDate(today.getDate() + 3);
    var minDate = today.toISOString().slice(0, 10);
    function chips(key, opts) {
      return '<div class="hb-chips">' + opts.map(function (o) { return '<button type="button" class="hb-chip' + (String(HB[key]) === String(o[0]) ? " on" : "") + '" data-k="' + key + '" data-v="' + o[0] + '">' + o[1] + "</button>"; }).join("") + "</div>";
    }
    function stepper(key, min, max) { var a = ' data-s="' + key + '" data-min="' + min + '" data-max="' + max + '"'; return '<div class="hb-step"><button type="button"' + a + ' data-d="-1" aria-label="-">−</button><b>' + HB[key] + '</b><button type="button"' + a + ' data-d="1" aria-label="+">+</button></div>'; }
    function hotelList(city) {
      var fr = lang === "fr", key = city === "makkah" ? "hMak" : "hMed";
      var title = city === "makkah" ? (fr ? "Hôtel à La Mecque" : "Hotel in Makkah") : (fr ? "Hôtel à Médine" : "Hotel in Madinah");
      var stars = "★".repeat(HB.stars), other = fr ? "Un autre hôtel (non listé)" : "Another hotel (not listed)";
      var html = '<div class="hb-q"><h4>' + title + " · " + stars + '</h4><div class="hb-hotels">';
      HOTELS[city][HB.stars].forEach(function (h) { html += '<button type="button" class="hb-hotel' + (HB[key] === h[0] ? " on" : "") + '" data-h="' + key + '" data-v="' + h[0] + '"><span class="hb-stars">' + stars + "</span>" + h[0] + "<small>" + (fr ? h[2] : h[1]) + "</small></button>"; });
      html += '<button type="button" class="hb-hotel hb-other' + (HB[key] === "Other" ? " on" : "") + '" data-h="' + key + '" data-v="Other">' + other + "<small>" + (fr ? "Écrivez le nom ci-dessous" : "Type the name below") + "</small></button>";
      if (HB[key] === "Other") { var ok = city === "makkah" ? "oMak" : "oMed"; html += '<input type="text" class="hb-otherin" data-o="' + ok + '" value="' + String(HB[ok]).replace(/"/g, "&quot;") + '" placeholder="' + (fr ? "Nom de l’hôtel souhaité" : "Name of the hotel you want") + '">'; }
      html += "</div></div>";
      return html;
    }
    function render() {
      var fr = lang === "fr";
      var html = "<h3>" + (fr ? "Réservez votre hôtel" : "Book your hotel") + "</h3>";
      html += '<div class="hb-q"><h4>1. ' + (fr ? "Ville" : "City") + "</h4>" + chips("city", [["makkah", fr ? "La Mecque" : "Makkah"], ["madinah", fr ? "Médine" : "Madinah"], ["both", fr ? "Les deux" : "Both"]]) + "</div>";
      html += '<div class="hb-q"><h4>2. ' + (fr ? "Nombre de nuits" : "Number of nights") + '</h4><div class="hb-row">';
      if (HB.city !== "madinah") html += "<div><small>" + (fr ? "La Mecque" : "Makkah") + "</small>" + stepper("nMak", 1, 30) + "</div>";
      if (HB.city !== "makkah") html += "<div><small>" + (fr ? "Médine" : "Madinah") + "</small>" + stepper("nMed", 1, 30) + "</div>";
      html += '<div><small>' + (fr ? "Date d’arrivée" : "Check-in date") + '</small><input type="date" class="hb-date" min="' + minDate + '" value="' + HB.date + '"></div></div></div>';
      html += '<div class="hb-q"><h4>3. ' + (fr ? "Catégorie" : "Hotel category") + "</h4>" + chips("stars", [[2, "★★"], [3, "★★★"], [4, "★★★★"], [5, "★★★★★"]]) + "</div>";
      html += '<div class="hb-q hb-num"><h4>4. ' + (fr ? "Choisissez l’hôtel" : "Choose the hotel") + "</h4>";
      if (HB.city !== "madinah") html += hotelList("makkah");
      if (HB.city !== "makkah") html += hotelList("madinah");
      html += '<p class="note">' + (fr ? "Catégories selon les principaux sites de réservation. Disponibilité et prix confirmés dans votre devis." : "Star categories as listed on major booking sites. Availability and price are confirmed in your quotation.") + "</p>";
      html += "</div>";
      html += '<div class="hb-q"><h4>5. ' + (fr ? "Chambres et voyageurs" : "Rooms & guests") + "</h4>" + chips("room", [["Double", "Double"], ["Triple", "Triple"], ["Quad", fr ? "Quadruple" : "Quad"], ["Suite", fr ? "Suite familiale" : "Family suite"]]);
      html += '<div class="hb-row"><div><small>' + (fr ? "Chambres" : "Rooms") + "</small>" + stepper("rooms", 1, 20) + "</div><div><small>" + (fr ? "Adultes" : "Adults") + "</small>" + stepper("adults", 1, 60) + "</div><div><small>" + (fr ? "Enfants" : "Children") + "</small>" + stepper("kids", 0, 20) + "</div></div></div>";
      html += '<div class="hb-q"><h4>6. ' + (fr ? "Repas" : "Meals") + "</h4>" + chips("meals", [["ro", fr ? "Chambre seule" : "Room only"], ["bb", fr ? "Petit-déj." : "Breakfast"], ["hb", fr ? "Demi-pension" : "Half board"], ["fb", fr ? "Pension complète" : "Full board"]]) + "</div>";
      box.innerHTML = html;
      sum.value = hbText();
    }
    box.addEventListener("click", function (e) {
      var c = e.target.closest(".hb-chip"), s = e.target.closest("[data-s]"), h = e.target.closest(".hb-hotel");
      if (c) { var k = c.dataset.k, v = c.dataset.v; HB[k] = (k === "stars") ? +v : v; if (k === "stars") { HB.hMak = ""; HB.hMed = ""; } }
      else if (s) { var key = s.dataset.s; HB[key] = Math.min(+s.dataset.max, Math.max(+s.dataset.min, HB[key] + (+s.dataset.d))); }
      else if (h) { HB[h.dataset.h] = h.dataset.v; }
      else return;
      render();
    });
    box.addEventListener("change", function (e) { if (e.target.classList.contains("hb-date")) { HB.date = e.target.value; sum.value = hbText(); } });
    box.addEventListener("input", function (e) { var o = e.target.dataset && e.target.dataset.o; if (o) { HB[o] = e.target.value.slice(0, 80); sum.value = hbText(); } });
    promoEls.push(function () {
      render();
      if (CFG.formEndpoint) { var b = form.querySelector('button[type="submit"] span'); if (b) { b.textContent = lang === "fr" ? "Demander mon devis" : "Request my quotation"; b.setAttribute("data-fr", "Demander mon devis"); } }
    });
    render();
  }

  /* ---------- Country dialling code in front of every phone field ---------- */
  var DIAL = [["CI","Côte d'Ivoire","Côte d’Ivoire","225"],["NG","Nigeria","Nigéria","234"],["SA","Saudi Arabia","Arabie saoudite","966"],["GH","Ghana","Ghana","233"],["SN","Senegal","Sénégal","221"],["ML","Mali","Mali","223"],["BF","Burkina Faso","Burkina Faso","226"],["GN","Guinea","Guinée","224"],["NE","Niger","Niger","227"],["BJ","Benin","Bénin","229"],["TG","Togo","Togo","228"],["CM","Cameroon","Cameroun","237"],["TD","Chad","Tchad","235"],["LR","Liberia","Libéria","231"],["SL","Sierra Leone","Sierra Leone","232"],["GM","Gambia","Gambie","220"],["GW","Guinea-Bissau","Guinée-Bissau","245"],["MR","Mauritania","Mauritanie","222"],["MA","Morocco","Maroc","212"],["DZ","Algeria","Algérie","213"],["TN","Tunisia","Tunisie","216"],["EG","Egypt","Égypte","20"],["SD","Sudan","Soudan","249"],["ET","Ethiopia","Éthiopie","251"],["KE","Kenya","Kenya","254"],["TZ","Tanzania","Tanzanie","255"],["UG","Uganda","Ouganda","256"],["SO","Somalia","Somalie","252"],["ZA","South Africa","Afrique du Sud","27"],["CD","DR Congo","RD Congo","243"],["CG","Congo","Congo","242"],["GA","Gabon","Gabon","241"],["CF","Central African Republic","Centrafrique","236"],["AE","United Arab Emirates","Émirats arabes unis","971"],["QA","Qatar","Qatar","974"],["KW","Kuwait","Koweït","965"],["OM","Oman","Oman","968"],["BH","Bahrain","Bahreïn","973"],["JO","Jordan","Jordanie","962"],["TR","Turkey","Turquie","90"],["GB","United Kingdom","Royaume-Uni","44"],["FR","France","France","33"],["BE","Belgium","Belgique","32"],["IT","Italy","Italie","39"],["ES","Spain","Espagne","34"],["DE","Germany","Allemagne","49"],["US","United States","États-Unis","1"],["CA","Canada","Canada","1"]];
  function flag(iso) { return String.fromCodePoint(127397 + iso.charCodeAt(0), 127397 + iso.charCodeAt(1)); }
  function fullPhone(sel, inp) {
    var v = inp.value.trim(); if (!v || v.charAt(0) === "+") return;
    v = v.replace(/^00/, "");
    if (sel.value !== "225") v = v.replace(/^0/, "");
    inp.value = "+" + sel.value + " " + v;
  }
  function initPhones() {
    document.querySelectorAll('form input[type="tel"]').forEach(function (inp) {
      if (inp.parentNode.classList.contains("phone-row")) return;
      var sel = document.createElement("select");
      sel.className = "cc"; sel.setAttribute("aria-label", "Country code / Indicatif");
      DIAL.forEach(function (d) { var o = mk("option", { value: d[3], "data-iso": d[0], "data-fr": flag(d[0]) + " +" + d[3] + " " + d[2] }); o.textContent = flag(d[0]) + " +" + d[3] + " " + d[1]; sel.appendChild(o); });
      var row = mk("div", { "class": "phone-row" });
      inp.parentNode.insertBefore(row, inp); row.appendChild(sel); row.appendChild(inp);
      inp.placeholder = "05 06 12 23 37";
      var form = inp.form;
      form.querySelectorAll('button[type="submit"]').forEach(function (b) { b.addEventListener("click", function () { fullPhone(sel, inp); }); });
      form.addEventListener("submit", function () { fullPhone(sel, inp); }, true);
      var country = form.querySelector('select[name="country"]');
      if (country) country.addEventListener("change", function () {
        var m = DIAL.filter(function (d) { return d[1] === country.value; })[0];
        if (m && !inp.value.trim()) sel.value = m[3];
      });
    });
  }

  /* ---------- Visa application builder (visas.html) ---------- */
  var VB = { nat: "CI", other: "no", type: "Umrah", checked: false, ticket: "no", hotel: "no", pax: 1, date: "" };
  var EVISA = ["GB", "FR", "BE", "IT", "ES", "DE", "US", "CA", "ZA"], GCC = ["AE", "QA", "KW", "OM", "BH"];
  function visaElig() {
    var fr = lang === "fr", n = VB.nat;
    if (n === "SA") return [fr ? "Aucun visa nécessaire" : "No visa needed", fr ? "Les citoyens saoudiens n’ont pas besoin de visa." : "Saudi citizens do not need a visa."];
    if (GCC.indexOf(n) > -1) return [fr ? "Aucun visa nécessaire" : "No visa needed", fr ? "Les citoyens du CCG entrent en Arabie saoudite sans visa. Nous pouvons organiser votre voyage." : "GCC citizens enter Saudi Arabia without a visa. We can still arrange your trip."];
    if (VB.type === "Family visit") return [fr ? "Sur invitation" : "Invitation required", fr ? "Le visa de visite familiale nécessite une invitation d’un membre de la famille résidant en Arabie saoudite. Nous préparons le dossier." : "The family visit visa needs an invitation from a family member living in Saudi Arabia. We prepare the file."];
    if (VB.type === "Business") return [fr ? "Sur invitation" : "Invitation required", fr ? "Le visa d’affaires nécessite une invitation d’une entreprise saoudienne. Nous préparons le dossier." : "The business visa needs an invitation from a Saudi company. We prepare the file."];
    if (EVISA.indexOf(n) > -1) return [fr ? "Éligible au e-Visa" : "eVisa eligible", fr ? "Votre nationalité peut obtenir le e-Visa touristique en ligne, qui permet aussi l’Omra (hors saison du Hajj). Nous faisons la demande pour vous." : "Your nationality can get the tourist eVisa online, which also allows Umrah (outside the Hajj season). We apply for you."];
    if (VB.other === "yes") return [fr ? "Probablement éligible au e-Visa" : "Likely eVisa eligible", fr ? "Avec un visa américain, britannique ou Schengen valide et déjà utilisé, vous pouvez obtenir le e-Visa ou un visa à l’arrivée. Nous vérifions et faisons la demande." : "With a valid US, UK or Schengen visa that you have already used, you can get the eVisa or a visa on arrival. We check and apply for you."];
    if (VB.type === "Umrah") return [fr ? "Visa via canal agréé" : "Visa through an authorised channel", fr ? "Votre nationalité passe par un visa Omra délivré via un canal agréé, lié à votre forfait. AL MANARAH prépare et dépose la demande." : "Your nationality needs an Umrah visa issued through an authorised channel, linked to your package. AL MANARAH prepares and submits the application."];
    return [fr ? "Visa consulaire" : "Embassy visa", fr ? "Votre nationalité passe par l’ambassade ou le consulat saoudien. Nous préparons le dossier et vous guidons pour le dépôt." : "Your nationality applies through the Saudi embassy or consulate. We prepare the file and guide the submission."];
  }
  function initVisa() {
    var box = document.getElementById("visaBuilder"); if (!box) return;
    var form = document.getElementById("visaForm"), sum = document.getElementById("v_summary");
    var d0 = new Date(); d0.setDate(d0.getDate() + 3); var minDate = d0.toISOString().slice(0, 10);
    function natName(iso) { var d = DIAL.filter(function (x) { return x[0] === iso; })[0]; return d ? (lang === "fr" ? d[2] : d[1]) : iso; }
    function chips(key, opts) { return '<div class="hb-chips">' + opts.map(function (o) { return '<button type="button" class="hb-chip' + (VB[key] === o[0] ? " on" : "") + '" data-k="' + key + '" data-v="' + o[0] + '">' + o[1] + "</button>"; }).join("") + "</div>"; }
    function yn(key) { var fr = lang === "fr"; return chips(key, [["yes", fr ? "Oui" : "Yes"], ["no", fr ? "Non" : "No"]]); }
    function text() {
      var fr = lang === "fr", L = [], e = visaElig(), y = function (v) { return v === "yes" ? (fr ? "Oui" : "Yes") : (fr ? "Non" : "No"); };
      var types = { "Umrah": fr ? "Omra" : "Umrah", "Tourist": fr ? "Touristique" : "Tourist", "Family visit": fr ? "Visite familiale" : "Family visit", "Business": fr ? "Affaires" : "Business" };
      L.push((fr ? "Demande de visa — " : "Visa application — ") + types[VB.type]);
      L.push((fr ? "Nationalité" : "Nationality") + ": " + natName(VB.nat));
      L.push((fr ? "Visa US/UK/Schengen valide" : "Valid US/UK/Schengen visa") + ": " + y(VB.other));
      L.push((fr ? "Date de voyage" : "Travel date") + ": " + (VB.date || (fr ? "à confirmer" : "to be confirmed")) + " · " + (fr ? "Voyageurs" : "Travellers") + ": " + VB.pax);
      L.push((fr ? "Billet d’avion confirmé" : "Confirmed flight ticket") + ": " + y(VB.ticket) + " · " + (fr ? "Hôtel confirmé" : "Confirmed hotel") + ": " + y(VB.hotel));
      L.push((fr ? "Éligibilité (indicative)" : "Eligibility (indicative)") + ": " + e[0]);
      return L.join("\n");
    }
    function render() {
      var fr = lang === "fr", h = "<h3>" + (fr ? "Votre visa saoudien" : "Your Saudi visa") + "</h3>";
      h += '<div class="hb-q"><h4>1. ' + (fr ? "Votre nationalité" : "Your nationality") + '</h4><select class="vb-nat">' + DIAL.map(function (d) { return '<option value="' + d[0] + '"' + (VB.nat === d[0] ? " selected" : "") + ">" + flag(d[0]) + " " + (fr ? d[2] : d[1]) + "</option>"; }).join("") + "</select></div>";
      h += '<div class="hb-q"><h4>2. ' + (fr ? "Type de visa" : "Visa type") + "</h4>" + chips("type", [["Umrah", fr ? "Omra" : "Umrah"], ["Tourist", fr ? "Touristique" : "Tourist"], ["Family visit", fr ? "Visite familiale" : "Family visit"], ["Business", fr ? "Affaires" : "Business"]]) + "</div>";
      h += '<div class="hb-q"><h4>3. ' + (fr ? "Avez-vous un visa US, UK ou Schengen valide (déjà utilisé) ?" : "Do you hold a valid US, UK or Schengen visa (already used)?") + "</h4>" + yn("other") + "</div>";
      h += '<div class="hb-q"><button type="button" class="btn btn-gold btn-sm vb-check">' + (fr ? "Vérifier mon éligibilité" : "Check my eligibility") + "</button>";
      if (VB.checked) { var e = visaElig(); h += '<div class="vb-result"><b>✔ ' + e[0] + "</b><p>" + e[1] + '</p><small>' + (fr ? "Indicatif — les règles peuvent changer ; nous confirmons votre cas par écrit." : "Indicative — rules can change; we confirm your case in writing.") + "</small></div>"; }
      h += "</div>";
      h += '<div class="hb-q"><h4>4. ' + (fr ? "Votre voyage" : "Your trip") + '</h4><div class="hb-row"><div><small>' + (fr ? "Date de voyage" : "Travel date") + '</small><input type="date" class="hb-date" min="' + minDate + '" value="' + VB.date + '"></div><div><small>' + (fr ? "Voyageurs" : "Travellers") + '</small><div class="hb-step"><button type="button" data-p="-1">−</button><b>' + VB.pax + '</b><button type="button" data-p="1">+</button></div></div></div></div>';
      h += '<div class="hb-q"><h4>5. ' + (fr ? "Billet d’avion confirmé ?" : "Confirmed flight ticket?") + "</h4>" + yn("ticket") + "<h4 style=\"margin-top:12px\">" + (fr ? "Réservation d’hôtel confirmée ?" : "Confirmed hotel booking?") + "</h4>" + yn("hotel");
      if (VB.ticket === "yes" || VB.hotel === "yes") h += '<p class="note vb-up">📎 ' + (fr ? "Après l’envoi, appuyez sur « Continuer sur WhatsApp » pour joindre votre billet / réservation." : "After you apply, tap “Continue on WhatsApp” to attach your ticket / booking.") + "</p>";
      h += "</div>";
      box.innerHTML = h; sum.value = text();
    }
    box.addEventListener("click", function (ev) {
      var c = ev.target.closest(".hb-chip"), p = ev.target.closest("[data-p]");
      if (c) VB[c.dataset.k] = c.dataset.v;
      else if (p) VB.pax = Math.min(50, Math.max(1, VB.pax + (+p.dataset.p)));
      else if (ev.target.closest(".vb-check")) VB.checked = true;
      else return;
      render();
    });
    box.addEventListener("change", function (ev) {
      if (ev.target.classList.contains("vb-nat")) { VB.nat = ev.target.value; render(); var cc = form.querySelector(".cc"), d = DIAL.filter(function (x) { return x[0] === VB.nat; })[0]; var ph = form.querySelector('input[type="tel"]'); if (cc && d && ph && !ph.value.trim()) cc.value = d[3]; }
      if (ev.target.classList.contains("hb-date")) { VB.date = ev.target.value; sum.value = text(); }
    });
    promoEls.push(function () {
      render();
      if (CFG.formEndpoint) { var b = form.querySelector('button[type="submit"] span'); if (b) { b.textContent = lang === "fr" ? "Déposer ma demande" : "Apply now"; b.setAttribute("data-fr", "Déposer ma demande"); } }
    });
    render();
  }

  function initExtras() {
    var actions = document.querySelector(".nav-actions");
    var waSym = document.getElementById("i-wa"); if (waSym) waSym.innerHTML = '<path d="' + WA_PATH + '"/>';
    initIcons(); initChoices(); initPhones();
    if (actions) { initSearch(actions); initTheme(actions); initBasket(actions); }
    initPromo(); initSoon(); initNavHotels(); initHotels(); initVisa();
    refreshBasket();
    window.addEventListener("storage", function (e) { if (e.key === "basket") refreshBasket(); });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".year").forEach(function (y) { y.textContent = new Date().getFullYear(); });
    var q = new URLSearchParams(location.search).get("lang");
    var initial = q || store.get("lang") || ((navigator.language || "").toLowerCase().indexOf("fr") === 0 ? "fr" : "en");
    document.querySelectorAll("[data-setlang]").forEach(function (b) { b.addEventListener("click", function () { applyLang(b.dataset.setlang); }); });
    initNav(); initReveal(); initImages(); initRouting(); initForms(); initLightbox(); initTrack(); initTurnstile();
    initExtras();
    applyLang(initial);
  });
})();
