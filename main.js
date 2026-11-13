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
      failed: "Sorry, your enquiry could not be sent. Nothing was submitted. Please try again or call us on +225 05 06 12 23 37.",
      spam: "Your enquiry could not be processed.",
      captcha: "Please complete the security check.",
      ref_label: "Your reference number:",
      ref_keep: "Keep this number — use it on the Track page or when you contact us.",
      continue_wa: "Continue on WhatsApp",
      track_bad: "Please check your reference number and phone number.",
      track_none: "No file matches this reference and phone number. Check both and try again, or call us on +225 05 06 12 23 37.",
      track_limit: "Too many attempts. Please wait 15 minutes and try again.",
      track_off: "Online tracking is not active yet. Please call us with your reference number.",
      t_status: "Current status", t_payment: "Payment", t_updated: "Last updated", t_note: "Message from our team", t_progress: "Booking progress",
      subject: "Website enquiry",
      partner: "Travel partnership",
      services: { umrah: "Umrah package", hajj: "Hajj packages", visa: "Saudi visa", flights: "Flights", hotels: "Hotels in Makkah / Madinah", transfer: "Transfers / ground transport", train: "Haramain train", ziyarah: "Ziyarah", partner: "Travel partnership", trade: "Import / export", general: "General enquiry" }
    },
    fr: {
      wa_hello: "Bonjour AL MANARAH GLOBAL SERVICES, je souhaite des informations sur : ",
      opened: "WhatsApp s’est ouvert avec votre demande. Elle N’EST PAS envoyée tant que vous n’appuyez pas sur Envoyer dans WhatsApp. Si WhatsApp ne s’est pas ouvert, utilisez « Envoyer par e-mail » ou appelez le +225 05 06 12 23 37.",
      mail_opened: "Votre messagerie s’est ouverte avec votre demande. Elle N’EST PAS envoyée tant que vous n’appuyez pas sur Envoyer. Si rien ne s’est ouvert, écrivez à almanarahglobalservices@gmail.com.",
      fix: "Veuillez corriger les champs signalés.",
      sending: "Envoi en cours…",
      sent: "Merci — votre demande a bien été reçue. Nous vous répondrons par WhatsApp, téléphone ou e-mail.",
      failed: "Désolé, votre demande n’a pas pu être envoyée. Rien n’a été transmis. Réessayez ou appelez-nous au +225 05 06 12 23 37.",
      spam: "Votre demande n’a pas pu être traitée.",
      captcha: "Veuillez compléter la vérification de sécurité.",
      ref_label: "Votre numéro de référence :",
      ref_keep: "Conservez ce numéro — utilisez-le sur la page Suivi ou lorsque vous nous contactez.",
      continue_wa: "Continuer sur WhatsApp",
      track_bad: "Veuillez vérifier votre numéro de référence et votre téléphone.",
      track_none: "Aucun dossier ne correspond à cette référence et à ce numéro. Vérifiez et réessayez, ou appelez-nous au +225 05 06 12 23 37.",
      track_limit: "Trop de tentatives. Veuillez patienter 15 minutes.",
      track_off: "Le suivi en ligne n’est pas encore actif. Appelez-nous avec votre référence.",
      t_status: "Statut actuel", t_payment: "Paiement", t_updated: "Dernière mise à jour", t_note: "Message de notre équipe", t_progress: "Avancement de la réservation",
      subject: "Demande depuis le site",
      partner: "Partenariat voyage",
      services: { umrah: "Forfait Omra", hajj: "Forfaits Hajj", visa: "Visa saoudien", flights: "Vols", hotels: "Hôtels La Mecque / Médine", transfer: "Transferts / transport", train: "Train Haramain", ziyarah: "Ziyarah", partner: "Partenariat agence", trade: "Import / export", general: "Demande générale" }
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
    if (pkg) { var ps = document.querySelector("#enquiryForm fieldset.svc.show select[name=package]"); if (ps) ps.value = pkg; }
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
      box.appendChild(lab); box.appendChild(code); s.appendChild(box);
      var p2 = document.createElement("p"); p2.className = "note"; p2.style.margin = "10px 0 0"; p2.textContent = T[lang].ref_keep; s.appendChild(p2);
      form.reset(); showFieldsets(); if (!form.hasAttribute("data-quickform")) bSet([]);
    }).catch(function () { setStatus(form, "error", T[lang].failed); })
      .then(function () { btns.forEach(function (b) { b.disabled = false; }); resetCaptcha(); });
  }


  /* ---------- Quick quote pop-up (every page) ---------- */
  function initQuick() {
    var page = document.body.dataset.page;
    var floats = document.querySelectorAll("[data-quick]");
    if (page === "contact") { floats.forEach(function (a) { a.hidden = true; }); return; }
    if (!floats.length || !CFG.formEndpoint) return;
    var SV = [["umrah","Umrah package","Forfait Omra"],["hajj","Hajj packages","Forfaits Hajj"],["visa","Saudi visa","Visa saoudien"],["flights","Flights","Vols"],["hotels","Hotels in Makkah / Madinah","Hôtels La Mecque / Médine"],["transfer","Transfers / transport","Transferts / transport"],["partner","Travel partnership","Partenariat agence"],["general","General enquiry","Demande générale"]];
    var opts = '<option value="" data-fr="Choisir un service">Choose a service</option>' + SV.map(function (o) { return '<option value="' + o[0] + '" data-fr="' + o[2] + '">' + o[1] + '</option>'; }).join("");
    var dlg = document.createElement("div");
    dlg.className = "qm"; dlg.hidden = true; dlg.setAttribute("role", "dialog"); dlg.setAttribute("aria-modal", "true"); dlg.setAttribute("aria-labelledby", "qmTitle");
    dlg.innerHTML = '<div class="qm-back" data-close></div><div class="qm-card">' +
      '<button type="button" class="qm-x" data-close aria-label="Close">×</button>' +
      '<form class="form qm-form" id="quickForm" novalidate data-formtype="enquiry" data-quickform>' +
      '<span class="kicker" data-fr="Réponse rapide">Quick reply</span>' +
      '<h3 id="qmTitle" data-fr="Demander un devis">Request a quotation</h3>' +
      '<p class="note" data-fr="Quelques détails suffisent. Nous vous recontactons avec un devis écrit.">A few details are enough. We will get back to you with a written quotation.</p>' +
      '<div class="fgrid">' +
      '<div class="field full"><label for="q_service"><span data-fr="Service">Service</span> <span class="req">*</span></label><select id="q_service" name="service" required>' + opts + '</select><span class="err" data-fr="Veuillez choisir un service.">Please choose a service.</span></div>' +
      '<div class="field full"><label for="q_name"><span data-fr="Nom complet">Full name</span> <span class="req">*</span></label><input id="q_name" name="name" required autocomplete="name"><span class="err" data-fr="Veuillez indiquer votre nom.">Please enter your name.</span></div>' +
      '<div class="field full"><label for="q_phone"><span data-fr="Téléphone">Phone</span> <span class="req">*</span></label><input id="q_phone" name="phone" type="tel" required autocomplete="tel"><span class="err" data-fr="Veuillez indiquer un numéro valide.">Please enter a valid phone number.</span></div>' +
      '<div class="field full"><label for="q_msg"><span data-fr="Votre demande">Your request</span> <span class="req">*</span></label><textarea id="q_msg" name="message" rows="3" required data-fr-placeholder="ex. 2 personnes, départ d’Abidjan en décembre" placeholder="e.g. 2 people, leaving from Abidjan in December"></textarea><span class="err" data-fr="Veuillez écrire au moins 10 caractères.">Please write at least 10 characters.</span></div>' +
      '<div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>' +
      '<div class="field full"><label class="consent"><input type="checkbox" name="consent" required> <span data-fr-html="J’accepte la <a href=\'privacy.html\'>politique de confidentialité</a>.">I agree to the <a href="privacy.html">privacy policy</a>.</span></label></div>' +
      '<div class="cf-turnstile-slot full"></div>' +
      '<div class="form-actions full"><button class="btn btn-primary" type="submit"><span data-fr="Envoyer la demande">Send my request</span></button></div>' +
      '</div><div class="status" role="status" aria-live="polite"></div></form></div>';
    document.body.appendChild(dlg);
    var last = null;
    function open(e) {
      if (e) e.preventDefault();
      last = document.activeElement; dlg.hidden = false; document.documentElement.classList.add("qm-open");
      var map = { umrah: "umrah", hajj: "hajj", visas: "visa", hotels: "hotels", partners: "partner" };
      var sel = dlg.querySelector("#q_service"); if (!sel.value && map[page]) sel.value = map[page];
      setTimeout(function () { var n = dlg.querySelector(sel.value ? "#q_name" : "#q_service"); if (n) n.focus(); }, 30);
    }
    function close() { dlg.hidden = true; document.documentElement.classList.remove("qm-open"); if (last && last.focus) last.focus(); }
    floats.forEach(function (a) { a.addEventListener("click", open); });
    // Plain "request a quotation" links open the pop-up; basket buttons (data-enquire) keep their own behaviour.
    document.querySelectorAll('a[href^="contact.html?service="]:not([data-enquire])').forEach(function (a) {
      if (/&/.test(a.getAttribute("href"))) return;
      a.addEventListener("click", function (e) { var m = (a.getAttribute("href").match(/service=(\w+)/) || [])[1]; open(e); if (m) dlg.querySelector("#q_service").value = m; });
    });
    dlg.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !dlg.hidden) close(); });
  }

  /* ---------- Tracking page ---------- */
  var REF_RE = /^AMG-\d{6}-(\d{4}|[A-Z0-9]{6})$/;
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
      // Try the full international number first, then the local forms used by older enquiries.
      var raw = form.phone.value.trim(), local = raw.replace(/^\+\d{1,4}\s*/, ""), tries = [raw];
      if (local !== raw) { tries.push(local); if (local.charAt(0) !== "0") tries.push("0" + local); }
      (function attempt(i) {
        api({ action: "track", ref: form.ref.value, phone: tries[i], turnstile_token: token(form) })
          .then(function (r) {
            if (r && r.error === "rate_limited") return setStatus(form, "error", T[lang].track_limit);
            if ((!r || !r.ok) && i + 1 < tries.length) return attempt(i + 1);
            if (!r || !r.ok) return setStatus(form, "error", T[lang].track_none);
            form.querySelector(".status").className = "status";
            render(out, r.file);
          }).catch(function () { setStatus(form, "error", T[lang].failed); }).then(resetCaptcha);
      })(0);
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
  var SVG_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>';
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
      var ico = mk("span", { "class": "ph-ico", "aria-hidden": "true" }, SVG_PHONE);
      a.parentNode.insertBefore(wrap, a); wrap.appendChild(ico); wrap.appendChild(a);
    });
    document.querySelectorAll('a[href*="tiktok.com"]').forEach(function (a) {
      if (a.querySelector(".tt-ico")) return;
      var s = mk("span", { "class": "tt-ico" }, SVG_TT); a.insertBefore(s, a.firstChild); a.classList.add("tt-link");
    });
  }

  // 2. Replace typed fields with ready-made choices
  var COUNTRIES = null;
  var CITIES = [["Abidjan","Abidjan"],["Bouaké","Bouaké"],["Lagos","Lagos"],["Abuja","Abuja"],["Kano","Kano"],["Ilorin","Ilorin"],["Kaduna","Kaduna"],["Accra","Accra"],["Dakar","Dakar"],["Bamako","Bamako"],["Ouagadougou","Ouagadougou"],["Conakry","Conakry"],["Niamey","Niamey"],["Cotonou","Cotonou"],["Lomé","Lomé"],["Douala","Douala"],["Yaoundé","Yaoundé"],["N'Djamena","N’Djamena"],["Other","Autre"]];
  function people(max) { var o = []; for (var i = 1; i <= max; i++) o.push([i + (i === 1 ? " person" : " people"), i + (i === 1 ? " personne" : " personnes")]); o.push(["More than " + max, "Plus de " + max]); return o; }
  function nums(max) { var o = []; for (var i = 1; i <= max; i++) o.push([String(i), String(i)]); o.push([max + "+", max + "+"]); return o; }
  var CHOICES = {
    f_country: "WORLD", p_country: "WORLD", h_nat: "WORLD", v_nat: "WORLD",
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
      (CHOICES[id] === "WORLD" ? DIAL.map(function (d) { return [d[1], d[2]]; }).concat([["Other", "Autre"]]) : CHOICES[id]).forEach(function (c) { var o = mk("option", { value: c[0], "data-fr": c[1] }); o.textContent = c[0]; sel.appendChild(o); });
      if (id === "f_country") sel.value = "Côte d'Ivoire";
      inp.parentNode.replaceChild(sel, inp);
      sel.addEventListener("change", function () { var f = sel.closest(".field"); if (f) f.classList.remove("invalid"); });
    });
  }

  // 3. Search
  var PAGES = [
    ["index.html", "Home", "Accueil", "home accueil al manarah global services umrah hajj travel voyage"],
    ["umrah.html", "Umrah packages", "Forfaits Omra", "umrah omra package forfait essential essentiel comfort confort premium makkah madinah price prix"],
    ["hajj.html", "Hajj packages", "Forfaits Hajj", "hajj package forfait quotation devis year année"],
    ["library.html", "Islamic library: Quran, Adhkar, Hadith", "Bibliothèque islamique : Coran, adhkar, hadiths", "library bibliothèque quran coran adhkar azkar dua hadith books livres"],
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
      count: P.endsOn ? null : (d > 1 ? (fr ? "Départ dans " + d + " jours" : "Departure in " + d + " days") : (fr ? "Départ imminent" : "Departing soon")),
      badge: P.lastPlaces ? (fr ? "Dernières places" : "Last places") : (fr ? "Offre spéciale" : "Special offer"),
      book: fr ? "Réserver maintenant" : "Book now",
      now: P.lastPlaces ? (fr ? "— dernières places !" : "— last places!") : (fr ? "est disponible !" : "is now available!"),
      closes: P.endsOn ? (fr ? "Réservations jusqu’au " : "Booking closes ") + new Date(P.endsOn + "T00:00:00").toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "long" }) : "",
      add: fr ? "Ajouter au panier" : "Add to basket"
    };
  }
  var _pt = promoText; promoText = function (P) { var t = _pt(P); if (t.count === null) t.count = t.closes; return t; };
  function promoItem(P) { return { id: "umrah|promo-" + P.id, svc: "umrah", pkg: "", en: P.title + " (" + P.dates + ") — " + String(P.price).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + P.currency + " per person", fr: P.titleFr + " (" + P.datesFr + ") — " + String(P.price).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + P.currency + " / personne" }; }
  function promoAddToBasket(P) { var v = bGet(), it = promoItem(P); if (!v.some(function (x) { return x.id === it.id; })) { v.push(it); bSet(v); } }
  var promoEls = [];
  function renderPromo() {
    var P = CFG.promo, t = promoActive(P) ? promoText(P) : null;
    promoEls.forEach(function (fn) { fn(t); });
  }
  function initPromo() {
    var P = CFG.promo;
    if (!promoActive(P)) {
      if (P && P.on && P.fullUntil && new Date() < new Date(P.fullUntil + "T00:00:00")) {
        var fb = mk("div", { "class": "promo-bar" });
        fb.innerHTML = '<div class="container"><span class="pb-dot"></span><span class="pb-t"></span><a class="pb-btn" href="contact.html?service=umrah"></a></div>';
        document.body.insertBefore(fb, document.querySelector(".topbar") || document.body.firstChild);
        promoEls.push(function () { var fr = lang === "fr"; fb.querySelector(".pb-t").innerHTML = "<b>" + (fr ? P.titleFr : P.title) + "</b> " + (fr ? "— groupe complet. Demandez notre prochaine Omra." : "— group full. Ask about our next Umrah."); fb.querySelector(".pb-btn").textContent = (fr ? "Demander un devis" : "Get a quote") + " →"; });
      }
      return;
    }
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
        sec.querySelector(".ps-sub").textContent = P.lastPlaces ? (lang === "fr" ? "Le groupe est presque complet. Visa, vols, hôtels et transferts pris en charge — réservez vite." : "The group is almost full. Visa, flights, hotels and transfers handled for you — book quickly.") : (lang === "fr" ? "Places limitées. Visa, vols, hôtels et transferts pris en charge — réservez tôt." : "Limited places. Visa, flights, hotels and transfers handled for you — book early.");
        sec.querySelector(".ps-dates").textContent = "🗓 " + t.dates; sec.querySelector(".ps-from").textContent = "✈ " + t.from;
        var pp = t.price.split(/ (?=per person|\/ personne)/), pe = sec.querySelector(".ps-price"); pe.textContent = pp[0]; if (pp[1]) { var sm = document.createElement("small"); sm.textContent = pp[1].replace(/^\/ /, ""); pe.appendChild(sm); } sec.querySelector(".ps-count").textContent = t.count; sec.querySelector(".ps-book").textContent = t.book;
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
    sec.innerHTML = '<div class="container"><div class="soon-box"><span class="soon-ribbon"></span><div class="soon-icon">☾</div><div class="soon-text"><h3></h3><p></p></div><div class="soon-actions"><a class="btn btn-primary btn-sm soon-reg" href="contact.html?service=umrah&basket=1#enquiryForm"></a></div></div></div>';
    var after = document.querySelector(".promo-sec") || document.querySelector("#main > section");
    if (after && after.parentNode) after.parentNode.insertBefore(sec, after.nextSibling);
    sec.querySelector(".soon-reg").addEventListener("click", function () { var v = bGet(); if (!v.some(function (x) { return x.id === item.id; })) { v.push(item); bSet(v); } });
    promoEls.push(function () {
      var fr = lang === "fr";
      sec.querySelector(".soon-ribbon").textContent = fr ? "Bientôt disponible" : "Coming soon";
      sec.querySelector("h3").textContent = fr ? "Omra du Ramadan 2027" : "Ramadan Umrah 2027";
      sec.querySelector("p").textContent = fr ? "Les dates, le programme et les prix seront publiés très bientôt. Inscrivez-vous pour être informé(e) en premier." : "Dates, programme and prices will be published very soon. Register now to be the first to know.";
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
    if (menu && !menu.querySelector('[data-nav="library"]')) {
      var p = menu.querySelector('[data-nav="partners"]');
      var lb = mk("a", { href: "library.html", "data-nav": "library", "data-fr": "Bibliothèque" }); lb.textContent = "Library";
      if (p) p.parentNode.insertBefore(lb, p); else menu.appendChild(lb);
    }
    var fx = document.querySelector('.footer a[href="experiences.html"]');
    if (fx && !document.querySelector('.footer a[href="library.html"]')) {
      var fl = mk("a", { href: "library.html", "data-fr": "Bibliothèque islamique" }); fl.textContent = "Islamic library";
      fx.parentNode.insertBefore(fl, fx.nextSibling);
    }
    initNavGroup(menu);
  }
  /* Services dropdown: Umrah, Hotels, Hajj, Visas under one "Services +" entry */
  function initNavGroup(menu) {
    if (!menu || menu.querySelector(".nav-drop")) return;
    var svc = menu.querySelector('[data-nav="services"]'); if (!svc) return;
    var kids = ["umrah", "hajj", "hotels", "visas"].map(function (k) { return menu.querySelector('[data-nav="' + k + '"]'); }).filter(Boolean);
    var wrap = mk("div", { "class": "nav-drop" });
    var btn = mk("button", { type: "button", "class": "nav-drop-btn", "aria-expanded": "false", "aria-controls": "navSub" });
    var label = mk("span", { "data-fr": "Services" }); label.textContent = "Services";
    var sign = mk("span", { "class": "nav-drop-sign", "aria-hidden": "true" }); sign.textContent = "+";
    btn.appendChild(label); btn.appendChild(sign);
    var sub = mk("div", { "class": "nav-sub", id: "navSub" });
    var active = svc.classList.contains("active");
    kids.forEach(function (a) { if (a.classList.contains("active")) active = true; sub.appendChild(a); });
    if (active) btn.classList.add("active");
    wrap.appendChild(btn); wrap.appendChild(sub);
    svc.parentNode.replaceChild(wrap, svc);
    function set(open) { wrap.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open)); sign.textContent = open ? "−" : "+"; }
    btn.addEventListener("click", function (e) { e.stopPropagation(); set(!wrap.classList.contains("open")); });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
    sub.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
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
  var DIAL = "AF|Afghanistan|Afghanistan|93;AL|Albania|Albanie|355;DZ|Algeria|Algérie|213;AD|Andorra|Andorre|376;AO|Angola|Angola|244;AG|Antigua and Barbuda|Antigua-et-Barbuda|1;AR|Argentina|Argentine|54;AM|Armenia|Arménie|374;AU|Australia|Australie|61;AT|Austria|Autriche|43;AZ|Azerbaijan|Azerbaïdjan|994;BS|Bahamas|Bahamas|1;BH|Bahrain|Bahreïn|973;BD|Bangladesh|Bangladesh|880;BB|Barbados|Barbade|1;BY|Belarus|Bélarus|375;BE|Belgium|Belgique|32;BZ|Belize|Belize|501;BJ|Benin|Bénin|229;BT|Bhutan|Bhoutan|975;BO|Bolivia|Bolivie|591;BA|Bosnia and Herzegovina|Bosnie-Herzégovine|387;BW|Botswana|Botswana|267;BR|Brazil|Brésil|55;BN|Brunei|Brunéi|673;BG|Bulgaria|Bulgarie|359;BF|Burkina Faso|Burkina Faso|226;BI|Burundi|Burundi|257;CV|Cabo Verde|Cap-Vert|238;KH|Cambodia|Cambodge|855;CM|Cameroon|Cameroun|237;CA|Canada|Canada|1;CF|Central African Republic|République centrafricaine|236;TD|Chad|Tchad|235;CL|Chile|Chili|56;CN|China|Chine|86;CO|Colombia|Colombie|57;KM|Comoros|Comores|269;CG|Congo|Congo|242;CK|Cook Islands|Îles Cook|682;CR|Costa Rica|Costa Rica|506;HR|Croatia|Croatie|385;CU|Cuba|Cuba|53;CY|Cyprus|Chypre|357;CZ|Czechia|Tchéquie|420;CI|Côte d'Ivoire|Côte d’Ivoire|225;CD|DR Congo|RD Congo|243;DK|Denmark|Danemark|45;DJ|Djibouti|Djibouti|253;DM|Dominica|Dominique|1;DO|Dominican Republic|République dominicaine|1;EC|Ecuador|Équateur|593;EG|Egypt|Égypte|20;SV|El Salvador|Salvador|503;GQ|Equatorial Guinea|Guinée Équatoriale|240;ER|Eritrea|Érythrée|291;EE|Estonia|Estonie|372;SZ|Eswatini|Eswatini|268;ET|Ethiopia|Éthiopie|251;FJ|Fiji|Fidji|679;FI|Finland|Finlande|358;FR|France|France|33;GA|Gabon|Gabon|241;GM|Gambia|Gambie|220;GE|Georgia|Géorgie|995;DE|Germany|Allemagne|49;GH|Ghana|Ghana|233;GR|Greece|Grèce|30;GD|Grenada|Grenade|1;GT|Guatemala|Guatemala|502;GN|Guinea|Guinée|224;GW|Guinea-Bissau|Guinée-Bissau|245;GY|Guyana|Guyana|592;HT|Haiti|Haïti|509;HN|Honduras|Honduras|504;HU|Hungary|Hongrie|36;IS|Iceland|Islande|354;IN|India|Inde|91;ID|Indonesia|Indonésie|62;IR|Iran|Iran|98;IQ|Iraq|Irak|964;IE|Ireland|Irlande|353;IL|Israel|Israël|972;IT|Italy|Italie|39;JM|Jamaica|Jamaïque|1;JP|Japan|Japon|81;JO|Jordan|Jordanie|962;KZ|Kazakhstan|Kazakhstan|7;KE|Kenya|Kenya|254;KI|Kiribati|Kiribati|686;KW|Kuwait|Koweït|965;KG|Kyrgyzstan|Kirghizistan|996;LA|Laos|Laos|856;LV|Latvia|Lettonie|371;LB|Lebanon|Liban|961;LS|Lesotho|Lesotho|266;LR|Liberia|Libéria|231;LY|Libya|Libye|218;LI|Liechtenstein|Liechtenstein|423;LT|Lithuania|Lituanie|370;LU|Luxembourg|Luxembourg|352;MG|Madagascar|Madagascar|261;MW|Malawi|Malawi|265;MY|Malaysia|Malaisie|60;MV|Maldives|Maldives|960;ML|Mali|Mali|223;MT|Malta|Malte|356;MH|Marshall Islands|Îles Marshall|692;MR|Mauritania|Mauritanie|222;MU|Mauritius|Maurice|230;MX|Mexico|Mexique|52;FM|Micronesia|Micronésie|691;MD|Moldova|Moldavie|373;MC|Monaco|Monaco|377;MN|Mongolia|Mongolie|976;ME|Montenegro|Monténégro|382;MA|Morocco|Maroc|212;MZ|Mozambique|Mozambique|258;MM|Myanmar|Birmanie|95;NA|Namibia|Namibie|264;NR|Nauru|Nauru|674;NP|Nepal|Népal|977;NL|Netherlands|Pays-Bas|31;NZ|New Zealand|Nouvelle-Zélande|64;NI|Nicaragua|Nicaragua|505;NE|Niger|Niger|227;NG|Nigeria|Nigéria|234;KP|North Korea|Corée du Nord|850;MK|North Macedonia|Macédoine du Nord|389;NO|Norway|Norvège|47;OM|Oman|Oman|968;PK|Pakistan|Pakistan|92;PW|Palau|Palaos|680;PS|Palestine|Palestine|970;PA|Panama|Panama|507;PG|Papua New Guinea|Papouasie-Nouvelle-Guinée|675;PY|Paraguay|Paraguay|595;PE|Peru|Pérou|51;PH|Philippines|Philippines|63;PL|Poland|Pologne|48;PT|Portugal|Portugal|351;QA|Qatar|Qatar|974;RO|Romania|Roumanie|40;RU|Russia|Russie|7;RW|Rwanda|Rwanda|250;KN|Saint Kitts and Nevis|Saint-Christophe-et-Niévès|1;LC|Saint Lucia|Sainte-Lucie|1;VC|Saint Vincent and the Grenadines|Saint-Vincent-et-les-Grenadines|1;WS|Samoa|Samoa|685;SM|San Marino|Saint-Marin|378;ST|Sao Tome and Principe|Sao Tomé-et-Principe|239;SA|Saudi Arabia|Arabie saoudite|966;SN|Senegal|Sénégal|221;RS|Serbia|Serbie|381;SC|Seychelles|Seychelles|248;SL|Sierra Leone|Sierra Leone|232;SG|Singapore|Singapour|65;SK|Slovakia|Slovaquie|421;SI|Slovenia|Slovénie|386;SB|Solomon Islands|Îles Salomon|677;SO|Somalia|Somalie|252;ZA|South Africa|Afrique du Sud|27;KR|South Korea|Corée du Sud|82;SS|South Sudan|Soudan du Sud|211;ES|Spain|Espagne|34;LK|Sri Lanka|Sri Lanka|94;SD|Sudan|Soudan|249;SR|Suriname|Surinam|597;SE|Sweden|Suède|46;CH|Switzerland|Suisse|41;SY|Syria|Syrie|963;TW|Taiwan|Taïwan|886;TJ|Tajikistan|Tadjikistan|992;TZ|Tanzania|Tanzanie|255;TH|Thailand|Thaïlande|66;TL|Timor-Leste|Timor oriental|670;TG|Togo|Togo|228;TO|Tonga|Tonga|676;TT|Trinidad and Tobago|Trinité-et-Tobago|1;TN|Tunisia|Tunisie|216;TR|Turkey|Turquie|90;TM|Turkmenistan|Turkménistan|993;TV|Tuvalu|Tuvalu|688;UG|Uganda|Ouganda|256;UA|Ukraine|Ukraine|380;AE|United Arab Emirates|Émirats arabes unis|971;GB|United Kingdom|Royaume-Uni|44;US|United States|États-Unis|1;UY|Uruguay|Uruguay|598;UZ|Uzbekistan|Ouzbékistan|998;VU|Vanuatu|Vanuatu|678;VE|Venezuela|Venezuela|58;VN|Vietnam|Viêt Nam|84;YE|Yemen|Yémen|967;ZM|Zambia|Zambie|260;ZW|Zimbabwe|Zimbabwe|263".split(";").map(function (x) { return x.split("|"); });
  var NO_VISA_NEEDED = "AL AD AT BE BG HR CY CZ DK EE FI FR GE DE GR HU IS IE IT LV LI LT LU MT MC ME NL NO PL PT RO RU SM SK SI ES SE CH UA GB AZ BN CN JP KZ KG MY MV SG KR TJ UZ TR BS BB CA GD PA KN US AU NZ ZA SC MU SA AE QA KW OM BH".split(" ");
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
      DIAL.forEach(function (d) { var o = mk("option", { value: d[3], "data-iso": d[0], "data-fr": "+" + d[3] + " " + d[2] }); o.textContent = "+" + d[3] + " " + d[1]; sel.appendChild(o); });
      sel.value = "225";
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
      h += '<div class="hb-q"><h4>1. ' + (fr ? "Votre nationalité" : "Your nationality") + '</h4><select class="vb-nat">' + DIAL.filter(function (d) { return NO_VISA_NEEDED.indexOf(d[0]) < 0; }).sort(function (a, b) { return (fr ? a[2] : a[1]).localeCompare(fr ? b[2] : b[1], fr ? "fr" : "en"); }).map(function (d) { return '<option value="' + d[0] + '"' + (VB.nat === d[0] ? " selected" : "") + ">" + (fr ? d[2] : d[1]) + "</option>"; }).join("") + "</select></div>";
      h += '<div class="hb-q"><h4>2. ' + (fr ? "Type de visa" : "Visa type") + "</h4>" + chips("type", [["Umrah", fr ? "Omra" : "Umrah"], ["Tourist", fr ? "Touristique" : "Tourist"], ["Family visit", fr ? "Visite familiale" : "Family visit"], ["Business", fr ? "Affaires" : "Business"]]) + "</div>";
      h += '<div class="hb-q"><h4>3. ' + (fr ? "Avez-vous un visa US, UK ou Schengen valide (déjà utilisé) ?" : "Do you hold a valid US, UK or Schengen visa (already used)?") + "</h4>" + yn("other") + "</div>";
      h += '<div class="hb-q"><button type="button" class="btn btn-gold btn-sm vb-check">' + (fr ? "Vérifier mon éligibilité" : "Check my eligibility") + "</button>";
      if (VB.checked) { var e = visaElig(); h += '<div class="vb-result"><b>✔ ' + e[0] + "</b><p>" + e[1] + '</p><small>' + (fr ? "Indicatif — les règles peuvent changer ; nous confirmons votre cas par écrit." : "Indicative — rules can change; we confirm your case in writing.") + "</small></div>"; }
      h += "</div>";
      h += '<div class="hb-q"><h4>4. ' + (fr ? "Votre voyage" : "Your trip") + '</h4><div class="hb-row"><div><small>' + (fr ? "Date de voyage" : "Travel date") + '</small><input type="date" class="hb-date" min="' + minDate + '" value="' + VB.date + '"></div><div><small>' + (fr ? "Voyageurs" : "Travellers") + '</small><div class="hb-step"><button type="button" data-p="-1">−</button><b>' + VB.pax + '</b><button type="button" data-p="1">+</button></div></div></div></div>';
      h += '<div class="hb-q"><h4>5. ' + (fr ? "Billet d’avion confirmé ?" : "Confirmed flight ticket?") + "</h4>" + yn("ticket") + "<h4 style=\"margin-top:12px\">" + (fr ? "Réservation d’hôtel confirmée ?" : "Confirmed hotel booking?") + "</h4>" + yn("hotel");
      if (VB.ticket === "yes" || VB.hotel === "yes") h += '<p class="note vb-up">📎 ' + (fr ? "Après l’envoi, nous vous contacterons pour recevoir votre billet / réservation de façon sécurisée." : "After you apply, we will contact you to collect your ticket / booking securely.") + "</p>";
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

  /* ---------- Hajj request builder (year, nationality, pilgrims) ---------- */

  // Live chat (Crisp)
  function initChat() {
    if (window.$crisp) return;
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "a1476e54-d54c-4a67-a647-eab01890d6a3";
    var lang = (document.documentElement.lang || "en").slice(0, 2);
    window.CRISP_RUNTIME_CONFIG = { locale: lang === "fr" ? "fr" : "en" };
    // load the chat only after the page is ready (keeps the site fast)
    var done = false, ev = ["scroll", "pointerdown", "keydown", "touchstart", "mousemove"];
    function go() {
      if (done) return; done = true;
      ev.forEach(function (e) { window.removeEventListener(e, go, true); });
      var s = document.createElement("script");
      s.src = "https://client.crisp.chat/l.js"; s.async = true;
      document.head.appendChild(s);
    }
    ev.forEach(function (e) { window.addEventListener(e, go, { capture: true, passive: true, once: true }); });
    if (document.readyState === "complete") setTimeout(go, 3500);
    else window.addEventListener("load", function () { setTimeout(go, 3500); });
    document.body.classList.add("has-chat");
  }

  function initHajj() {
    var box = document.getElementById("hajjBuilder"); if (!box) return;
    var form = document.getElementById("hajjForm"), sum = document.getElementById("hj_summary");
    var y0 = new Date().getFullYear() + (new Date().getMonth() >= 5 ? 1 : 0), YEARS = [y0, y0 + 1, y0 + 2];
    var HB = { year: String(y0), nat: "CI", pax: 1, level: "" };
    function natName(iso) { var d = DIAL.filter(function (x) { return x[0] === iso; })[0]; return d ? (lang === "fr" ? d[2] : d[1]) : iso; }
    function chips(key, opts) { return '<div class="hb-chips">' + opts.map(function (o) { return '<button type="button" class="hb-chip' + (HB[key] === o[0] ? " on" : "") + '" data-k="' + key + '" data-v="' + o[0] + '">' + o[1] + "</button>"; }).join("") + "</div>"; }
    function levels(fr) { return [["Essential", fr ? "Essentiel" : "Essential"], ["Comfort", fr ? "Confort" : "Comfort"], ["Premium", "Premium"]]; }
    function text() {
      var fr = lang === "fr", L = [];
      L.push((fr ? "Demande Hajj — " : "Hajj request — ") + HB.year);
      L.push((fr ? "Nationalité" : "Nationality") + ": " + natName(HB.nat));
      L.push((fr ? "Pèlerins" : "Pilgrims") + ": " + HB.pax);
      if (HB.level) L.push((fr ? "Forfait" : "Package") + ": " + levels(fr).filter(function (l) { return l[0] === HB.level; })[0][1]);
      return L.join("\n");
    }
    function render() {
      var fr = lang === "fr", h = "<h3>" + (fr ? "Votre Hajj" : "Your Hajj") + "</h3>";
      h += '<div class="hb-q"><h4>1. ' + (fr ? "Année du Hajj" : "Hajj year") + "</h4>" + chips("year", YEARS.map(function (y) { return [String(y), "Hajj " + y]; })) + "</div>";
      h += '<div class="hb-q"><h4>2. ' + (fr ? "Votre nationalité" : "Your nationality") + '</h4><select class="hj-nat">' + DIAL.slice().sort(function (a, b) { return (fr ? a[2] : a[1]).localeCompare(fr ? b[2] : b[1]); }).map(function (d) { return '<option value="' + d[0] + '"' + (d[0] === HB.nat ? " selected" : "") + ">" + (fr ? d[2] : d[1]) + "</option>"; }).join("") + "</select></div>";
      h += '<div class="hb-q"><h4>3. ' + (fr ? "Nombre de pèlerins" : "Number of pilgrims") + '</h4><div class="hb-step"><button type="button" data-p="-1">−</button><b>' + HB.pax + '</b><button type="button" data-p="1">+</button></div></div>';
      h += '<div class="hb-q"><h4>4. ' + (fr ? "Forfait souhaité (facultatif)" : "Preferred package (optional)") + "</h4>" + chips("level", levels(fr)) + "</div>";
      box.innerHTML = h; sum.value = text();
    }
    box.addEventListener("click", function (ev) {
      var c = ev.target.closest(".hb-chip"), p = ev.target.closest("[data-p]");
      if (c) HB[c.dataset.k] = (c.dataset.k === "level" && HB.level === c.dataset.v) ? "" : c.dataset.v;
      else if (p) HB.pax = Math.min(50, Math.max(1, HB.pax + (+p.dataset.p)));
      else return;
      render();
    });
    box.addEventListener("change", function (ev) { if (ev.target.classList.contains("hj-nat")) { HB.nat = ev.target.value; sum.value = text(); } });
    form.addEventListener("reset", function () { setTimeout(function () { sum.value = text(); }, 0); });
    promoEls.push(render);
    render();
  }

  /* ---------- Prayer times for the visitor's own location ---------- */
  var PT_TZ = "Europe/Andorra|AD|42.5|1.52;Asia/Dubai|AE|25.3|55.3;Asia/Kabul|AF|34.52|69.2;America/Antigua|AG|17.05|-61.8;America/Anguilla|AI|18.2|-63.07;Europe/Tirane|AL|41.33|19.83;Asia/Yerevan|AM|40.18|44.5;Africa/Luanda|AO|-8.8|13.23;Antarctica/McMurdo|AQ|-77.83|166.6;Antarctica/Casey|AQ|-66.28|110.52;Antarctica/Davis|AQ|-68.58|77.97;Antarctica/DumontDUrville|AQ|-66.67|140.02;Antarctica/Mawson|AQ|-67.6|62.88;Antarctica/Palmer|AQ|-64.8|-64.1;Antarctica/Rothera|AQ|-67.57|-68.13;Antarctica/Syowa|AQ|-69.01|39.59;Antarctica/Troll|AQ|-72.01|2.53;Antarctica/Vostok|AQ|-78.4|106.9;America/Argentina/Buenos_Aires|AR|-34.6|-58.45;America/Argentina/Cordoba|AR|-31.4|-64.18;America/Argentina/Salta|AR|-24.78|-65.42;America/Argentina/Jujuy|AR|-24.18|-65.3;America/Argentina/Tucuman|AR|-26.82|-65.22;America/Argentina/Catamarca|AR|-28.47|-65.78;America/Argentina/La_Rioja|AR|-29.43|-66.85;America/Argentina/San_Juan|AR|-31.53|-68.52;America/Argentina/Mendoza|AR|-32.88|-68.82;America/Argentina/San_Luis|AR|-33.32|-66.35;America/Argentina/Rio_Gallegos|AR|-51.63|-69.22;America/Argentina/Ushuaia|AR|-54.8|-68.3;Pacific/Pago_Pago|AS|-14.27|-170.7;Europe/Vienna|AT|48.22|16.33;Australia/Lord_Howe|AU|-31.55|159.08;Antarctica/Macquarie|AU|-54.5|158.95;Australia/Hobart|AU|-42.88|147.32;Australia/Melbourne|AU|-37.82|144.97;Australia/Sydney|AU|-33.87|151.22;Australia/Broken_Hill|AU|-31.95|141.45;Australia/Brisbane|AU|-27.47|153.03;Australia/Lindeman|AU|-20.27|149;Australia/Adelaide|AU|-34.92|138.58;Australia/Darwin|AU|-12.47|130.83;Australia/Perth|AU|-31.95|115.85;Australia/Eucla|AU|-31.72|128.87;America/Aruba|AW|12.5|-69.97;Europe/Mariehamn|AX|60.1|19.95;Asia/Baku|AZ|40.38|49.85;Europe/Sarajevo|BA|43.87|18.42;America/Barbados|BB|13.1|-59.62;Asia/Dhaka|BD|23.72|90.42;Europe/Brussels|BE|50.83|4.33;Africa/Ouagadougou|BF|12.37|-1.52;Europe/Sofia|BG|42.68|23.32;Asia/Bahrain|BH|26.38|50.58;Africa/Bujumbura|BI|-3.38|29.37;Africa/Porto-Novo|BJ|6.48|2.62;America/St_Barthelemy|BL|17.88|-62.85;Atlantic/Bermuda|BM|32.28|-64.77;Asia/Brunei|BN|4.93|114.92;America/La_Paz|BO|-16.5|-68.15;America/Kralendijk|BQ|12.15|-68.28;America/Noronha|BR|-3.85|-32.42;America/Belem|BR|-1.45|-48.48;America/Fortaleza|BR|-3.72|-38.5;America/Recife|BR|-8.05|-34.9;America/Araguaina|BR|-7.2|-48.2;America/Maceio|BR|-9.67|-35.72;America/Bahia|BR|-12.98|-38.52;America/Sao_Paulo|BR|-23.53|-46.62;America/Campo_Grande|BR|-20.45|-54.62;America/Cuiaba|BR|-15.58|-56.08;America/Santarem|BR|-2.43|-54.87;America/Porto_Velho|BR|-8.77|-63.9;America/Boa_Vista|BR|2.82|-60.67;America/Manaus|BR|-3.13|-60.02;America/Eirunepe|BR|-6.67|-69.87;America/Rio_Branco|BR|-9.97|-67.8;America/Nassau|BS|25.08|-77.35;Asia/Thimphu|BT|27.47|89.65;Africa/Gaborone|BW|-24.65|25.92;Europe/Minsk|BY|53.9|27.57;America/Belize|BZ|17.5|-88.2;America/St_Johns|CA|47.57|-52.72;America/Halifax|CA|44.65|-63.6;America/Glace_Bay|CA|46.2|-59.95;America/Moncton|CA|46.1|-64.78;America/Goose_Bay|CA|53.33|-60.42;America/Blanc-Sablon|CA|51.42|-57.12;America/Toronto|CA|43.65|-79.38;America/Iqaluit|CA|63.73|-68.47;America/Atikokan|CA|48.76|-91.62;America/Winnipeg|CA|49.88|-97.15;America/Resolute|CA|74.7|-94.83;America/Rankin_Inlet|CA|62.82|-92.08;America/Regina|CA|50.4|-104.65;America/Swift_Current|CA|50.28|-107.83;America/Edmonton|CA|53.55|-113.47;America/Cambridge_Bay|CA|69.11|-105.05;America/Inuvik|CA|68.35|-133.72;America/Vancouver|CA|49.27|-123.12;America/Creston|CA|49.1|-116.52;America/Dawson_Creek|CA|55.77|-120.23;America/Fort_Nelson|CA|58.8|-122.7;America/Whitehorse|CA|60.72|-135.05;America/Dawson|CA|64.07|-139.42;Indian/Cocos|CC|-12.17|96.92;Africa/Kinshasa|CD|-4.3|15.3;Africa/Lubumbashi|CD|-11.67|27.47;Africa/Bangui|CF|4.37|18.58;Africa/Brazzaville|CG|-4.27|15.28;Europe/Zurich|CH|47.38|8.53;Africa/Abidjan|CI|5.32|-4.03;Pacific/Rarotonga|CK|-21.23|-159.77;America/Santiago|CL|-33.45|-70.67;America/Coyhaique|CL|-45.57|-72.07;America/Punta_Arenas|CL|-53.15|-70.92;Pacific/Easter|CL|-27.15|-109.43;Africa/Douala|CM|4.05|9.7;Asia/Shanghai|CN|31.23|121.47;Asia/Urumqi|CN|43.8|87.58;America/Bogota|CO|4.6|-74.08;America/Costa_Rica|CR|9.93|-84.08;America/Havana|CU|23.13|-82.37;Atlantic/Cape_Verde|CV|14.92|-23.52;America/Curacao|CW|12.18|-69;Indian/Christmas|CX|-10.42|105.72;Asia/Nicosia|CY|35.17|33.37;Asia/Famagusta|CY|35.12|33.95;Europe/Prague|CZ|50.08|14.43;Europe/Berlin|DE|52.5|13.37;Europe/Busingen|DE|47.7|8.68;Africa/Djibouti|DJ|11.6|43.15;Europe/Copenhagen|DK|55.67|12.58;America/Dominica|DM|15.3|-61.4;America/Santo_Domingo|DO|18.47|-69.9;Africa/Algiers|DZ|36.78|3.05;America/Guayaquil|EC|-2.17|-79.83;Pacific/Galapagos|EC|-0.9|-89.6;Europe/Tallinn|EE|59.42|24.75;Africa/Cairo|EG|30.05|31.25;Africa/El_Aaiun|EH|27.15|-13.2;Africa/Asmara|ER|15.33|38.88;Europe/Madrid|ES|40.4|-3.68;Africa/Ceuta|ES|35.88|-5.32;Atlantic/Canary|ES|28.1|-15.4;Africa/Addis_Ababa|ET|9.03|38.7;Europe/Helsinki|FI|60.17|24.97;Pacific/Fiji|FJ|-18.13|178.42;Atlantic/Stanley|FK|-51.7|-57.85;Pacific/Chuuk|FM|7.42|151.78;Pacific/Pohnpei|FM|6.97|158.22;Pacific/Kosrae|FM|5.32|162.98;Atlantic/Faroe|FO|62.02|-6.77;Europe/Paris|FR|48.87|2.33;Africa/Libreville|GA|0.38|9.45;Europe/London|GB|51.51|-0.13;America/Grenada|GD|12.05|-61.75;Asia/Tbilisi|GE|41.72|44.82;America/Cayenne|GF|4.93|-52.33;Europe/Guernsey|GG|49.45|-2.54;Africa/Accra|GH|5.55|-0.22;Europe/Gibraltar|GI|36.13|-5.35;America/Nuuk|GL|64.18|-51.73;America/Danmarkshavn|GL|76.77|-18.67;America/Scoresbysund|GL|70.48|-21.97;America/Thule|GL|76.57|-68.78;Africa/Banjul|GM|13.47|-16.65;Africa/Conakry|GN|9.52|-13.72;America/Guadeloupe|GP|16.23|-61.53;Africa/Malabo|GQ|3.75|8.78;Europe/Athens|GR|37.97|23.72;Atlantic/South_Georgia|GS|-54.27|-36.53;America/Guatemala|GT|14.63|-90.52;Pacific/Guam|GU|13.47|144.75;Africa/Bissau|GW|11.85|-15.58;America/Guyana|GY|6.8|-58.17;Asia/Hong_Kong|HK|22.28|114.15;America/Tegucigalpa|HN|14.1|-87.22;Europe/Zagreb|HR|45.8|15.97;America/Port-au-Prince|HT|18.53|-72.33;Europe/Budapest|HU|47.5|19.08;Asia/Jakarta|ID|-6.17|106.8;Asia/Pontianak|ID|-0.03|109.33;Asia/Makassar|ID|-5.12|119.4;Asia/Jayapura|ID|-2.53|140.7;Europe/Dublin|IE|53.33|-6.25;Asia/Jerusalem|IL|31.78|35.22;Europe/Isle_of_Man|IM|54.15|-4.47;Asia/Kolkata|IN|22.53|88.37;Indian/Chagos|IO|-7.33|72.42;Asia/Baghdad|IQ|33.35|44.42;Asia/Tehran|IR|35.67|51.43;Atlantic/Reykjavik|IS|64.15|-21.85;Europe/Rome|IT|41.9|12.48;Europe/Jersey|JE|49.18|-2.11;America/Jamaica|JM|17.97|-76.79;Asia/Amman|JO|31.95|35.93;Asia/Tokyo|JP|35.65|139.74;Africa/Nairobi|KE|-1.28|36.82;Asia/Bishkek|KG|42.9|74.6;Asia/Phnom_Penh|KH|11.55|104.92;Pacific/Tarawa|KI|1.42|173;Pacific/Kanton|KI|-2.78|-171.72;Pacific/Kiritimati|KI|1.87|-157.33;Indian/Comoro|KM|-11.68|43.27;America/St_Kitts|KN|17.3|-62.72;Asia/Pyongyang|KP|39.02|125.75;Asia/Seoul|KR|37.55|126.97;Asia/Kuwait|KW|29.33|47.98;America/Cayman|KY|19.3|-81.38;Asia/Almaty|KZ|43.25|76.95;Asia/Qyzylorda|KZ|44.8|65.47;Asia/Qostanay|KZ|53.2|63.62;Asia/Aqtobe|KZ|50.28|57.17;Asia/Aqtau|KZ|44.52|50.27;Asia/Atyrau|KZ|47.12|51.93;Asia/Oral|KZ|51.22|51.35;Asia/Vientiane|LA|17.97|102.6;Asia/Beirut|LB|33.88|35.5;America/St_Lucia|LC|14.02|-61;Europe/Vaduz|LI|47.15|9.52;Asia/Colombo|LK|6.93|79.85;Africa/Monrovia|LR|6.3|-10.78;Africa/Maseru|LS|-29.47|27.5;Europe/Vilnius|LT|54.68|25.32;Europe/Luxembourg|LU|49.6|6.15;Europe/Riga|LV|56.95|24.1;Africa/Tripoli|LY|32.9|13.18;Africa/Casablanca|MA|33.65|-7.58;Europe/Monaco|MC|43.7|7.38;Europe/Chisinau|MD|47|28.83;Europe/Podgorica|ME|42.43|19.27;America/Marigot|MF|18.07|-63.08;Indian/Antananarivo|MG|-18.92|47.52;Pacific/Majuro|MH|7.15|171.2;Pacific/Kwajalein|MH|9.08|167.33;Europe/Skopje|MK|41.98|21.43;Africa/Bamako|ML|12.65|-8;Asia/Yangon|MM|16.78|96.17;Asia/Ulaanbaatar|MN|47.92|106.88;Asia/Hovd|MN|48.02|91.65;Asia/Macau|MO|22.2|113.54;Pacific/Saipan|MP|15.2|145.75;America/Martinique|MQ|14.6|-61.08;Africa/Nouakchott|MR|18.1|-15.95;America/Montserrat|MS|16.72|-62.22;Europe/Malta|MT|35.9|14.52;Indian/Mauritius|MU|-20.17|57.5;Indian/Maldives|MV|4.17|73.5;Africa/Blantyre|MW|-15.78|35;America/Mexico_City|MX|19.4|-99.15;America/Cancun|MX|21.08|-86.77;America/Merida|MX|20.97|-89.62;America/Monterrey|MX|25.67|-100.32;America/Matamoros|MX|25.83|-97.5;America/Chihuahua|MX|28.63|-106.08;America/Ciudad_Juarez|MX|31.73|-106.48;America/Ojinaga|MX|29.57|-104.42;America/Mazatlan|MX|23.22|-106.42;America/Bahia_Banderas|MX|20.8|-105.25;America/Hermosillo|MX|29.07|-110.97;America/Tijuana|MX|32.53|-117.02;Asia/Kuala_Lumpur|MY|3.17|101.7;Asia/Kuching|MY|1.55|110.33;Africa/Maputo|MZ|-25.97|32.58;Africa/Windhoek|NA|-22.57|17.1;Pacific/Noumea|NC|-22.27|166.45;Africa/Niamey|NE|13.52|2.12;Pacific/Norfolk|NF|-29.05|167.97;Africa/Lagos|NG|6.45|3.4;America/Managua|NI|12.15|-86.28;Europe/Amsterdam|NL|52.37|4.9;Europe/Oslo|NO|59.92|10.75;Asia/Kathmandu|NP|27.72|85.32;Pacific/Nauru|NR|-0.52|166.92;Pacific/Niue|NU|-19.02|-169.92;Pacific/Auckland|NZ|-36.87|174.77;Pacific/Chatham|NZ|-43.95|-176.55;Asia/Muscat|OM|23.6|58.58;America/Panama|PA|8.97|-79.53;America/Lima|PE|-12.05|-77.05;Pacific/Tahiti|PF|-17.53|-149.57;Pacific/Marquesas|PF|-9|-139.5;Pacific/Gambier|PF|-23.13|-134.95;Pacific/Port_Moresby|PG|-9.5|147.17;Pacific/Bougainville|PG|-6.22|155.57;Asia/Manila|PH|14.59|120.97;Asia/Karachi|PK|24.87|67.05;Europe/Warsaw|PL|52.25|21;America/Miquelon|PM|47.05|-56.33;Pacific/Pitcairn|PN|-25.07|-130.08;America/Puerto_Rico|PR|18.47|-66.11;Asia/Gaza|PS|31.5|34.47;Asia/Hebron|PS|31.53|35.09;Europe/Lisbon|PT|38.72|-9.13;Atlantic/Madeira|PT|32.63|-16.9;Atlantic/Azores|PT|37.73|-25.67;Pacific/Palau|PW|7.33|134.48;America/Asuncion|PY|-25.27|-57.67;Asia/Qatar|QA|25.28|51.53;Indian/Reunion|RE|-20.87|55.47;Europe/Bucharest|RO|44.43|26.1;Europe/Belgrade|RS|44.83|20.5;Europe/Kaliningrad|RU|54.72|20.5;Europe/Moscow|RU|55.76|37.62;Europe/Simferopol|UA|44.95|34.1;Europe/Kirov|RU|58.6|49.65;Europe/Volgograd|RU|48.73|44.42;Europe/Astrakhan|RU|46.35|48.05;Europe/Saratov|RU|51.57|46.03;Europe/Ulyanovsk|RU|54.33|48.4;Europe/Samara|RU|53.2|50.15;Asia/Yekaterinburg|RU|56.85|60.6;Asia/Omsk|RU|55|73.4;Asia/Novosibirsk|RU|55.03|82.92;Asia/Barnaul|RU|53.37|83.75;Asia/Tomsk|RU|56.5|84.97;Asia/Novokuznetsk|RU|53.75|87.12;Asia/Krasnoyarsk|RU|56.02|92.83;Asia/Irkutsk|RU|52.27|104.33;Asia/Chita|RU|52.05|113.47;Asia/Yakutsk|RU|62|129.67;Asia/Khandyga|RU|62.66|135.55;Asia/Vladivostok|RU|43.17|131.93;Asia/Ust-Nera|RU|64.56|143.23;Asia/Magadan|RU|59.57|150.8;Asia/Sakhalin|RU|46.97|142.7;Asia/Srednekolymsk|RU|67.47|153.72;Asia/Kamchatka|RU|53.02|158.65;Asia/Anadyr|RU|64.75|177.48;Africa/Kigali|RW|-1.95|30.07;Asia/Riyadh|SA|24.63|46.72;Pacific/Guadalcanal|SB|-9.53|160.2;Indian/Mahe|SC|-4.67|55.47;Africa/Khartoum|SD|15.6|32.53;Europe/Stockholm|SE|59.33|18.05;Asia/Singapore|SG|1.28|103.85;Atlantic/St_Helena|SH|-15.92|-5.7;Europe/Ljubljana|SI|46.05|14.52;Arctic/Longyearbyen|SJ|78|16;Europe/Bratislava|SK|48.15|17.12;Africa/Freetown|SL|8.5|-13.25;Europe/San_Marino|SM|43.92|12.47;Africa/Dakar|SN|14.67|-17.43;Africa/Mogadishu|SO|2.07|45.37;America/Paramaribo|SR|5.83|-55.17;Africa/Juba|SS|4.85|31.62;Africa/Sao_Tome|ST|0.33|6.73;America/El_Salvador|SV|13.7|-89.2;America/Lower_Princes|SX|18.05|-63.05;Asia/Damascus|SY|33.5|36.3;Africa/Mbabane|SZ|-26.3|31.1;America/Grand_Turk|TC|21.47|-71.13;Africa/Ndjamena|TD|12.12|15.05;Indian/Kerguelen|TF|-49.35|70.22;Africa/Lome|TG|6.13|1.22;Asia/Bangkok|TH|13.75|100.52;Asia/Dushanbe|TJ|38.58|68.8;Pacific/Fakaofo|TK|-9.37|-171.23;Asia/Dili|TL|-8.55|125.58;Asia/Ashgabat|TM|37.95|58.38;Africa/Tunis|TN|36.8|10.18;Pacific/Tongatapu|TO|-21.13|-175.2;Europe/Istanbul|TR|41.02|28.97;America/Port_of_Spain|TT|10.65|-61.52;Pacific/Funafuti|TV|-8.52|179.22;Asia/Taipei|TW|25.05|121.5;Africa/Dar_es_Salaam|TZ|-6.8|39.28;Europe/Kyiv|UA|50.43|30.52;Africa/Kampala|UG|0.32|32.42;Pacific/Midway|UM|28.22|-177.37;Pacific/Wake|UM|19.28|166.62;America/New_York|US|40.71|-74.01;America/Detroit|US|42.33|-83.05;America/Kentucky/Louisville|US|38.25|-85.76;America/Kentucky/Monticello|US|36.83|-84.85;America/Indiana/Indianapolis|US|39.77|-86.16;America/Indiana/Vincennes|US|38.68|-87.53;America/Indiana/Winamac|US|41.05|-86.6;America/Indiana/Marengo|US|38.38|-86.34;America/Indiana/Petersburg|US|38.49|-87.28;America/Indiana/Vevay|US|38.75|-85.07;America/Chicago|US|41.85|-87.65;America/Indiana/Tell_City|US|37.95|-86.76;America/Indiana/Knox|US|41.3|-86.63;America/Menominee|US|45.11|-87.61;America/North_Dakota/Center|US|47.12|-101.3;America/North_Dakota/New_Salem|US|46.84|-101.41;America/North_Dakota/Beulah|US|47.26|-101.78;America/Denver|US|39.74|-104.98;America/Boise|US|43.61|-116.2;America/Phoenix|US|33.45|-112.07;America/Los_Angeles|US|34.05|-118.24;America/Anchorage|US|61.22|-149.9;America/Juneau|US|58.3|-134.42;America/Sitka|US|57.18|-135.3;America/Metlakatla|US|55.13|-131.58;America/Yakutat|US|59.55|-139.73;America/Nome|US|64.5|-165.41;America/Adak|US|51.88|-176.66;Pacific/Honolulu|US|21.31|-157.86;America/Montevideo|UY|-34.91|-56.21;Asia/Samarkand|UZ|39.67|66.8;Asia/Tashkent|UZ|41.33|69.3;Europe/Vatican|VA|41.9|12.45;America/St_Vincent|VC|13.15|-61.23;America/Caracas|VE|10.5|-66.93;America/Tortola|VG|18.45|-64.62;America/St_Thomas|VI|18.35|-64.93;Asia/Ho_Chi_Minh|VN|10.75|106.67;Pacific/Efate|VU|-17.67|168.42;Pacific/Wallis|WF|-13.3|-176.17;Pacific/Apia|WS|-13.83|-171.73;Asia/Aden|YE|12.75|45.2;Indian/Mayotte|YT|-12.78|45.23;Africa/Johannesburg|ZA|-26.25|28;Africa/Lusaka|ZM|-15.42|28.28;Africa/Harare|ZW|-17.83|31.05";
  function ptZone(tz) {
    var A = { "Asia/Calcutta": "Asia/Kolkata", "Asia/Katmandu": "Asia/Kathmandu", "Asia/Saigon": "Asia/Ho_Chi_Minh", "Asia/Rangoon": "Asia/Yangon", "Africa/Asmera": "Africa/Asmara", "Europe/Kiev": "Europe/Kyiv", "America/Buenos_Aires": "America/Argentina/Buenos_Aires" };
    tz = A[tz] || tz; if (!tz) return null;
    var i = PT_TZ.indexOf(tz + "|"); if (i < 0) return null;
    var p = PT_TZ.slice(i, (PT_TZ.indexOf(";", i) + 1 || PT_TZ.length + 1) - 1).split("|");
    return { name: p[0].split("/").pop().replace(/_/g, " "), cc: p[1], lat: +p[2], lng: +p[3], src: "tz" };
  }
  function ptMethod(cc) {
    if (cc === "SA") return { n: "Umm Al-Qura", f: 18.5, im: 90 };
    if (cc === "EG") return { n: "Egyptian General Authority", f: 19.5, i: 17.5 };
    if (cc === "US" || cc === "CA") return { n: "ISNA", f: 15, i: 15 };
    if (/^(PK|AF|BD|IN)$/.test(cc)) return { n: "Karachi (Hanafi Asr)", f: 18, i: 18, h: 1 };
    if (/^(MY|SG|BN|ID)$/.test(cc)) return { n: "JAKIM / MUIS", f: 20, i: 18 };
    if (cc === "AE") return { n: "UAE", f: 18.2, i: 18.2 };
    if (cc === "QA") return { n: "Qatar", f: 18, im: 90 };
    if (cc === "KW") return { n: "Kuwait", f: 18, i: 17.5 };
    if (cc === "MA") return { n: "Morocco", f: 19, i: 17 };
    return { n: "Muslim World League", f: 18, i: 17 };
  }
  // Returns prayer times as hours after 00:00 UTC of the given date (can be < 0 or > 24).
  function ptCalc(y, m, d, lat, lng, M, ramadan) {
    var rad = Math.PI / 180, deg = 180 / Math.PI;
    function fix(a, b) { return a - b * Math.floor(a / b); }
    var jd = 367 * y - Math.floor(7 * (y + Math.floor((m + 9) / 12)) / 4) + Math.floor(275 * m / 9) + d + 1721013.5;
    var D = jd + 0.5 - lng / 360 - 2451545.0;
    var g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
    var L = fix(q + 1.915 * Math.sin(g * rad) + 0.020 * Math.sin(2 * g * rad), 360);
    var e = 23.439 - 0.00000036 * D;
    var RA = fix(Math.atan2(Math.cos(e * rad) * Math.sin(L * rad), Math.cos(L * rad)) * deg / 15, 24);
    var decl = Math.asin(Math.sin(e * rad) * Math.sin(L * rad)) * deg;
    var eqt = fix(q / 15 - RA + 12, 24) - 12;
    var noon = 12 - lng / 15 - eqt;
    function T(angle) { return Math.acos((-Math.sin(angle * rad) - Math.sin(decl * rad) * Math.sin(lat * rad)) / (Math.cos(decl * rad) * Math.cos(lat * rad))) * deg / 15; }
    function A(f) { var a = Math.atan(1 / (f + Math.tan(Math.abs(lat - decl) * rad))) * deg; return Math.acos((Math.sin(a * rad) - Math.sin(decl * rad) * Math.sin(lat * rad)) / (Math.cos(decl * rad) * Math.cos(lat * rad))) * deg / 15; }
    var sr = noon - T(0.833), ss = noon + T(0.833), night = 24 - (ss - sr);
    var fajr = noon - T(M.f), pf = night * M.f / 60;
    if (isNaN(fajr) || sr - fajr > pf) fajr = sr - pf; // high-latitude rule (angle-based)
    var isha;
    if (M.im) isha = ss + (M.im + (ramadan && M.n === "Umm Al-Qura" ? 30 : 0)) / 60;
    else { isha = noon + T(M.i); var pi = night * M.i / 60; if (isNaN(isha) || isha - ss > pi) isha = ss + pi; }
    return { fajr: fajr, sunrise: sr, dhuhr: noon + 1 / 60, asr: noon + A(M.h ? 2 : 1), maghrib: ss + 1 / 60, isha: isha };
  }
  function initPrayer() {
    var header = document.querySelector(".header"); if (!header) return;
    var open = false; try { open = localStorage.getItem("ptOpen") === "1"; } catch (e) {}
    var bar = mk("section", { "class": "pt-bar" + (open ? " open" : ""), "aria-label": "Prayer times" });
    bar.innerHTML = '<div class="container"><button type="button" class="pt-head" aria-expanded="' + open + '"><span class="pt-ico">🕌</span><span class="pt-sum"></span><span class="pt-clock" aria-live="off"><b></b><small></small></span><span class="pt-tog" aria-hidden="true"></span></button><div class="pt-body"><div class="pt-in"><div class="pt-loc"><span class="pt-where"></span><span class="pt-btns"><button type="button" class="pt-gps"></button><button type="button" class="pt-chg"></button></span></div><div class="pt-search" hidden><input type="search" class="pt-q" autocomplete="off"><ul class="pt-res"></ul></div><div class="pt-grid"></div><p class="pt-note"></p></div></div></div>';
    header.parentNode.insertBefore(bar, header.nextSibling);
    var head = bar.querySelector(".pt-head"), gpsBtn = bar.querySelector(".pt-gps"), gpsMsg = "", chgBtn = bar.querySelector(".pt-chg"), box = bar.querySelector(".pt-search"), q = bar.querySelector(".pt-q"), res = bar.querySelector(".pt-res");
    head.addEventListener("click", function () { open = !open; bar.classList.toggle("open", open); head.setAttribute("aria-expanded", String(open)); try { localStorage.setItem("ptOpen", open ? "1" : "0"); } catch (e) {} draw(); });
    var KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
    var devTz = ""; try { devTz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
    var LOC = ptZone(devTz) || { name: "Makkah", cc: "SA", lat: 21.4225, lng: 39.8262, src: "tz" };
    function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
    function load(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
    function country(cc, fr) { try { return new Intl.DisplayNames([fr ? "fr" : "en"], { type: "region" }).of(cc); } catch (e) { return cc; } }
    function names(fr, friday) { return { fajr: "Fajr", sunrise: fr ? "Chourouq" : "Sunrise", dhuhr: friday ? (fr ? "Joumou’a" : "Jumu’ah") : (fr ? "Dhohr" : "Dhuhr"), asr: "Asr", maghrib: "Maghrib", isha: fr ? "Icha" : "Isha" }; }
    function hijri(dt, fr) { try { return new Intl.DateTimeFormat((fr ? "fr" : "en") + "-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(dt); } catch (e) { return ""; } }
    function ramadan(dt) { try { return new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", { month: "numeric" }).format(dt) === "9"; } catch (e) { return false; } }
    function at(y, m, d, h) { return new Date(Date.UTC(y, m - 1, d) + Math.round(h * 60) * 60000); }
    function hm(dt) { return String(dt.getHours()).padStart(2, "0") + ":" + String(dt.getMinutes()).padStart(2, "0"); }
    function day(dt) { var t = ptCalc(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), LOC.lat, LOC.lng, ptMethod(LOC.cc), ramadan(dt)), o = {}; KEYS.forEach(function (k) { o[k] = at(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), t[k]); }); return o; }
    function draw() {
      var fr = lang === "fr", now = new Date(), N = names(fr, now.getDay() === 5), t = day(now), next = null, nextAt;
      ["fajr", "dhuhr", "asr", "maghrib", "isha"].forEach(function (k) { if (!next && t[k] > now) next = k; });
      if (next) nextAt = t[next]; else { next = "fajr"; nextAt = day(new Date(now.getTime() + 86400000)).fajr; }
      var mins = Math.max(0, Math.round((nextAt - now) / 60000)), left = (mins >= 60 ? Math.floor(mins / 60) + " h " : "") + (mins % 60) + " min";
      var place = LOC.name || (fr ? "Ma position" : "My location");
      bar.querySelector(".pt-sum").innerHTML = "<b>" + (fr ? "Heures de prière" : "Prayer times") + " · " + place.replace(/</g, "") + "</b><span class=\"pt-next\">" + (fr ? "Prochaine : " : "Next: ") + "<b>" + N[next] + " " + hm(nextAt) + "</b> · " + (fr ? "dans " : "in ") + left + "</span>";
      var ck = bar.querySelector(".pt-clock");
      ck.querySelector("b").textContent = hm(now);
      ck.querySelector("small").textContent = new Intl.DateTimeFormat(fr ? "fr-FR" : "en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(now);
      bar.querySelector(".pt-tog").textContent = open ? "−" : "+";
      if (!open) return;
      bar.querySelector(".pt-grid").innerHTML = '<div class="pt-city"><ul>' + KEYS.map(function (k) { return '<li class="' + (k === next && t[k] > now ? "now" : "") + (k === "sunrise" ? " sun" : "") + '"><span>' + N[k] + "</span><b>" + hm(t[k]) + "</b></li>"; }).join("") + "</ul></div>";
      var how = LOC.src === "city" ? (fr ? "votre choix" : "your choice") : LOC.src === "gps" ? (fr ? "votre position exacte" : "your exact position") : LOC.src === "ip" ? (fr ? "votre connexion internet" : "your internet connection") : (fr ? "le fuseau horaire de votre appareil" : "your device’s time zone");
      bar.querySelector(".pt-where").innerHTML = "📍 <b>" + place.replace(/</g, "") + (LOC.name && LOC.cc ? ", " + country(LOC.cc, fr) : "") + "</b> <small>(" + (fr ? "d’après " : "based on ") + how + ")</small>";
      gpsBtn.textContent = gpsMsg || (LOC.src === "gps" ? (fr ? "Actualiser ma position" : "Update my location") : (fr ? "Utiliser ma position exacte" : "Use my exact location"));
      chgBtn.textContent = fr ? "Changer de ville" : "Change city"; q.placeholder = fr ? "Tapez votre ville (ex. Abha, Kano, Bouaké)" : "Type your city (e.g. Abha, Kano, Bouaké)";
      var dateTxt = new Intl.DateTimeFormat(fr ? "fr-FR" : "en-GB", { weekday: "long", day: "numeric", month: "long" }).format(now);
      bar.querySelector(".pt-note").textContent = dateTxt + (hijri(now, fr) ? " · " + hijri(now, fr) : "") + " · " + (fr ? "Heure locale, méthode " : "Local time, ") + ptMethod(LOC.cc).n + (fr ? "" : " method") + ". " + (fr ? "Peut différer de quelques minutes de votre mosquée." : "May differ by a few minutes from your local mosque.");
    }
    function setLoc(l) { LOC = l; draw(); }
    function gps(silent) {
      if (!navigator.geolocation) return;
      if (!silent) { gpsMsg = lang === "fr" ? "Localisation…" : "Locating…"; draw(); }
      navigator.geolocation.getCurrentPosition(function (p) {
        gpsMsg = ""; var cc = LOC.cc, ip = load("ptIp"); if (ip && ip.cc) cc = ip.cc;
        var la = +p.coords.latitude.toFixed(3), lo = +p.coords.longitude.toFixed(3), near = ip && Math.abs(ip.lat - la) < 0.5 && Math.abs(ip.lng - lo) < 0.5;
        var l = { name: near ? ip.name : "", cc: cc, lat: la, lng: lo, src: "gps" };
        save("ptGps", l); setLoc(l);
      }, function () { if (silent) return; gpsMsg = lang === "fr" ? "Localisation bloquée par ce navigateur" : "Location is blocked by this browser"; draw(); openSearch(); setTimeout(function () { gpsMsg = ""; draw(); }, 6000); }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 });
    }
    function openSearch() { box.hidden = false; q.value = ""; res.innerHTML = ""; setTimeout(function () { q.focus(); }, 30); }
    var st = null, seq = 0;
    q.addEventListener("input", function () {
      clearTimeout(st); var v = q.value.trim(); if (v.length < 2) { res.innerHTML = ""; return; }
      st = setTimeout(function () {
        var my = ++seq;
        fetch("https://geocoding-api.open-meteo.com/v1/search?count=6&format=json&language=" + (lang === "fr" ? "fr" : "en") + "&name=" + encodeURIComponent(v)).then(function (r) { return r.json(); }).then(function (j) {
          if (my !== seq) return; res.innerHTML = "";
          (j.results || []).forEach(function (c) {
            var li = document.createElement("li"), b = document.createElement("button"); b.type = "button";
            b.textContent = c.name + (c.admin1 ? ", " + c.admin1 : "") + (c.country ? ", " + c.country : "");
            b.addEventListener("click", function () {
              var l = { name: c.name, cc: c.country_code || "", lat: +(+c.latitude).toFixed(3), lng: +(+c.longitude).toFixed(3), src: "city" };
              save("ptGps", l); box.hidden = true; setLoc(l);
            });
            li.appendChild(b); res.appendChild(li);
          });
          if (!res.children.length) res.innerHTML = "<li class=\"pt-none\">" + (lang === "fr" ? "Aucune ville trouvée" : "No city found") + "</li>";
        }).catch(function () { res.innerHTML = "<li class=\"pt-none\">" + (lang === "fr" ? "Recherche indisponible" : "Search unavailable") + "</li>"; });
      }, 300);
    });
    chgBtn.addEventListener("click", function () { if (box.hidden) openSearch(); else box.hidden = true; });
    gpsBtn.addEventListener("click", function () { gps(false); });
    var saved = load("ptGps");
    if (saved && (saved.src === "gps" || saved.src === "city")) LOC = saved;
    else {
      var ipc = load("ptIp");
      if (ipc && ipc.t > Date.now() - 86400000) LOC = ipc;
      else if (window.fetch) {
        var ctl = window.AbortController ? new AbortController() : null; if (ctl) setTimeout(function () { ctl.abort(); }, 5000);
        fetch("https://get.geojs.io/v1/ip/geo.json", ctl ? { signal: ctl.signal } : {}).then(function (r) { return r.json(); }).then(function (j) {
          var la = parseFloat(j.latitude), lo = parseFloat(j.longitude); if (isNaN(la) || isNaN(lo)) return;
          var l = { name: j.city || j.region || country(j.country_code, false), cc: j.country_code || LOC.cc, lat: la, lng: lo, src: "ip", t: Date.now() };
          save("ptIp", l); if (LOC.src !== "gps") setLoc(l);
        }).catch(function () {});
      }
      try { navigator.permissions.query({ name: "geolocation" }).then(function (s) { if (s.state === "granted") gps(true); }); } catch (e) {}
    }
    promoEls.push(draw);
    draw(); setTimeout(function () { draw(); setInterval(draw, 60000); }, 60000 - Date.now() % 60000 + 50);
  }


  // 6. Share the website (native share sheet on phones, links on computers)
  var SVG_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4"/></svg>';
  var SHARE_ICONS = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + WA_PATH + '"/></svg>',
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 8.5h2.5V5H14c-2.6 0-4 1.6-4 4.2V11H8v3.4h2V21h3.4v-6.6h2.5l.5-3.4h-3V9.6c0-.7.3-1.1.6-1.1z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M5 4l14 16M19 4L5 20"/></svg>',
    tg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.5 3.6L2.8 10.8c-1 .4-1 1.5 0 1.8l4.6 1.5 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.4 4.7 3.5c.6.4 1.4.1 1.6-.6l3.1-15.6c.2-1-.6-1.7-1.4-1.4zM9.6 14.2l8.3-7.4-6.4 8.3-.3 3-1.6-3.9z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M3 6h18v12H3zM3 7l9 6.5L21 7"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
  };
  function shareData() {
    var url = location.origin + location.pathname.replace(/index\.html$/, "");
    var text = tx("AL MANARAH GLOBAL SERVICES — Umrah, Hajj, Saudi visas & travel. Have a look:", "AL MANARAH GLOBAL SERVICES — Omra, Hajj, visas saoudiens et voyages. Découvrez :");
    return { url: url, text: text, title: document.title };
  }
  function shareLinks(d) {
    var u = encodeURIComponent(d.url), t = encodeURIComponent(d.text);
    return [
      ["wa", "WhatsApp", "https://wa.me/?text=" + t + "%20" + u],
      ["fb", "Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + u],
      ["x", "X", "https://twitter.com/intent/tweet?text=" + t + "&url=" + u],
      ["tg", "Telegram", "https://t.me/share/url?url=" + u + "&text=" + t],
      ["mail", "Email", "mailto:?subject=" + encodeURIComponent("AL MANARAH GLOBAL SERVICES") + "&body=" + t + "%0A" + u]
    ];
  }
  function copyLink(btn) {
    var d = shareData(), done = function () { var o = btn.getAttribute("aria-label"); btn.classList.add("copied"); btn.setAttribute("title", tx("Link copied", "Lien copié")); showToast(tx("Link copied ✓", "Lien copié ✓")); setTimeout(function () { btn.classList.remove("copied"); btn.setAttribute("title", o); }, 1800); };
    try { navigator.clipboard.writeText(d.url).then(done, function () { prompt(tx("Copy this link:", "Copiez ce lien :"), d.url); }); } catch (e) { prompt("", d.url); }
  }
  var toastEl;
  function showToast(m) {
    if (!toastEl) { toastEl = mk("div", { "class": "share-toast", role: "status" }); document.body.appendChild(toastEl); }
    toastEl.textContent = m; toastEl.classList.add("on"); clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("on"); }, 1800);
  }
  function shareRow(cls) {
    var row = mk("div", { "class": cls });
    shareLinks(shareData()).forEach(function (l) {
      var a = mk("a", { "class": "sh-" + l[0], href: l[2], target: "_blank", rel: "noopener", "aria-label": l[1], title: l[1] }, SHARE_ICONS[l[0]]);
      a.addEventListener("click", function () { a.href = shareLinks(shareData()).filter(function (x) { return x[0] === l[0]; })[0][2]; });
      row.appendChild(a);
    });
    var c = mk("button", { type: "button", "class": "sh-copy", "aria-label": "Copy link / Copier le lien", title: "Copy link / Copier le lien" }, SHARE_ICONS.copy);
    c.addEventListener("click", function () { copyLink(c); });
    row.appendChild(c);
    return row;
  }
  function openShare(anchor) {
    var d = shareData();
    if (navigator.share && matchMedia("(pointer:coarse)").matches) { navigator.share({ title: d.title, text: d.text, url: d.url }).catch(function () {}); return; }
    var pop = document.querySelector(".share-pop");
    if (pop) { pop.remove(); return; }
    pop = mk("div", { "class": "share-pop", role: "dialog", "aria-label": "Share" });
    pop.appendChild(mk("b")).textContent = tx("Share this website", "Partager ce site");
    pop.appendChild(shareRow("share-row"));
    document.body.appendChild(pop);
    var r = anchor.getBoundingClientRect();
    pop.style.top = (r.bottom + 10) + "px";
    pop.style.left = Math.max(10, Math.min(r.right - pop.offsetWidth, innerWidth - pop.offsetWidth - 10)) + "px";
    setTimeout(function () {
      function off(e) { if (!pop.contains(e.target) && e.target !== anchor && !anchor.contains(e.target)) { pop.remove(); document.removeEventListener("click", off); } }
      document.addEventListener("click", off);
      document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { pop.remove(); document.removeEventListener("keydown", esc); } });
    }, 0);
  }
  function initShare(actions) {
    if (actions) {
      var btn = mk("button", { type: "button", "class": "icon-btn share-btn", "aria-label": "Share / Partager", title: "Share / Partager" }, SVG_SHARE);
      btn.addEventListener("click", function () { openShare(btn); });
      actions.insertBefore(btn, actions.querySelector(".lang"));
    }
    var menu = document.getElementById("menu");
    if (menu) {
      var mi = mk("button", { type: "button", "class": "menu-share" }, SVG_SHARE + '<span data-fr="Partager ce site">Share this website</span>');
      mi.addEventListener("click", function () { openShare(mi); });
      menu.appendChild(mi);
    }
    var col = document.querySelector(".footer .fgrid-foot > div");
    if (col) {
      var box = mk("div", { "class": "footer-share" });
      box.appendChild(mk("span", { "data-fr": "Partager ce site" })).textContent = "Share this website";
      box.appendChild(shareRow("share-row"));
      if (navigator.share) {
        var more = mk("button", { type: "button", "class": "sh-more", "aria-label": "More / Plus" }, SVG_SHARE);
        more.addEventListener("click", function () { var d = shareData(); navigator.share({ title: d.title, text: d.text, url: d.url }).catch(function () {}); });
        box.querySelector(".share-row").appendChild(more);
      }
      col.appendChild(box);
    }
  }

  function initExtras() {
    var actions = document.querySelector(".nav-actions");
    var waSym = document.getElementById("i-wa"); if (waSym) waSym.innerHTML = '<path d="' + WA_PATH + '"/>';
    initIcons(); initChoices(); initPhones();
    if (actions) { initSearch(actions); initTheme(actions); initBasket(actions); }
    initShare(actions);
    initPromo(); initSoon(); initPrayer(); initNavHotels(); initHotels(); initVisa(); initHajj();
    refreshBasket();
    window.addEventListener("storage", function (e) { if (e.key === "basket") refreshBasket(); });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".year").forEach(function (y) { y.textContent = new Date().getFullYear(); });
    var q = new URLSearchParams(location.search).get("lang");
    var initial = q || store.get("lang") || ((navigator.language || "").toLowerCase().indexOf("fr") === 0 ? "fr" : "en");
    document.querySelectorAll("[data-setlang]").forEach(function (b) { b.addEventListener("click", function () { applyLang(b.dataset.setlang); }); });
    initNav(); initReveal(); initImages(); initRouting(); initQuick(); initChat(); initForms(); initLightbox(); initTrack(); initTurnstile();
    initExtras();
    applyLang(initial);
  });
})();
