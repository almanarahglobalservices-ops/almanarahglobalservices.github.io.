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
  function load(box) { box.innerHTML = '<div class="lib-load">' + t("Loading…", "Chargement…") + "</div>"; }
  function fail(box, retry) {
    box.innerHTML = '<div class="lib-load">' + t("Could not load. Please check your connection.", "Chargement impossible. Vérifiez votre connexion.") + ' <button type="button" class="lib-btn">' + t("Try again", "Réessayer") + "</button></div>";
    box.querySelector("button").onclick = retry;
  }
  var cache = {};
  function getJSON(url) {
    if (cache[url]) return Promise.resolve(cache[url]);
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) { cache[url] = d; return d; });
  }
  function save(k, v) { try { localStorage.setItem("lib_" + k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem("lib_" + k); } catch (e) { return null; } }

  /* ---------- Tabs ---------- */
  var current = "quran", started = {};
  var tabs = root.querySelectorAll("[data-lib]");
  function show(name) {
    current = name;
    tabs.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.lib === name ? "true" : "false"); });
    ["quran", "adhkar", "hadith", "books"].forEach(function (n) { el("lib-" + n).hidden = n !== name; });
    if (!started[name]) { started[name] = true; RENDER[name](); }
    if (history.replaceState) history.replaceState(null, "", "#" + name);
  }
  tabs.forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.lib); }); });

  /* ---------- Quran ---------- */
  var Q = { list: null, surah: +(read("surah") || 1), audio: null, playing: -1, ayahs: [] };
  function quran() {
    var box = el("lib-quran"); load(box);
    getJSON(QAPI + "surah").then(function (d) { Q.list = d.data; quranUI(); }).catch(function () { fail(box, quran); });
  }
  function quranUI() {
    var box = el("lib-quran");
    var opts = Q.list.map(function (s) { return '<option value="' + s.number + '"' + (s.number === Q.surah ? " selected" : "") + ">" + s.number + ". " + esc(s.englishName) + " — " + esc(s.englishNameTranslation) + " (" + s.numberOfAyahs + ")</option>"; }).join("");
    box.innerHTML = '<div class="lib-bar"><button type="button" class="lib-btn" id="qPrev" aria-label="' + t("Previous surah", "Sourate précédente") + '">‹</button><select id="qSel" aria-label="' + t("Choose a surah", "Choisir une sourate") + '">' + opts + '</select><button type="button" class="lib-btn" id="qNext" aria-label="' + t("Next surah", "Sourate suivante") + '">›</button><button type="button" class="lib-btn" id="qPlay">▶ ' + t("Listen", "Écouter") + '</button></div><div id="qBody"></div>';
    el("qSel").onchange = function () { openSurah(+this.value); };
    el("qPrev").onclick = function () { if (Q.surah > 1) openSurah(Q.surah - 1); };
    el("qNext").onclick = function () { if (Q.surah < 114) openSurah(Q.surah + 1); };
    el("qPlay").onclick = function () { if (Q.playing >= 0) stopAudio(); else playAyah(0); };
    openSurah(Q.surah);
  }
  function openSurah(n) {
    stopAudio(); Q.surah = n; save("surah", n);
    var sel = el("qSel"); if (sel) sel.value = n;
    var body = el("qBody"); load(body);
    var ed = "quran-uthmani," + t("en.sahih", "fr.hamidullah");
    getJSON(QAPI + "surah/" + n + "/editions/" + ed).then(function (d) {
      var ar = d.data[0], tr = d.data[1], meta = Q.list[n - 1];
      Q.ayahs = ar.ayahs.map(function (a) { return a.number; });
      var h = '<div class="lib-head"><div class="lib-ar">' + esc(meta.name) + "</div><h2>" + esc(meta.englishName) + " · " + esc(meta.englishNameTranslation) + '</h2><div class="lib-src">' + meta.numberOfAyahs + " " + t("verses", "versets") + " · " + (meta.revelationType === "Meccan" ? t("Makkah", "La Mecque") : t("Madinah", "Médine")) + "</div></div>";
      h += ar.ayahs.map(function (a, i) {
        return '<div class="lib-card" id="ay' + i + '"><div class="lib-meta"><span class="lib-num">' + a.numberInSurah + '</span><button type="button" class="lib-play" data-i="' + i + '" aria-label="' + t("Play verse", "Écouter le verset") + '">▶</button></div><div class="lib-ar">' + esc(a.text) + '</div><div class="lib-tx">' + esc(tr.ayahs[i] ? tr.ayahs[i].text : "") + "</div></div>";
      }).join("");
      h += '<p class="lib-note">' + t("Translation: Saheeh International. Recitation: Mishary Alafasy.", "Traduction : Muhammad Hamidullah. Récitation : Mishary Alafasy.") + "</p>";
      body.innerHTML = h;
      body.querySelectorAll(".lib-play").forEach(function (b) { b.onclick = function () { var i = +b.dataset.i; if (Q.playing === i) stopAudio(); else playAyah(i); }; });
    }).catch(function () { fail(body, function () { openSurah(n); }); });
  }
  function mark() {
    document.querySelectorAll("#qBody .lib-play").forEach(function (b) { var on = +b.dataset.i === Q.playing; b.classList.toggle("on", on); b.textContent = on ? "❚❚" : "▶"; });
    var p = el("qPlay"); if (p) p.textContent = Q.playing >= 0 ? "■ " + t("Stop", "Arrêter") : "▶ " + t("Listen", "Écouter");
  }
  function playAyah(i) {
    if (i >= Q.ayahs.length) { stopAudio(); return; }
    if (!Q.audio) { Q.audio = new Audio(); Q.audio.addEventListener("ended", function () { playAyah(Q.playing + 1); }); }
    Q.playing = i; Q.audio.src = AUDIO + Q.ayahs[i] + ".mp3";
    Q.audio.play().catch(function () {}); mark();
    var c = el("ay" + i); if (c && c.scrollIntoView) c.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function stopAudio() { if (Q.audio) Q.audio.pause(); Q.playing = -1; mark(); }

  /* ---------- Adhkar ---------- */
  var A = { data: null, type: (new Date().getHours() >= 12 ? 2 : 1) };
  function adhkar() {
    var box = el("lib-adhkar"); load(box);
    getJSON("https://cdn.jsdelivr.net/gh/Seen-Arabic/Morning-And-Evening-Adhkar-DB@main/en.json").then(function (d) { A.data = d.map(function (x) { return { t: x.type, ar: x.content, en: x.translation, tr: x.transliteration, n: x.count || 1, src: x.source || "" }; }); adhkarUI(); }).catch(function () { fail(box, adhkar); });
  }
  function adhkarUI() {
    var box = el("lib-adhkar");
    var h = '<div class="lib-bar" style="justify-content:center"><button type="button" class="lib-btn' + (A.type === 1 ? " on" : "") + '" data-t="1">☀ ' + t("Morning adhkar", "Adhkar du matin") + '</button><button type="button" class="lib-btn' + (A.type === 2 ? " on" : "") + '" data-t="2">☾ ' + t("Evening adhkar", "Adhkar du soir") + "</button></div>";
    if (fr()) h += '<p class="lib-note">Traduction des adhkar disponible en anglais.</p>';
    h += A.data.filter(function (x) { return x.t === 0 || x.t === A.type; }).map(function (x, i) {
      return '<div class="lib-card"><div class="lib-meta"><span class="lib-num">' + (i + 1) + '</span><button type="button" class="lib-count" data-n="' + x.n + '">' + x.n + " × " + '</button></div><div class="lib-ar">' + esc(x.ar) + '</div><div class="lib-tr">' + esc(x.tr) + '</div><div class="lib-tx">' + esc(x.en) + '</div><div class="lib-src">' + esc(x.src) + "</div></div>";
    }).join("");
    h += '<p class="lib-note">' + t("Tap the counter each time you recite.", "Touchez le compteur à chaque récitation.") + " " + t("Source: Hisn al-Muslim and authentic Sunnah.", "Source : Hisn al-Muslim et la Sunna authentique.") + "</p>";
    box.innerHTML = h;
    box.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { A.type = +b.dataset.t; adhkarUI(); }; });
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
  function hadithUI() {
    var box = el("lib-hadith"), b = bookOf(H.book);
    if (!b.s.some(function (s) { return s[0] === H.sec; })) H.sec = b.s[0][0];
    var bo = H.books.map(function (x) { return '<option value="' + x.id + '"' + (x.id === b.id ? " selected" : "") + ">" + esc(x.name) + "</option>"; }).join("");
    var so = b.s.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === H.sec ? " selected" : "") + ">" + s[0] + ". " + esc(s[1]) + "</option>"; }).join("");
    box.innerHTML = '<div class="lib-bar"><select id="hBook" aria-label="' + t("Collection", "Recueil") + '">' + bo + '</select><select id="hSec" aria-label="' + t("Chapter", "Chapitre") + '"' + (b.s.length < 2 ? " hidden" : "") + ">" + so + '</select></div><div id="hBody"></div>';
    el("hBook").onchange = function () { H.book = this.value; save("hbook", H.book); H.sec = bookOf(H.book).s[0][0]; save("hsec", H.sec); hadithUI(); };
    el("hSec").onchange = function () { H.sec = +this.value; save("hsec", H.sec); openSection(); };
    openSection();
  }
  function openSection() {
    var b = bookOf(H.book), body = el("hBody"); load(body);
    var lg = fr() && b.fr ? "fra" : "eng";
    var url = function (l) { return HAPI + l + "-" + b.id + "/sections/" + H.sec + ".min.json"; };
    Promise.all([getJSON(url("ara")), getJSON(url(lg))]).then(function (r) {
      var tr = {}; r[1].hadiths.forEach(function (x) { tr[x.hadithnumber] = x; });
      H.list = r[0].hadiths.filter(function (x) { return x.text || (tr[x.hadithnumber] && tr[x.hadithnumber].text); }).map(function (x) { return { n: x.hadithnumber, ar: x.text, tx: tr[x.hadithnumber] ? tr[x.hadithnumber].text : "", g: (tr[x.hadithnumber] && tr[x.hadithnumber].grades) || x.grades || [] }; });
      H.shown = 0; body.innerHTML = '<div id="hList"></div>';
      if (fr() && !b.fr) body.insertAdjacentHTML("afterbegin", '<p class="lib-note">Traduction de ce recueil disponible en anglais.</p>');
      more();
    }).catch(function () { fail(body, openSection); });
  }
  function more() {
    var list = el("hList"), b = bookOf(H.book), next = H.list.slice(H.shown, H.shown + 15);
    var old = document.getElementById("hMore"); if (old) old.remove();
    list.insertAdjacentHTML("beforeend", next.map(function (x) {
      var g = x.g.length ? '<div class="lib-src">' + t("Grade", "Authenticité") + ": " + esc(x.g.map(function (y) { return y.grade + (y.name ? " (" + y.name + ")" : ""); }).join(" · ")) + "</div>" : "";
      return '<div class="lib-card"><div class="lib-meta"><span>' + esc(b.name) + " · " + x.n + '</span></div><div class="lib-ar" style="font-size:1.25rem;line-height:2">' + esc(x.ar) + '</div><div class="lib-tx">' + esc(x.tx) + "</div>" + g + "</div>";
    }).join(""));
    H.shown += next.length;
    if (H.shown < H.list.length) {
      list.insertAdjacentHTML("afterend", '<button type="button" class="lib-btn lib-more" id="hMore">' + t("Show more", "Voir plus") + " (" + (H.list.length - H.shown) + ")</button>");
      el("hMore").onclick = more;
    }
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

  var RENDER = { quran: quran, adhkar: adhkar, hadith: hadith, books: books };

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
