/* AL MANARAH — edit mode: open any page with ?edit=1 from the dashboard, tap a text or a picture, change it, save. */
(function () {
  "use strict";
  var S = window.AMG_SITE; if (!S) return;
  function tok() { try { return sessionStorage.getItem("amgTok") || ""; } catch (e) { return ""; } }
  function call(op, data) { var p = { action: "admin", op: op, token: tok() }; for (var k in data || {}) p[k] = data[k]; return S.api(p); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var css = el("style", null, ".ad-edit,.ad-edit *{font-family:Inter,'Tajawal',system-ui,sans-serif!important;letter-spacing:0!important;box-sizing:border-box}" +
    ".ad-ebar{position:fixed;left:10px;right:10px;bottom:10px;z-index:9999;background:#101b45;color:#fff;border:2px solid #b78a32;border-radius:16px;padding:10px 12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;box-shadow:0 18px 40px -16px rgba(0,0,0,.6);direction:ltr}" +
    ".ad-ebar b{color:#e2c27a}.ad-ebar select,.ad-ebar button,.ad-ebar a{font:700 .85rem Inter,system-ui,sans-serif;border-radius:10px;padding:8px 10px;border:0;cursor:pointer;text-decoration:none}" +
    ".ad-ebar select{background:#fff;color:#101b45}.ad-ebar .done{background:#b78a32;color:#101b45;margin-left:auto}.ad-ebar .lg{background:#1d2a63;color:#fff}" +
    "body.ad-editing [data-cid]{outline:2px dashed rgba(183,138,50,.75);outline-offset:2px;cursor:pointer}body.ad-editing [data-cid]:hover{outline:3px solid #b78a32;background:rgba(183,138,50,.12)}" +
    "body.ad-editing .wa-float,body.ad-editing .promo-float,body.ad-editing .chat-fab{display:none!important}body.ad-editing{padding-bottom:120px}" +
    ".ad-emod{position:fixed;inset:0;z-index:10000;background:rgba(10,14,30,.6);display:flex;align-items:flex-end;justify-content:center;direction:ltr}" +
    ".ad-ebox{background:#fff;color:#101b45;width:min(640px,100%);max-height:92vh;overflow:auto;border-radius:20px 20px 0 0;padding:18px 16px 22px}" +
    ".ad-ebox h3{margin:0 0 6px;font-size:1.1rem}.ad-ebox p{margin:0 0 10px;color:#5a6178;font-size:.85rem}.ad-ebox label{display:block;font-weight:700;font-size:.85rem;margin:10px 0 4px}" +
    ".ad-ebox textarea{width:100%;min-height:70px;border:1px solid #c9cde0;border-radius:12px;padding:10px;font:500 .95rem Inter,'Tajawal',sans-serif}.ad-ebox textarea[dir=rtl]{font-family:'Tajawal',Tahoma,sans-serif!important}" +
    ".ad-erow{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.ad-erow button{flex:1 1 auto;border:0;border-radius:12px;padding:12px;font:800 .9rem Inter,sans-serif;cursor:pointer}" +
    ".ad-erow .sv{background:#101b45;color:#fff}.ad-erow .tr{background:#f6f1e6;color:#101b45;border:1px solid #e2c27a}.ad-erow .rs{background:#fff;color:#c0392b;border:1px solid #e6b0aa}.ad-erow .cn{background:#eef0f6;color:#101b45}" +
    ".ad-ebox img{max-width:100%;max-height:220px;border-radius:12px;display:block;margin:6px 0}.ad-etoast{position:fixed;left:50%;transform:translateX(-50%);bottom:96px;z-index:10001;background:#1d7a46;color:#fff;padding:10px 16px;border-radius:12px;font:700 .9rem Inter,sans-serif}.ad-etoast.bad{background:#c0392b}");
  document.head.appendChild(css);
  var bar = el("div", "ad-edit ad-ebar");
  var PAGES = [["index", "Home"], ["about", "About"], ["services", "Services"], ["umrah", "Umrah"], ["hajj", "Hajj"], ["visas", "Visas"], ["hotels", "Hotels"], ["partners", "Partners"], ["contact", "Contact"], ["pay", "Pay"], ["track", "Track"], ["experiences", "Experiences"], ["library", "Library"], ["privacy", "Privacy"], ["terms", "Terms"]];
  var cur = S.page();
  bar.innerHTML = "<span>✏️ <b>Edit mode</b> — tap any text or picture</span>" +
    '<select aria-label="Page">' + PAGES.map(function (p) { return '<option value="' + p[0] + '"' + (p[0] === cur ? " selected" : "") + ">" + p[1] + "</option>"; }).join("") + "</select>" +
    '<button class="lg" data-l="en">EN</button><button class="lg" data-l="fr">FR</button><button class="lg" data-l="ar">ع</button><a class="done" href="admin.html">✓ Done</a>';
  document.body.appendChild(bar); document.body.classList.add("ad-editing");
  bar.querySelector("select").addEventListener("change", function () { location.href = this.value + ".html?edit=1"; });
  bar.querySelectorAll("[data-l]").forEach(function (b) { b.addEventListener("click", function () { S.setLang(b.dataset.l); }); });
  function toast(m, bad) { var t = el("div", "ad-edit ad-etoast" + (bad ? " bad" : ""), esc(m)); document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3500); }
  if (!tok()) { toast("Please log in to the dashboard first, then open “Edit website”.", true); return; }
  function clearCache() { try { localStorage.removeItem("amgCMS"); } catch (e) {} }

  document.addEventListener("click", function (ev) {
    if (ev.target.closest(".ad-edit")) return;
    var t = ev.target.closest("[data-cid]");
    ev.preventDefault(); ev.stopPropagation();
    if (!t) { if (ev.target.closest("a")) toast("Links are paused in edit mode — use the page list below."); return; }
    if (t.tagName === "IMG") openImg(t); else openText(t);
  }, true);
  document.addEventListener("submit", function (ev) { if (!ev.target.closest(".ad-edit")) ev.preventDefault(); }, true);

  function modal(html) { var m = el("div", "ad-edit ad-emod"), b = el("div", "ad-ebox", html); m.appendChild(b); document.body.appendChild(m); m.addEventListener("click", function (e) { if (e.target === m) m.remove(); }); return m; }
  function openText(t) {
    var isHtml = t.hasAttribute("data-fr-html");
    var en = isHtml ? (t.dataset.enHtml !== undefined ? t.dataset.enHtml : t.innerHTML) : (t.dataset.en !== undefined ? t.dataset.en : t.textContent);
    var fr = isHtml ? t.getAttribute("data-fr-html") : t.getAttribute("data-fr");
    var ar = (isHtml ? t.dataset.arHtml : t.dataset.ar) || (S.arText(en) || "");
    var m = modal("<h3>Edit text</h3><p>" + (isHtml ? "You may use &lt;b&gt;bold&lt;/b&gt; and links. " : "") + "Change the 3 languages, then Save. Visitors see it within a few minutes.</p>" +
      '<label>English</label><textarea class="e-en">' + esc(String(en).trim()) + '</textarea><label>Français</label><textarea class="e-fr">' + esc(String(fr || "").trim()) + '</textarea><label>العربية</label><textarea class="e-ar" dir="rtl">' + esc(String(ar).trim()) + "</textarea>" +
      '<div class="ad-erow"><button class="tr">Translate English → FR + AR</button></div><div class="ad-erow"><button class="sv">Save</button><button class="rs">Back to original</button><button class="cn">Cancel</button></div>');
    var q = function (s) { return m.querySelector(s); };
    q(".cn").onclick = function () { m.remove(); };
    q(".tr").onclick = function () {
      var src = q(".e-en").value.trim(); if (!src) return; this.textContent = "Translating…";
      var self = this;
      Promise.all([call("translate", { text: src, from: "en", to: "fr" }), call("translate", { text: src, from: "en", to: "ar" })]).then(function (r) {
        if (r[0].ok) q(".e-fr").value = r[0].text; if (r[1].ok) q(".e-ar").value = r[1].text; self.textContent = "Translate English → FR + AR";
        if (!r[0].ok) toast(r[0].error === "auth" ? "Session ended — log in again in the dashboard." : "Could not translate.", true);
      }).catch(function () { self.textContent = "Translate English → FR + AR"; toast("Connection problem.", true); });
    };
    q(".sv").onclick = function () {
      var it = { key: "e:" + t.dataset.cid, page: S.page(), en: q(".e-en").value.trim(), fr: q(".e-fr").value.trim(), ar: q(".e-ar").value.trim() };
      if (!it.en && !it.fr && !it.ar) return toast("Write the text first.", true);
      this.textContent = "Saving…";
      call("content_set", { items: [it] }).then(function (r) {
        if (!r.ok) { toast(r.error === "auth" ? "Session ended — log in again in the dashboard." : "Error: " + r.error, true); return; }
        S.applyOne(it.key, it); clearCache(); m.remove(); toast("Saved ✓ — live for everyone within 5 minutes.");
      }).catch(function () { toast("Connection problem.", true); });
    };
    q(".rs").onclick = function () {
      if (!confirm("Remove your change and show the original text again?")) return;
      call("content_set", { items: [{ key: "e:" + t.dataset.cid, remove: true }] }).then(function (r) { if (!r.ok) return toast("Error: " + r.error, true); clearCache(); toast("Original restored."); setTimeout(function () { location.reload(); }, 800); });
    };
  }
  function shrink(file) {
    return new Promise(function (res, rej) {
      var img = new Image(), u = URL.createObjectURL(file);
      img.onload = function () { var k = Math.min(1, 1800 / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u); var d = c.toDataURL("image/jpeg", 0.85); res({ type: "image/jpeg", data: d.split(",")[1] }); };
      img.onerror = rej; img.src = u;
    });
  }
  function openImg(t) {
    var m = modal('<h3>Change picture</h3><p>Choose a photo from your phone (JPG or PNG). It is resized automatically.</p><img src="' + esc(t.currentSrc || t.src) + '" alt=""><input type="file" accept="image/*" class="e-file"><div class="ad-erow"><button class="sv">Upload &amp; save</button><button class="rs">Back to original</button><button class="cn">Cancel</button></div>');
    var q = function (s) { return m.querySelector(s); };
    q(".cn").onclick = function () { m.remove(); };
    q(".e-file").onchange = function () { var f = this.files[0]; if (f) q("img").src = URL.createObjectURL(f); };
    q(".sv").onclick = function () {
      var f = q(".e-file").files[0]; if (!f) return toast("Choose a photo first.", true);
      var b = this; b.textContent = "Uploading…";
      shrink(f).then(function (file) { return call("upload_image", { file: file }); }).then(function (r) {
        if (!r.ok) throw new Error(r.error);
        var it = { key: "e:" + t.dataset.cid, page: S.page(), img: r.url };
        return call("content_set", { items: [it] }).then(function (r2) { if (!r2.ok) throw new Error(r2.error); S.applyOne(it.key, it); clearCache(); m.remove(); toast("Picture saved ✓"); });
      }).catch(function (e) { b.textContent = "Upload & save"; toast(String(e.message) === "auth" ? "Session ended — log in again in the dashboard." : "Could not upload: " + e.message, true); });
    };
    q(".rs").onclick = function () { call("content_set", { items: [{ key: "e:" + t.dataset.cid, remove: true }] }).then(function () { clearCache(); location.reload(); }); };
  }
})();
