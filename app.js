/* AL MANARAH — phone app layer (Android & iPhone, installed from the website).
   1) registers the service worker (fast start, offline page)
   2) inside the installed app: bottom tab bar, no top info strip, chat opened from the "Aide" tab
   3) in the phone browser: small "Install the app" card + install button on /app */
(function () {
  "use strict";
  var html = document.documentElement, body = document.body;
  if (!body || body.dataset.page === "admin") return;

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function L() { var l = (html.lang || "fr").slice(0, 2); return l === "en" || l === "ar" ? l : "fr"; }
  function tr(o) { return o[L()] || o.fr; }

  var ua = navigator.userAgent || "";
  var isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /android/i.test(ua);
  var isMobile = isIOS || isAndroid;
  var standalone = (window.matchMedia && (matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: minimal-ui)").matches)) || navigator.standalone === true;
  try { if (/[?&]source=app/.test(location.search)) sessionStorage.setItem("amApp", "1"); if (sessionStorage.getItem("amApp") === "1") standalone = true; } catch (e) {}

  /* ---------- 1. Service worker ---------- */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("/sw.js").catch(function () {}); });
  }

  /* ---------- Shared styles ---------- */
  var css = ""
    + ":root{--tabh:0px}"
    + "html.is-app{--tabh:calc(62px + env(safe-area-inset-bottom,0px))}"
    + "html.is-app body{padding-bottom:var(--tabh)}"
    + "html.is-app .topbar{display:none}"
    + "html.is-app .wa-float,html.is-app .quote-float,html.is-app .mk-wafab{bottom:calc(16px + var(--tabh))!important}"
    + "html.is-app .pt-bar,html.is-app .mk-ownbar{bottom:calc(12px + var(--tabh))!important}"
    + "html.is-app .promo-float{bottom:calc(16px + var(--tabh))!important}"
    + "html.is-app .mk-sticky{bottom:var(--tabh)!important}"
    + "html.is-app .mk-pickbar{bottom:calc(76px + var(--tabh))!important}"
    + "html.is-app .share-toast{bottom:calc(90px + var(--tabh))!important}"
    + ".am-tabs{position:fixed;left:0;right:0;bottom:0;z-index:300;display:flex;justify-content:space-around;align-items:stretch;background:#fff;border-top:1px solid #e6e2d6;box-shadow:0 -6px 22px rgba(16,27,69,.08);padding:6px 4px calc(6px + env(safe-area-inset-bottom,0px));font-family:Manrope,system-ui,sans-serif}"
    + ".am-tabs a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-decoration:none;color:#7a7f93;font-size:11px;font-weight:700;min-width:0;-webkit-tap-highlight-color:transparent;padding:2px 0}"
    + ".am-tabs a svg{width:23px;height:23px}"
    + ".am-tabs a.on{color:#101b45}"
    + ".am-tabs a.on svg{stroke:#b78a32}"
    + ".am-tabs a.sell .dot{width:44px;height:44px;margin-top:-20px;border-radius:50%;background:#101b45;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px -6px rgba(16,27,69,.6);border:3px solid #fff}"
    + ".am-tabs a.sell .dot svg{stroke:#fff;width:22px;height:22px}"
    + ".am-tabs a.sell.on .dot{background:#b78a32}"
    + ".am-tabs span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}"
    + ".am-inst{position:fixed;left:12px;right:12px;bottom:12px;z-index:500;display:flex;gap:12px;align-items:center;background:#101b45;color:#fff;border-radius:18px;padding:12px 12px 12px 12px;box-shadow:0 18px 40px -12px rgba(0,0,0,.55);font-family:Manrope,system-ui,sans-serif;transform:translateY(150%);transition:transform .35s ease;max-width:520px;margin:0 auto}"
    + ".am-inst.show{transform:none}"
    + ".am-inst img{width:46px;height:46px;border-radius:12px;background:#fff;flex:none}"
    + ".am-inst .tx{flex:1;min-width:0;font-size:13px;line-height:1.35}"
    + ".am-inst .tx b{display:block;font-size:14px;color:#e3c27a}"
    + ".am-inst button{font:800 13px Manrope,system-ui,sans-serif;border:0;border-radius:999px;cursor:pointer}"
    + ".am-inst .go{background:#b78a32;color:#fff;padding:10px 14px;flex:none}"
    + ".am-inst .x{background:none;color:#fff;opacity:.7;font-size:20px;padding:4px 6px;flex:none;line-height:1}"
    + ".am-ios{position:fixed;inset:0;z-index:600;background:rgba(10,16,40,.6);display:flex;align-items:flex-end;justify-content:center;font-family:Manrope,system-ui,sans-serif}"
    + ".am-ios>div{background:#fff;color:#101b45;width:100%;max-width:480px;border-radius:22px 22px 0 0;padding:22px 22px calc(26px + env(safe-area-inset-bottom,0px));text-align:center}"
    + ".am-ios h3{margin:6px 0 14px;font-size:18px}"
    + ".am-ios ol{text-align:start;margin:0 0 18px;padding-inline-start:22px;line-height:1.7;font-size:15px}"
    + ".am-ios button{background:#101b45;color:#fff;border:0;border-radius:999px;padding:12px 28px;font:800 14px Manrope,system-ui,sans-serif}"
    + ".am-ios .share{display:inline-block;vertical-align:-4px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var ICON = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    shop: '<path d="M4 7h16l-1.2 12.2a1 1 0 0 1-1 .8H6.2a1 1 0 0 1-1-.8z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
    sell: '<path d="M12 5v14M5 12h14"/>',
    help: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.8.9c0 1.6-2.3 2-2.3 3.4M12 16.6h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'
  };
  function svg(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + "</svg>"; }

  /* ---------- 2. Inside the installed app ---------- */
  if (standalone) {
    html.classList.add("is-app");
    var vp = document.querySelector('meta[name="viewport"]');
    if (vp && vp.content.indexOf("viewport-fit") < 0) vp.content += ", viewport-fit=cover";

    var signed = !!ls("sb-rcioefzhysholnfogljy-auth-token");
    var p = location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/index";
    var acctPage = p === "/sell" && (/mode=login/.test(location.search) || /#prod/.test(location.hash));
    var tabs = [
      { k: "home", href: "/", on: p === "/index", en: "Home", fr: "Accueil", ar: "الرئيسية" },
      { k: "shop", href: "/shop", on: p === "/shop" || p === "/product" || p === "/store" || body.dataset.page === "market-store", en: "Shop", fr: "Boutique", ar: "السوق" },
      { k: "sell", href: "/sell", on: p === "/sell" && !acctPage, en: "Sell", fr: "Vendre", ar: "بِع" },
      { k: "help", href: "/contact", on: p === "/contact", en: "Help", fr: "Aide", ar: "مساعدة" },
      { k: "user", href: signed ? "/sell.html#prod" : "/sell.html?mode=login", on: acctPage, en: signed ? "My store" : "Account", fr: signed ? "Ma boutique" : "Compte", ar: signed ? "متجري" : "حسابي" }
    ];
    var nav = document.createElement("nav"); nav.className = "am-tabs"; nav.setAttribute("aria-label", "App");
    tabs.forEach(function (t) {
      var a = document.createElement("a"); a.href = t.href; a.className = t.k + (t.on ? " on" : "");
      if (t.on) a.setAttribute("aria-current", "page");
      a.innerHTML = (t.k === "sell" ? '<i class="dot">' + svg(t.k) + "</i>" : svg(t.k));
      var s = document.createElement("span"); s.textContent = t.en; s.setAttribute("data-fr", t.fr); s.setAttribute("data-ar", t.ar);
      a.appendChild(s);
      if (t.k === "help") a.addEventListener("click", function (e) {
        /* open the live chat when this page has it; otherwise go to Contact */
        if (window.$crisp && window.$crisp.push) { e.preventDefault(); window.$crisp.push(["do", "chat:show"]); window.$crisp.push(["do", "chat:open"]); }
      });
      nav.appendChild(a);
    });
    body.appendChild(nav);

    /* chat bubble would sit on the tab bar: keep it hidden, open it from "Aide" */
    var hideChat = function () {
      if (!window.$crisp || !window.$crisp.push || window.__amChatHidden) return;
      window.__amChatHidden = true;
      window.$crisp.push(["do", "chat:hide"]);
      window.$crisp.push(["on", "chat:closed", function () { window.$crisp.push(["do", "chat:hide"]); }]);
    };
    document.addEventListener("DOMContentLoaded", function () { setTimeout(hideChat, 0); });
    window.addEventListener("load", hideChat);
    return;
  }

  /* ---------- 3. Phone browser: offer the app ---------- */
  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener("appinstalled", function () { ls("amAppInstalled", "1"); var c = document.querySelector(".am-inst"); if (c) c.remove(); });

  function iosHelp() {
    var o = document.createElement("div"); o.className = "am-ios";
    var share = '<svg class="share" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 11v9h14v-9"/></svg>';
    o.innerHTML = '<div role="dialog" aria-modal="true"><img src="/img/app/icon-192.png" width="64" height="64" alt="" style="border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,.15)"><h3></h3><ol><li></li><li></li><li></li></ol><button type="button"></button></div>';
    o.querySelector("h3").textContent = tr({ fr: "Installer sur iPhone", en: "Install on iPhone", ar: "التثبيت على الآيفون" });
    var li = o.querySelectorAll("li");
    li[0].innerHTML = tr({ fr: "Ouvrez ce site dans <b>Safari</b>.", en: "Open this site in <b>Safari</b>.", ar: "افتح الموقع في <b>Safari</b>." });
    li[1].innerHTML = tr({ fr: "Touchez le bouton Partager ", en: "Tap the Share button ", ar: "اضغط زر المشاركة " }) + share;
    li[2].innerHTML = tr({ fr: "Choisissez <b>« Sur l’écran d’accueil »</b>, puis <b>Ajouter</b>.", en: "Choose <b>“Add to Home Screen”</b>, then <b>Add</b>.", ar: "اختر <b>«إضافة إلى الشاشة الرئيسية»</b> ثم <b>إضافة</b>." });
    var b = o.querySelector("button"); b.textContent = tr({ fr: "J’ai compris", en: "Got it", ar: "فهمت" });
    function close() { o.remove(); }
    b.addEventListener("click", close); o.addEventListener("click", function (e) { if (e.target === o) close(); });
    body.appendChild(o);
  }
  function install() {
    if (deferred) { deferred.prompt(); deferred.userChoice.then(function () { deferred = null; }); return true; }
    if (isIOS) { iosHelp(); return true; }
    return false;
  }
  window.AMG_INSTALL_APP = install;

  /* buttons on the /app page */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-app-install]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        if (install()) return;
        var help = document.getElementById(isIOS ? "app-ios" : "app-android"); if (help) help.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    var qr = document.getElementById("appQr");
    if (qr && window.qrcode) { try { var q = window.qrcode(0, "M"); q.addData("https://almanarahglobalservices.com/app"); q.make(); qr.innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); } catch (e) {} }
    /* footer link to the app page */
    var fl = document.querySelector(".fm-links");
    if (fl && !fl.querySelector('a[href="app.html"]')) {
      var a = document.createElement("a"); a.href = "app.html";
      a.textContent = tr({ fr: "📲 Application", en: "📲 App", ar: "📲 التطبيق" });
      fl.insertBefore(a, fl.firstChild);
    }
  });

  /* small card at the bottom, phones only, not on the /app page itself, at most once every 10 days */
  if (!isMobile || body.dataset.page === "app" || ls("amAppInstalled") === "1") return;
  var last = +ls("amInstSeen") || 0;
  if (Date.now() - last < 10 * 864e5) return;
  setTimeout(function () {
    if (!deferred && !isIOS) return;           // browser cannot install: stay quiet
    if (document.querySelector(".am-inst,.am-ios")) return;
    var c = document.createElement("div"); c.className = "am-inst"; c.setAttribute("role", "dialog");
    c.innerHTML = '<img src="/img/app/icon-192.png" alt=""><div class="tx"><b></b><span></span></div><button type="button" class="go"></button><button type="button" class="x" aria-label="Close">×</button>';
    c.querySelector("b").textContent = tr({ fr: "Application AL MANARAH", en: "AL MANARAH app", ar: "تطبيق المنارة" });
    c.querySelector(".tx span").textContent = tr({ fr: "Plus rapide, sur votre écran d’accueil.", en: "Faster, right on your home screen.", ar: "أسرع، على شاشتك الرئيسية." });
    c.querySelector(".go").textContent = tr({ fr: "Installer", en: "Install", ar: "تثبيت" });
    function done() { ls("amInstSeen", String(Date.now())); c.classList.remove("show"); setTimeout(function () { c.remove(); }, 400); }
    c.querySelector(".go").addEventListener("click", function () { done(); install(); });
    c.querySelector(".x").addEventListener("click", done);
    body.appendChild(c);
    requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.add("show"); }); });
  }, 6000);
})();
