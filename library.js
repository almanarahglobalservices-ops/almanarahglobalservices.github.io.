/* AL MANARAH — Islamic library (Quran, Adhkar, Hadith, Books). Loaded only on library.html. */
(function () {
  "use strict";
  var root = document.getElementById("library");
  if (!root) return;

  var QAPI = "https://api.alquran.cloud/v1/";
  var HAPI = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/";
  var AUDIO = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/";

  function fr() { return (document.documentElement.lang || "en").slice(0, 2) === "fr"; }
  function t(en, f) { return fr() ? f : en; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function el(id) { return document.getElementById(id); }
  function arTxt(s) { return esc(s).replace(/,/g, "،").replace(/;/g, "؛").replace(/\?/g, "؟"); }
  function load(box) { box.innerHTML = '<div class="lib-load">' + t("Loading…", "Chargement…") + "</div>"; }
  function fail(box, retry) {
    box.innerHTML = '<div class="lib-load">' + t("Could not load. Please check your connection.", "Chargement impossible. Vérifiez votre connexion.") + ' <button type="button" class="lib-btn">' + t("Try again", "Réessayer") + "</button></div>";
    box.querySelector("button").onclick = retry;
  }
  var cache = {};
  function getJSON(url) {
    if (cache[url]) return Promise.resolve(cache[url]);
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (s) { return JSON.parse(s.replace(/^\uFEFF/, "")); }).then(function (d) { cache[url] = d; return d; });
  }
  function save(k, v) { try { localStorage.setItem("lib_" + k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem("lib_" + k); } catch (e) { return null; } }

  /* ---------- Tabs ---------- */
  var current = "quran", started = {};
  var tabs = root.querySelectorAll("[data-lib]");
  function show(name) {
    current = name;
    tabs.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.lib === name ? "true" : "false"); });
    ["quran", "adhkar", "hadith", "live", "books"].forEach(function (n) { el("lib-" + n).hidden = n !== name; });
    if (name !== "live" && LV.video) LV.video.pause();
    if (name !== "quran" && Q.playing >= 0) stopAudio();
    if (!started[name]) { started[name] = true; RENDER[name](); }
    if (history.replaceState) history.replaceState(null, "", "#" + name);
  }
  tabs.forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.lib); }); });

  /* ---------- Quran ---------- */
  var Q = { list: null, surah: +(read("surah") || 1), audio: null, playing: -1, ayahs: [], tr: read("qtr") !== "0", tl: read("qtl") === "1", mus: read("qmus") !== "0", page: +(read("qpage") || 1) };
  var MUSHAF = "https://cdn.jsdelivr.net/gh/GovarJabbar/Quran-PNG@master/";
  function arNum(n) { return String(n).replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[d]; }); }
  function quran() {
    var box = el("lib-quran"); load(box);
    getJSON(QAPI + "surah").then(function (d) { Q.list = d.data; quranUI(); }).catch(function () { fail(box, quran); });
  }
  function quranUI() {
    var box = el("lib-quran");
    var opts = Q.list.map(function (s) { return '<option value="' + s.number + '"' + (s.number === Q.surah ? " selected" : "") + ">" + s.number + ". " + esc(s.englishName) + " — " + esc(s.englishNameTranslation) + " (" + s.numberOfAyahs + ")</option>"; }).join("");
    box.innerHTML = '<div class="lib-bar"><button type="button" class="lib-btn" id="qPrev" aria-label="' + t("Previous surah", "Sourate précédente") + '">‹</button><select id="qSel" aria-label="' + t("Choose a surah", "Choisir une sourate") + '">' + opts + '</select><button type="button" class="lib-btn" id="qNext" aria-label="' + t("Next surah", "Sourate suivante") + '">›</button><button type="button" class="lib-btn" id="qPlay">▶ ' + t("Listen", "Écouter") + '</button></div>' +
      '<div class="lib-bar lib-modes" role="group" aria-label="' + t("Reading mode", "Mode de lecture") + '"><button type="button" class="lib-btn" data-m="mus">📖 ' + t("Mushaf (pages)", "Mushaf (pages)") + '</button><button type="button" class="lib-btn" data-m="ar">' + t("Quran only", "Coran seul") + '</button><button type="button" class="lib-btn" data-m="tr">' + t("Translation", "Traduction") + '</button><button type="button" class="lib-btn" data-m="tl">' + t("Transliteration", "Translittération") + '</button></div><div id="qBody"></div>';
    el("qSel").onchange = function () { go(+this.value); };
    el("qPrev").onclick = function () { if (Q.surah > 1) go(Q.surah - 1); };
    el("qNext").onclick = function () { if (Q.surah < 114) go(Q.surah + 1); };
    el("qPlay").onclick = function () { if (Q.playing >= 0) stopAudio(); else playAyah(0); };
    box.querySelectorAll("[data-m]").forEach(function (b) {
      b.onclick = function () {
        var m = b.dataset.m;
        if (m === "mus") { Q.mus = true; }
        else { Q.mus = false; if (m === "ar") { Q.tr = false; Q.tl = false; } else { Q[m] = !Q[m]; } }
        save("qmus", Q.mus ? "1" : "0"); save("qtr", Q.tr ? "1" : "0"); save("qtl", Q.tl ? "1" : "0"); modes();
        if (Q.mus) surahPage(Q.surah); else openSurah(Q.surah);
      };
    });
    modes(); if (Q.mus) showPage(Q.page); else openSurah(Q.surah);
  }
  function go(n) { if (Q.mus) surahPage(n); else openSurah(n); }
  function modes() {
    document.querySelectorAll(".lib-modes [data-m]").forEach(function (b) {
      var m = b.dataset.m, on = m === "mus" ? Q.mus : (!Q.mus && (m === "ar" ? (!Q.tr && !Q.tl) : Q[m]));
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var p = el("qPlay"); if (p) p.hidden = Q.mus;
  }
  /* Mushaf: page images of the Madinah Mushaf (Hafs), 604 pages, swipe like a real mushaf */
  function surahPage(n) {
    Q.surah = n; save("surah", n); var sel = el("qSel"); if (sel) sel.value = n;
    var body = el("qBody"); load(body);
    getJSON(QAPI + "surah/" + n).then(function (d) { showPage(d.data.ayahs[0].page || 1, true); }).catch(function () { fail(body, function () { surahPage(n); }); });
  }
  function showPage(p, keep) {
    stopAudio();
    p = Math.max(1, Math.min(604, p)); Q.page = p; save("qpage", p);
    var body = el("qBody");
    if (!el("mPage")) {
      body.innerHTML = '<div class="lib-mus"><div class="lib-mus-bar"><button type="button" class="lib-btn" id="mNext">‹ ' + t("Next page", "Page suivante") + '</button><label class="lib-mus-num">' + t("Page", "Page") + ' <input type="number" id="mNum" min="1" max="604" inputmode="numeric"> / 604</label><button type="button" class="lib-btn" id="mPrev">' + t("Previous page", "Page précédente") + ' ›</button></div>' +
        '<div class="lib-mus-frame" id="mFrame"><img id="mPage" alt="" decoding="async"></div><p class="lib-note">' + t("Madinah Mushaf (Hafs). Swipe to turn the page, like a real mushaf.", "Mushaf de Médine (Hafs). Glissez pour tourner la page, comme un vrai mushaf.") + "</p></div>";
      el("mNext").onclick = function () { showPage(Q.page + 1); };
      el("mPrev").onclick = function () { showPage(Q.page - 1); };
      el("mNum").onchange = function () { showPage(+this.value || 1); };
      var f = el("mFrame"), x0 = null, y0 = null;
      f.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
      f.addEventListener("touchend", function (e) {
        if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showPage(Q.page + (dx > 0 ? 1 : -1));
      });
      if (!Q.keys) Q.keys = true, document.addEventListener("keydown", function (e) { if (!Q.mus || current !== "quran" || /input|select|textarea/i.test(e.target.tagName)) return; if (e.key === "ArrowLeft") showPage(Q.page + 1); if (e.key === "ArrowRight") showPage(Q.page - 1); });
    }
    var img = el("mPage"); img.classList.add("lib-fade");
    img.onload = function () { img.classList.remove("lib-fade"); };
    img.src = MUSHAF + String(p).padStart(3, "0") + ".png";
    img.alt = t("Quran page ", "Coran page ") + p;
    el("mNum").value = p;
    el("mNext").disabled = p >= 604; el("mPrev").disabled = p <= 1;
    [p + 1, p - 1].forEach(function (n) { if (n >= 1 && n <= 604) { var im = new Image(); im.src = MUSHAF + String(n).padStart(3, "0") + ".png"; } });
    if (Q.list && !keep) { var s = surahOfPage(p); if (s) { Q.surah = s; save("surah", s); var sel = el("qSel"); if (sel) sel.value = s; } }
  }
  var PAGES = null;
  function surahOfPage(p) {
    if (!PAGES) { getJSON(QAPI + "meta").then(function (d) { PAGES = d.data.pages.references; showSel(); }).catch(function () {}); return 0; }
    var r = PAGES[p - 1]; return r ? r.surah : 0;
  }
  function showSel() { var s = surahOfPage(Q.page); var sel = el("qSel"); if (s && sel) { Q.surah = s; sel.value = s; } }
  function openSurah(n) {
    stopAudio(); Q.surah = n; save("surah", n);
    var sel = el("qSel"); if (sel) sel.value = n;
    var body = el("qBody"); load(body);
    var eds = ["quran-uthmani"]; if (Q.tr) eds.push(t("en.sahih", "fr.hamidullah")); if (Q.tl) eds.push("en.transliteration");
    getJSON(QAPI + "surah/" + n + "/editions/" + eds.join(",")).then(function (d) {
      var ar = d.data[0], k = 1, tr = Q.tr ? d.data[k++] : null, tl = Q.tl ? d.data[k++] : null, meta = Q.list[n - 1];
      Q.ayahs = ar.ayahs.map(function (a) { return a.number; });
      var h = '<div class="lib-head"><div class="lib-ar">' + esc(meta.name) + "</div><h2>" + esc(meta.englishName) + " · " + esc(meta.englishNameTranslation) + '</h2><div class="lib-src">' + meta.numberOfAyahs + " " + t("verses", "versets") + " · " + (meta.revelationType === "Meccan" ? t("Makkah", "La Mecque") : t("Madinah", "Médine")) + "</div></div>";
      if (!tr && !tl) {
        h += '<div class="lib-card lib-mushaf" dir="rtl">' + ar.ayahs.map(function (a, i) { return '<span class="lib-aya" id="ay' + i + '" data-i="' + i + '">' + esc(a.text) + ' <span class="lib-ayn">﴿' + arNum(a.numberInSurah) + "﴾</span></span> "; }).join("") + "</div>";
        h += '<p class="lib-note">' + t("Tap a verse to hear it.", "Touchez un verset pour l’écouter.") + "</p>";
      } else {
        h += ar.ayahs.map(function (a, i) {
          return '<div class="lib-card" id="ay' + i + '"><div class="lib-meta"><span class="lib-num">' + a.numberInSurah + '</span><button type="button" class="lib-play" data-i="' + i + '" aria-label="' + t("Play verse", "Écouter le verset") + '">▶</button></div><div class="lib-ar">' + esc(a.text) + "</div>" +
            (tl ? '<div class="lib-tr">' + esc(tl.ayahs[i] ? tl.ayahs[i].text : "") + "</div>" : "") +
            (tr ? '<div class="lib-tx">' + esc(tr.ayahs[i] ? tr.ayahs[i].text : "") + "</div>" : "") + "</div>";
        }).join("");
        if (tr) h += '<p class="lib-note">' + t("Translation: Saheeh International.", "Traduction : Muhammad Hamidullah.") + "</p>";
      }
      h += '<p class="lib-note">' + t("Recitation: Mishary Alafasy.", "Récitation : Mishary Alafasy.") + "</p>";
      body.innerHTML = h;
      body.querySelectorAll(".lib-play, .lib-aya").forEach(function (b) { b.onclick = function () { var i = +b.dataset.i; if (Q.playing === i) stopAudio(); else playAyah(i); }; });
    }).catch(function () { fail(body, function () { openSurah(n); }); });
  }
  function mark() {
    document.querySelectorAll("#qBody .lib-play").forEach(function (b) { var on = +b.dataset.i === Q.playing; b.classList.toggle("on", on); b.textContent = on ? "❚❚" : "▶"; });
    document.querySelectorAll("#qBody .lib-aya").forEach(function (b) { b.classList.toggle("on", +b.dataset.i === Q.playing); });
    var p = el("qPlay"); if (p) p.textContent = Q.playing >= 0 ? "■ " + t("Stop", "Arrêter") : "▶ " + t("Listen", "Écouter");
  }
  function playAyah(i) {
    if (i >= Q.ayahs.length) { stopAudio(); return; }
    if (!Q.audio) { Q.audio = new Audio(); Q.audio.addEventListener("ended", function () { if (Q.playing >= 0) playAyah(Q.playing + 1); }); }
    Q.playing = i; Q.audio.src = AUDIO + Q.ayahs[i] + ".mp3";
    Q.audio.play().catch(function () {}); mark();
    var c = el("ay" + i); if (c && c.scrollIntoView) c.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function stopAudio() { if (Q.audio) Q.audio.pause(); Q.playing = -1; mark(); }

  /* ---------- Adhkar (Hisn al-Muslim, all chapters) ---------- */
  var HISN = "https://www.hisnmuslim.com/api/en/";
  var A = { list: null, ch: 0, q: "" };
  var QUICK = [27, 28, 1, 2, 20, 21, 25, 26, 6, 7];
  function adhkar() {
    var box = el("lib-adhkar"); load(box);
    getJSON(HISN + "husn_en.json").then(function (d) { A.list = (d.English || []).map(function (c) { return { id: +c.ID, t: c.TITLE }; }).sort(function (x, y) { return x.id - y.id; }); adhkarList(); }).catch(function () { fail(box, adhkar); });
  }
  function adhkarList() {
    var box = el("lib-adhkar");
    var quick = QUICK.map(function (id) { var c = A.list.filter(function (x) { return x.id === id; })[0]; return c ? '<button type="button" class="lib-btn" data-c="' + c.id + '">' + esc(c.t) + "</button>" : ""; }).join("");
    box.innerHTML = '<p class="lib-note">' + t("Hisn al-Muslim (Fortress of the Muslim) — choose the occasion.", "Hisn al-Muslim (La citadelle du musulman) — choisissez l’occasion. Traductions en anglais.") + '</p><div class="lib-bar lib-quick">' + quick + '</div><input type="search" class="lib-search" id="aQ" placeholder="' + t("Search: mosque, sleep, travel, rain…", "Rechercher (en anglais) : mosque, sleep, travel…") + '" value="' + esc(A.q) + '"><div class="lib-chlist" id="aList"></div>';
    var input = el("aQ");
    function draw() {
      var q = A.q.toLowerCase().trim();
      var items = A.list.filter(function (c) { return !q || c.t.toLowerCase().indexOf(q) >= 0 || String(c.id) === q; });
      el("aList").innerHTML = items.length ? items.map(function (c) { return '<button type="button" class="lib-ch" data-c="' + c.id + '"><span class="lib-num">' + c.id + "</span>" + esc(c.t) + "</button>"; }).join("") : '<div class="lib-load">' + t("No chapter found.", "Aucun chapitre trouvé.") + "</div>";
      el("aList").querySelectorAll("[data-c]").forEach(function (b) { b.onclick = function () { openChapter(+b.dataset.c); }; });
    }
    input.oninput = function () { A.q = input.value; draw(); };
    box.querySelectorAll(".lib-quick [data-c]").forEach(function (b) { b.onclick = function () { openChapter(+b.dataset.c); }; });
    draw();
  }
  function openChapter(id) {
    A.ch = id; var box = el("lib-adhkar"); load(box);
    var c = A.list.filter(function (x) { return x.id === id; })[0] || { t: "" };
    getJSON(HISN + id + ".json").then(function (d) {
      var items = d[Object.keys(d)[0]] || [];
      var h = '<div class="lib-bar"><button type="button" class="lib-btn" id="aBack">‹ ' + t("All occasions", "Toutes les occasions") + '</button></div><div class="lib-head"><h2>' + esc(c.t) + "</h2></div>";
      h += items.map(function (x, i) {
        var n = +x.REPEAT || 1;
        return '<div class="lib-card"><div class="lib-meta"><span class="lib-num">' + (i + 1) + '</span><span style="display:flex;gap:8px">' + (x.AUDIO ? '<button type="button" class="lib-play" data-a="' + esc(String(x.AUDIO).replace(/^http:/, "https:")) + '" aria-label="' + t("Listen", "Écouter") + '">▶</button>' : "") + '<button type="button" class="lib-count" data-n="' + n + '">' + n + " ×</button></span></div><div class=\"lib-ar\">" + arTxt(x.ARABIC_TEXT) + '</div><div class="lib-tr">' + esc(x.LANGUAGE_ARABIC_TRANSLATED_TEXT) + '</div><div class="lib-tx">' + esc(x.TRANSLATED_TEXT) + "</div></div>";
      }).join("");
      h += '<p class="lib-note">' + t("Source: Hisn al-Muslim by Sa'id ibn Wahf al-Qahtani (hisnmuslim.com).", "Source : Hisn al-Muslim de Sa'id ibn Wahf al-Qahtani (hisnmuslim.com).") + "</p>";
      box.innerHTML = h;
      el("aBack").onclick = adhkarList;
      counters(box);
      var au = null, cur = null;
      box.querySelectorAll("[data-a]").forEach(function (b) {
        b.onclick = function () {
          if (!au) { au = new Audio(); au.addEventListener("ended", function () { if (cur) { cur.textContent = "▶"; cur.classList.remove("on"); cur = null; } }); }
          if (cur === b) { au.pause(); b.textContent = "▶"; b.classList.remove("on"); cur = null; return; }
          if (cur) { cur.textContent = "▶"; cur.classList.remove("on"); }
          cur = b; b.textContent = "❚❚"; b.classList.add("on"); au.src = b.dataset.a; au.play().catch(function () {});
        };
      });
      window.scrollTo({ top: el("library").offsetTop - 80, behavior: "smooth" });
    }).catch(function () { fail(box, function () { openChapter(id); }); });
  }
  function counters(box) {
    box.querySelectorAll(".lib-count").forEach(function (b) {
      var left = +b.dataset.n;
      b.onclick = function () {
        if (left <= 0) { left = +b.dataset.n; b.classList.remove("done"); b.textContent = left + " ×"; return; }
        left--; b.textContent = left > 0 ? left + " ×" : "✓ " + t("Done", "Terminé"); if (left <= 0) b.classList.add("done");
        if (navigator.vibrate) navigator.vibrate(15);
      };
    });
  }

  /* ---------- Hadith ---------- */
  var H = { books: null, book: read("hbook") || "nawawi", sec: +(read("hsec") || 1), shown: 0, list: [] };
  function hadith() {
    var box = el("lib-hadith"); load(box);
    getJSON("hadith-books.json").then(function (d) { H.books = d; hadithUI(); }).catch(function () { fail(box, hadith); });
  }
  function bookOf(id) { return H.books.filter(function (b) { return b.id === id; })[0] || H.books[0]; }
  function lgOf(b) { return fr() && b.fr ? "fra" : "eng"; }
  function hadithUI() {
    var box = el("lib-hadith"), b = bookOf(H.book);
    if (!b.s.some(function (s) { return s[0] === H.sec; })) H.sec = b.s[0][0];
    var bo = H.books.map(function (x) { return '<option value="' + x.id + '"' + (x.id === b.id ? " selected" : "") + ">" + esc(x.name) + "</option>"; }).join("");
    var so = b.s.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === H.sec ? " selected" : "") + ">" + s[0] + ". " + esc(s[1]) + "</option>"; }).join("");
    box.innerHTML = '<div class="lib-bar"><select id="hBook" aria-label="' + t("Collection", "Recueil") + '">' + bo + '</select><select id="hSec" aria-label="' + t("Chapter", "Chapitre") + '"' + (b.s.length < 2 ? " hidden" : "") + ">" + so + '</select></div>' +
      '<form class="lib-bar" id="hForm" role="search"><input type="search" class="lib-search" id="hQ" style="flex:1 1 220px;margin:0" placeholder="' + t("Search this collection: a word or hadith number", "Rechercher dans ce recueil : un mot ou un numéro") + '"><button type="submit" class="lib-btn on">' + t("Search", "Rechercher") + '</button></form><div id="hBody"></div>';
    el("hBook").onchange = function () { H.book = this.value; save("hbook", H.book); H.sec = bookOf(H.book).s[0][0]; save("hsec", H.sec); hadithUI(); };
    el("hSec").onchange = function () { H.sec = +this.value; save("hsec", H.sec); openSection(); };
    el("hForm").onsubmit = function (e) { e.preventDefault(); var q = el("hQ").value.trim(); if (q) search(q); else openSection(); };
    openSection();
  }
  function openSection() {
    H.q = "";
    var b = bookOf(H.book), body = el("hBody"); load(body);
    var lg = lgOf(b);
    var url = function (l) { return HAPI + l + "-" + b.id + "/sections/" + H.sec + ".min.json"; };
    Promise.all([getJSON(url("ara")), getJSON(url(lg))]).then(function (r) {
      var tr = {}; r[1].hadiths.forEach(function (x) { tr[x.hadithnumber] = x; });
      H.list = r[0].hadiths.filter(function (x) { return x.text || (tr[x.hadithnumber] && tr[x.hadithnumber].text); }).map(function (x) { return { n: x.hadithnumber, ar: x.text, tx: tr[x.hadithnumber] ? tr[x.hadithnumber].text : "", g: (tr[x.hadithnumber] && tr[x.hadithnumber].grades) || x.grades || [] }; });
      H.shown = 0; body.innerHTML = '<div id="hList"></div>';
      if (fr() && !b.fr) body.insertAdjacentHTML("afterbegin", '<p class="lib-note">Traduction de ce recueil disponible en anglais.</p>');
      more();
    }).catch(function () { fail(body, openSection); });
  }
  function card(b, x, q) {
    var g = x.g && x.g.length ? '<div class="lib-src">' + t("Grade", "Authenticité") + ": " + esc(x.g.map(function (y) { return y.grade + (y.name ? " (" + y.name + ")" : ""); }).join(" · ")) + "</div>" : "";
    var tx = esc(x.tx);
    if (q) { var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"); tx = tx.replace(re, "<mark>$1</mark>"); }
    var ar = x.ar != null ? '<div class="lib-ar" style="font-size:1.25rem;line-height:2">' + arTxt(x.ar) + "</div>" : '<button type="button" class="lib-btn" data-ar="' + x.n + '">' + t("Show Arabic", "Afficher l’arabe") + "</button>";
    return '<div class="lib-card"><div class="lib-meta"><span>' + esc(b.name) + " · " + x.n + "</span></div>" + ar + '<div class="lib-tx">' + tx + "</div>" + g + "</div>";
  }
  function more() {
    var list = el("hList"), b = bookOf(H.book), next = H.list.slice(H.shown, H.shown + 15);
    var old = document.getElementById("hMore"); if (old) old.remove();
    list.insertAdjacentHTML("beforeend", next.map(function (x) { return card(b, x, H.q); }).join(""));
    H.shown += next.length;
    list.querySelectorAll("[data-ar]").forEach(function (btn) {
      btn.onclick = function () {
        btn.disabled = true; btn.textContent = t("Loading…", "Chargement…");
        getJSON(HAPI + "ara-" + b.id + "/" + btn.dataset.ar + ".min.json").then(function (d) {
          var h = d.hadiths && d.hadiths[0]; btn.outerHTML = '<div class="lib-ar" style="font-size:1.25rem;line-height:2">' + arTxt(h ? h.text : "") + "</div>";
        }).catch(function () { btn.disabled = false; btn.textContent = t("Try again", "Réessayer"); });
      };
    });
    if (H.shown < H.list.length) {
      list.insertAdjacentHTML("afterend", '<button type="button" class="lib-btn lib-more" id="hMore">' + t("Show more", "Voir plus") + " (" + (H.list.length - H.shown) + ")</button>");
      el("hMore").onclick = more;
    }
  }
  function search(q) {
    var b = bookOf(H.book), body = el("hBody"), lg = lgOf(b);
    body.innerHTML = '<div class="lib-load">' + t("Searching ", "Recherche dans ") + esc(b.name) + "… " + t("(the first search can take a few seconds)", "(la première recherche peut prendre quelques secondes)") + "</div>";
    var num = /^\d+$/.test(q);
    var p = num ? Promise.all([getJSON(HAPI + lg + "-" + b.id + "/" + q + ".min.json"), getJSON(HAPI + "ara-" + b.id + "/" + q + ".min.json")]).then(function (r) {
      var x = r[0].hadiths[0], a = r[1].hadiths[0];
      return [{ n: x.hadithnumber, tx: x.text, ar: a ? a.text : "", g: x.grades || [] }];
    }) : getJSON(HAPI + lg + "-" + b.id + ".min.json").then(function (d) {
      var words = q.toLowerCase().split(/\s+/).filter(Boolean);
      return d.hadiths.filter(function (x) { var s = (x.text || "").toLowerCase(); return words.every(function (w) { return s.indexOf(w) >= 0; }); })
        .map(function (x) { return { n: x.hadithnumber, tx: x.text, ar: null, g: x.grades || [] }; });
    });
    p.then(function (res) {
      H.list = res; H.shown = 0; H.q = num ? "" : q;
      body.innerHTML = '<p class="lib-note">' + res.length + " " + t("result(s) for", "résultat(s) pour") + " « " + esc(q) + " » — " + esc(b.name) + ' <button type="button" class="lib-btn" id="hClear">' + t("Back to chapters", "Retour aux chapitres") + '</button></p><div id="hList"></div>';
      el("hClear").onclick = function () { H.q = ""; el("hQ").value = ""; openSection(); };
      if (res.length) more(); else el("hList").innerHTML = '<div class="lib-load">' + t("No hadith found. Try another word.", "Aucun hadith trouvé. Essayez un autre mot.") + "</div>";
    }).catch(function () { fail(body, function () { search(q); }); });
  }

  /* ---------- Live from Makkah & Madinah ---------- */
  var LV = { video: null, hls: null, city: "makkah" };
  var STREAMS = {
    makkah: { url: "https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8", en: "Makkah — Masjid al-Haram (Saudi Quran TV)", fr: "La Mecque — Masjid al-Haram (Saudi Quran TV)" },
    madinah: { url: "https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8", en: "Madinah — Masjid an-Nabawi (Saudi Sunnah TV)", fr: "Médine — Masjid an-Nabawi (Saudi Sunnah TV)" }
  };
  function live() {
    var box = el("lib-live");
    box.innerHTML = '<div class="lib-bar" style="justify-content:center"><button type="button" class="lib-btn" data-city="makkah">🕋 ' + t("Makkah live", "La Mecque en direct") + '</button><button type="button" class="lib-btn" data-city="madinah">🕌 ' + t("Madinah live", "Médine en direct") + '</button></div>' +
      '<div class="lib-card lib-live"><div class="lib-meta"><span id="lvTitle"></span><span class="lib-dot">● LIVE</span></div><video id="lvVideo" controls playsinline muted autoplay preload="none"></video><div class="lib-src" id="lvMsg">' + t("The video starts muted — tap the speaker icon for sound.", "La vidéo démarre sans son — touchez l’icône du haut-parleur.") + "</div></div>" +
      '<p class="lib-note">' + t("Official 24/7 broadcasts of the Saudi Broadcasting Authority.", "Diffusions officielles 24h/24 de l’Autorité saoudienne de radiodiffusion.") + "</p>";
    LV.video = el("lvVideo");
    box.querySelectorAll("[data-city]").forEach(function (b) { b.onclick = function () { play(b.dataset.city); }; });
    play(LV.city);
  }
  function play(city) {
    LV.city = city; var s = STREAMS[city], v = LV.video;
    document.querySelectorAll("#lib-live [data-city]").forEach(function (b) { b.classList.toggle("on", b.dataset.city === city); });
    el("lvTitle").textContent = fr() ? s.fr : s.en;
    if (LV.hls) { LV.hls.destroy(); LV.hls = null; }
    function err() { el("lvMsg").textContent = t("The live stream could not start. Please try again in a moment.", "Le direct n’a pas pu démarrer. Réessayez dans un instant."); }
    if (v.canPlayType("application/vnd.apple.mpegurl")) { v.src = s.url; v.play().catch(function () {}); return; }
    function start() {
      if (!window.Hls || !window.Hls.isSupported()) return err();
      LV.hls = new window.Hls({ enableWorker: false, lowLatencyMode: false });
      LV.hls.on(window.Hls.Events.ERROR, function (e, d) { if (d && d.fatal) err(); });
      LV.hls.loadSource(s.url); LV.hls.attachMedia(v);
      LV.hls.on(window.Hls.Events.MANIFEST_PARSED, function () { v.play().catch(function () {}); });
    }
    if (window.Hls) return start();
    var sc = document.createElement("script"); sc.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js"; sc.onload = start; sc.onerror = err; document.head.appendChild(sc);
  }

  /* ---------- Books ---------- */
  var BOOKS = [
    ["https://quran.com", "Quran.com", "Quran with many translations, tafsir and recitations.", "Le Coran avec de nombreuses traductions, tafsir et récitations."],
    ["https://sunnah.com", "Sunnah.com", "The major hadith collections with search, in Arabic and English.", "Les grands recueils de hadiths avec recherche, en arabe et en anglais."],
    ["https://sunnah.com/riyadussalihin", "Riyad as-Salihin", "Imam an-Nawawi’s Gardens of the Righteous.", "Les Jardins des vertueux de l’imam an-Nawawi."],
    ["https://sunnah.com/hisn", "Hisn al-Muslim", "Fortress of the Muslim — duas for every occasion.", "La citadelle du musulman — invocations pour chaque occasion."],
    ["https://islamhouse.com/en/books/", "IslamHouse — English books", "Free Islamic books in English: creed, fiqh, Hajj and Umrah.", "Livres islamiques gratuits en anglais : croyance, fiqh, Hajj et Omra."],
    ["https://islamhouse.com/fr/books/", "IslamHouse — Livres en français", "Free Islamic books in French.", "Livres islamiques gratuits en français."]
  ];
  function books() {
    el("lib-books").innerHTML = '<div class="lib-books">' + BOOKS.map(function (b) {
      return '<a class="lib-card" href="' + b[0] + '" target="_blank" rel="noopener"><h3>' + esc(b[1]) + " ↗</h3><p>" + esc(fr() ? b[3] : b[2]) + "</p></a>";
    }).join("") + '</div><p class="lib-note">' + t("These trusted libraries open in a new tab.", "Ces bibliothèques de confiance s’ouvrent dans un nouvel onglet.") + "</p>";
  }

  var RENDER = { quran: quran, adhkar: adhkar, hadith: hadith, live: live, books: books };

  /* re-render the open panel when the visitor switches EN/FR */
  var lastLang = fr();
  new MutationObserver(function () {
    if (fr() === lastLang) return; lastLang = fr();
    started = {}; started[current] = true;
    if (current === "quran" && Q.list) quranUI(); else RENDER[current]();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  var start = (location.hash || "").slice(1);
  show(RENDER[start] ? start : "quran");
})();
