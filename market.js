/* AL MANARAH GLOBAL SERVICES — Marketplace (stores, products, merchant dashboard, admin)
   Public config only: the publishable key below is safe in the browser (Row Level Security protects the data). */
(function () {
  "use strict";
  var SB_URL = "https://rcioefzhysholnfogljy.supabase.co";
  var SB_KEY = "sb_publishable_ziTls2YuI4JKUqno8BQyQg_-We_mL49";
  var ADMIN_WA = "2250506122337";
  var MAX_IMAGES = 6;
  if (!window.supabase) return;
  // retry on weak mobile networks (a request that fails is tried again up to 3 times)
  function rfetch(u, o) { var n = 0; function go() { return fetch(u, o).catch(function (e) { if (++n > 3) throw e; return new Promise(function (r) { setTimeout(r, 500 * n); }).then(go); }); } return go(); }
  var sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }, global: { fetch: rfetch } });
  window.AMG_MARKET = sb;

  /* ---------------- i18n ---------------- */
  function L() { try { var q = (location.search.match(/[?&]lang=(en|fr|ar)/) || [])[1]; return (window.AMG_SITE && window.AMG_SITE.lang()) || q || localStorage.getItem("langUser") || localStorage.getItem("lang") || (localStorage.getItem("mk_country") === "NG" ? "en" : "fr"); } catch (e) { return "fr"; } }
  var D = {
    all: ["All", "Tout", "الكل"], search: ["Search products…", "Rechercher des produits…", "ابحث عن منتج…"], go: ["Search", "Rechercher", "بحث"],
    newest: ["Newest", "Plus récents", "الأحدث"], cheap: ["Price: low to high", "Prix croissant", "السعر: من الأقل"], dear: ["Price: high to low", "Prix décroissant", "السعر: من الأعلى"],
    more: ["Load more", "Voir plus", "عرض المزيد"], none: ["No products here yet.", "Aucun produit pour le moment.", "لا توجد منتجات هنا بعد."],
    none_hint: ["Sellers are joining — come back soon, or open your own store.", "Les vendeurs arrivent — revenez bientôt ou ouvrez votre boutique.", "التجار ينضمون الآن — عد قريبًا أو افتح متجرك."],
    open_store: ["Open your store", "Ouvrir ma boutique", "افتح متجرك"], products: ["products", "produits", "منتج"], stores: ["stores", "boutiques", "متجر"],
    by: ["by", "par", "من"], verified: ["Verified", "Vérifiée", "موثّق"], promo: ["Promo", "Promo", "عرض"], featured: ["Featured", "À la une", "مميز"],
    view_store: ["View store", "Voir la boutique", "زيارة المتجر"], wa: ["WhatsApp", "WhatsApp", "واتساب"], call: ["Call", "Appeler", "اتصال"],
    share: ["Share this store", "Partager la boutique", "شارك المتجر"], copy: ["Copy link", "Copier le lien", "نسخ الرابط"], copied: ["Link copied", "Lien copié", "تم نسخ الرابط"],
    not_found: ["This page was not found or is not available.", "Page introuvable ou indisponible.", "الصفحة غير موجودة أو غير متاحة."],
    preview: ["Preview — your store will be visible to everyone shortly.", "Aperçu — votre boutique sera visible par tous sous peu.", "معاينة — سيظهر متجرك للجميع قريبًا."],
    in_store: ["Search in this store…", "Rechercher dans la boutique…", "ابحث في هذا المتجر…"], seller: ["Seller", "Vendeur", "البائع"], category: ["Category", "Catégorie", "القسم"],
    wa_msg: ["Hello, I saw this on AL MANARAH GLOBAL SERVICES and I am interested:", "Bonjour, j’ai vu ceci sur AL MANARAH GLOBAL SERVICES et je suis intéressé(e) :", "السلام عليكم، رأيت هذا على موقع المنارة وأنا مهتم:"],
    wa_store: ["Hello, I found your store on AL MANARAH GLOBAL SERVICES.", "Bonjour, j’ai trouvé votre boutique sur AL MANARAH GLOBAL SERVICES.", "السلام عليكم، وجدت متجرك على موقع المنارة."],
    req_title: ["Send a request to the seller", "Envoyer une demande au vendeur", "أرسل طلبًا إلى البائع"],
    req_note: ["Your request goes directly to this seller, who will contact you.", "Votre demande va directement au vendeur, qui vous contactera.", "يصل طلبك مباشرة إلى هذا البائع وهو يتواصل معك."],
    name: ["Full name", "Nom complet", "الاسم الكامل"], phone: ["Phone (WhatsApp)", "Téléphone (WhatsApp)", "الهاتف (واتساب)"], city: ["City", "Ville", "المدينة"],
    qty: ["Quantity", "Quantité", "الكمية"], message: ["Message", "Message", "رسالة"], send: ["Send request", "Envoyer la demande", "إرسال الطلب"],
    sent: ["Request sent. Your reference:", "Demande envoyée. Votre référence :", "تم إرسال الطلب. رقمك المرجعي:"], fail: ["Something went wrong. Please try again.", "Une erreur est survenue. Réessayez.", "حدث خطأ، حاول مرة أخرى."],
    more_store: ["More from this store", "Autres produits de la boutique", "منتجات أخرى من المتجر"], stock: ["In stock", "En stock", "متوفر"], out: ["Out of stock", "Rupture de stock", "غير متوفر"],
    // auth
    login: ["Sign in", "Se connecter", "تسجيل الدخول"], signup: ["Create account", "Créer un compte", "إنشاء حساب"], forgot: ["Forgot password?", "Mot de passe oublié ?", "نسيت كلمة السر؟"],
    email: ["Email", "E-mail", "البريد الإلكتروني"], password: ["Password", "Mot de passe", "كلمة السر"], pw_hint: ["At least 8 characters", "Au moins 8 caractères", "8 أحرف على الأقل"],
    send_reset: ["Send reset link", "Envoyer le lien", "إرسال رابط التغيير"], reset_sent: ["Check your email for the link.", "Consultez votre e-mail pour le lien.", "افتح بريدك الإلكتروني للرابط."],
    new_pw: ["New password", "Nouveau mot de passe", "كلمة سر جديدة"], save_pw: ["Save password", "Enregistrer", "حفظ كلمة السر"], pw_saved: ["Password updated.", "Mot de passe mis à jour.", "تم تحديث كلمة السر."],
    confirm_email: ["Account created. Please confirm your email, then sign in.", "Compte créé. Confirmez votre e-mail puis connectez-vous.", "تم إنشاء الحساب. أكّد بريدك ثم سجّل الدخول."],
    logout: ["Sign out", "Déconnexion", "خروج"], bad_login: ["Email or password is incorrect.", "E-mail ou mot de passe incorrect.", "البريد أو كلمة السر غير صحيحة."],
    // store setup
    setup_t: ["Open your store", "Ouvrez votre boutique", "افتح متجرك"], setup_p: ["Fill in your details. Your store will be online shortly.", "Renseignez vos informations. Votre boutique sera en ligne sous peu.", "املأ بياناتك، وسيكون متجرك ظاهرًا قريبًا."],
    owner: ["Your full name", "Votre nom complet", "اسمك الكامل"], bname: ["Business / store name", "Nom de l’entreprise / boutique", "اسم التجارة / المتجر"],
    slug: ["Store link", "Lien de la boutique", "رابط المتجر"], slug_hint: ["Letters, numbers and dashes only", "Lettres, chiffres et tirets", "حروف إنجليزية وأرقام وشرطات فقط"],
    main_cat: ["Main category", "Catégorie principale", "القسم الرئيسي"], address: ["Address / area", "Adresse / quartier", "العنوان / الحي"],
    store_phone: ["Contact phone", "Téléphone de contact", "رقم التواصل"], store_wa: ["WhatsApp number (if different)", "Numéro WhatsApp (si différent)", "رقم الواتساب (إن كان مختلفًا)"],
    phone_hint: ["With country code, e.g. +225 07 00 00 00 00", "Avec indicatif, ex. +225 07 00 00 00 00", "مع رمز الدولة، مثل ‎+225 07 00 00 00 00"],
    desc: ["Description", "Description", "الوصف"], logo: ["Logo", "Logo", "الشعار"], cover: ["Cover image", "Image de couverture", "صورة الغلاف"],
    choose: ["Choose…", "Choisir…", "اختر…"], create_store: ["Submit my store", "Soumettre ma boutique", "إرسال المتجر"], save: ["Save", "Enregistrer", "حفظ"], saved: ["Saved.", "Enregistré.", "تم الحفظ."],
    slug_taken: ["This store link is already taken. Choose another.", "Ce lien est déjà pris. Choisissez-en un autre.", "هذا الرابط مستخدم، اختر غيره."],
    required: ["Please fill in all required fields.", "Veuillez remplir tous les champs obligatoires.", "يرجى ملء الحقول المطلوبة."],
    // dashboard
    t_over: ["Overview", "Aperçu", "نظرة عامة"], t_prod: ["Products", "Produits", "المنتجات"], t_req: ["Requests", "Demandes", "الطلبات"], t_promo: ["Promotions", "Promotions", "العروض"],
    t_store: ["✏️ Edit my store", "✏️ Modifier ma boutique", "✏️ تعديل متجري"], t_plan: ["Plan", "Abonnement", "الباقة"],
    st_pending: ["Coming soon", "Bientôt en ligne", "قريبًا"], st_approved: ["Approved", "Validé", "مقبول"], st_rejected: ["Rejected", "Refusé", "مرفوض"],
    st_suspended: ["Suspended", "Suspendu", "موقوف"], st_hidden: ["Hidden", "Masqué", "مخفي"], st_new: ["New", "Nouveau", "جديد"], st_contacted: ["Contacted", "Contacté", "تم التواصل"],
    st_completed: ["Completed", "Terminé", "تمّ"], st_cancelled: ["Cancelled", "Annulé", "ملغى"],
    store_pending: ["Your store is being prepared and will be online shortly. You can already add your products.", "Votre boutique est en préparation et sera en ligne sous peu. Vous pouvez déjà ajouter vos produits.", "متجرك قيد التجهيز وسيظهر قريبًا، ويمكنك إضافة منتجاتك الآن."],
    store_rejected: ["Your store was not approved.", "Votre boutique n’a pas été validée.", "لم تتم الموافقة على متجرك."],
    store_suspended: ["Your store is suspended. Contact AL MANARAH.", "Votre boutique est suspendue. Contactez AL MANARAH.", "متجرك موقوف. تواصل مع المنارة."],
    your_link: ["Your store link — share it everywhere:", "Le lien de votre boutique — partagez-le partout :", "رابط متجرك — انشره في كل مكان:"],
    used: ["products used", "produits utilisés", "منتجات مستخدمة"], new_reqs: ["new requests", "nouvelles demandes", "طلبات جديدة"],
    add_prod: ["Add a product", "Ajouter un produit", "أضف منتجًا"], edit: ["Edit", "Modifier", "تعديل"], del: ["Delete", "Supprimer", "حذف"], hide: ["Hide", "Masquer", "إخفاء"], show: ["Publish again", "Republier", "إعادة النشر"],
    title: ["Product name", "Nom du produit", "اسم المنتج"], price: ["Price (FCFA)", "Prix (FCFA)", "السعر (فرنك)"], old_price: ["Old price (optional)", "Ancien prix (facultatif)", "السعر القديم (اختياري)"],
    qty_stock: ["Quantity available (optional)", "Quantité disponible (facultatif)", "الكمية المتوفرة (اختياري)"], photos: ["Photos (up to 6)", "Photos (jusqu’à 6)", "الصور (حتى 6)"],
    add_photo: ["Add photo", "Ajouter une photo", "أضف صورة"], uploading: ["Uploading…", "Envoi…", "جارٍ الرفع…"],
    review_note: ["New or edited products appear in your store shortly, usually within a few hours.", "Les produits nouveaux ou modifiés apparaissent dans votre boutique sous peu, généralement en quelques heures.", "المنتجات الجديدة أو المعدَّلة تظهر في متجرك قريبًا، عادةً خلال ساعات."],
    limit: ["You have reached your plan limit. Upgrade to add more products.", "Limite de votre abonnement atteinte. Passez à une offre supérieure.", "وصلت إلى حد باقتك. قم بالترقية لإضافة المزيد."],
    sure: ["Are you sure?", "Êtes-vous sûr ?", "هل أنت متأكد؟"], reason: ["Reason", "Motif", "السبب"],
    no_req: ["No requests yet.", "Aucune demande pour le moment.", "لا توجد طلبات بعد."], reply_wa: ["Reply on WhatsApp", "Répondre sur WhatsApp", "رد على واتساب"],
    new_promo: ["New promotion", "Nouvelle promotion", "عرض جديد"], promo_title: ["Promotion title", "Titre de la promotion", "عنوان العرض"], discount: ["Discount %", "Remise %", "نسبة الخصم %"],
    product_opt: ["Product (empty = whole store)", "Produit (vide = toute la boutique)", "المنتج (فارغ = كل المتجر)"], starts: ["Starts", "Début", "يبدأ"], ends: ["Ends", "Fin", "ينتهي"],
    no_promo: ["No promotions yet.", "Aucune promotion.", "لا توجد عروض بعد."],
    cur_plan: ["Current plan", "Offre actuelle", "الباقة الحالية"], until: ["until", "jusqu’au", "حتى"], per_month: ["/ month", "/ mois", "/ شهر"], free: ["Free", "Gratuit", "مجانية"],
    upto: ["Up to", "Jusqu’à", "حتى"], choose_plan: ["Choose this plan", "Choisir cette offre", "اختر هذه الباقة"],
    pay_t: ["How to pay", "Comment payer", "طريقة الدفع"], months: ["Months", "Mois", "عدد الأشهر"], method: ["Payment method", "Moyen de paiement", "طريقة الدفع"],
    pay_ref: ["Transaction ID / reference", "ID / référence de la transaction", "رقم العملية"], receipt: ["Receipt (screenshot)", "Reçu (capture d’écran)", "الإيصال (صورة)"],
    submit_pay: ["Send for confirmation", "Envoyer pour confirmation", "إرسال للتأكيد"], pay_sent: ["Sent. Your plan is activated after confirmation.", "Envoyé. Votre offre est activée après confirmation.", "تم الإرسال، وتُفعَّل الباقة بعد التأكيد."],
    pay_to: ["Send the amount by mobile money to:", "Envoyez le montant par mobile money à :", "أرسل المبلغ عبر الموبايل موني إلى:"], total: ["Total", "Total", "المجموع"],
    my_reqs: ["My payment requests", "Mes demandes de paiement", "طلبات الدفع"], boost: ["Want more visibility? Ask us to feature your products.", "Plus de visibilité ? Demandez la mise en avant de vos produits.", "تريد ظهورًا أكبر؟ اطلب تمييز منتجاتك."],
    boost_btn: ["Request a feature", "Demander une mise en avant", "اطلب التمييز"], admin_mode: ["Admin mode — you are managing this store.", "Mode admin — vous gérez cette boutique.", "وضع المدير — أنت تدير هذا المتجر."],
    to_admin: ["Admin panel", "Panneau admin", "لوحة المدير"], note_from: ["Note from AL MANARAH:", "Note d’AL MANARAH :", "ملاحظة من المنارة:"],
    loading: ["Loading…", "Chargement…", "جارٍ التحميل…"],
    c_new: ["New", "Neuf", "جديد"], c_used: ["Used", "Occasion", "مستعمل"], c_refurbished: ["Refurbished", "Reconditionné", "مُجدَّد"], condition: ["Condition", "État", "الحالة"],
    any_cond: ["Any condition", "Tout état", "كل الحالات"], any_city: ["All cities", "Toutes les villes", "كل المدن"], on_quote: ["Price on request", "Prix sur devis", "السعر عند الطلب"], pmin: ["Min price", "Prix min", "أقل سعر"], pmax: ["Max price", "Prix max", "أعلى سعر"],
    negotiable: ["Negotiable", "Négociable", "قابل للتفاوض"], top: ["TOP", "TOP", "مميز"], saved: ["Saved", "Favoris", "المحفوظات"], no_saved: ["No saved products yet. Tap ♥ on a product to save it.", "Aucun favori. Touchez ♥ sur un produit pour l’enregistrer.", "لا توجد محفوظات. اضغط ♥ على المنتج لحفظه."],
    views: ["views", "vues", "مشاهدة"], posted: ["Posted", "Publié", "نُشر"], member: ["Member since", "Membre depuis", "عضو منذ"], similar: ["Similar products", "Produits similaires", "منتجات مشابهة"],
    safety_t: ["Safety tips", "Conseils de sécurité", "نصائح الأمان"],
    safety: [["Meet the seller in a safe public place.", "Check the item before you pay.", "Never send money in advance to someone you don’t know.", "Report anything suspicious."], ["Rencontrez le vendeur dans un lieu public sûr.", "Vérifiez l’article avant de payer.", "N’envoyez jamais d’argent à l’avance à un inconnu.", "Signalez tout ce qui est suspect."], ["قابل البائع في مكان عام وآمن.", "افحص المنتج قبل الدفع.", "لا ترسل مالًا مقدمًا لشخص لا تعرفه.", "أبلغ عن أي شيء مريب."]],
    report: ["Report", "Signaler", "إبلاغ"], report_t: ["Report this listing", "Signaler cette annonce", "الإبلاغ عن هذا الإعلان"], reason: ["Reason", "Motif", "السبب"],
    r_scam: ["Scam / fraud", "Arnaque / fraude", "احتيال"], r_fake: ["Fake or wrong item", "Article faux ou différent", "منتج مزيف أو مختلف"], r_sold: ["Already sold / unavailable", "Déjà vendu / indisponible", "تم بيعه / غير متوفر"], r_bad: ["Offensive or forbidden", "Offensant ou interdit", "محتوى مسيء أو ممنوع"], r_other: ["Other", "Autre", "أخرى"],
    details: ["Details", "Détails", "التفاصيل"], your_contact: ["Your phone or email (optional)", "Votre téléphone ou e-mail (facultatif)", "هاتفك أو بريدك (اختياري)"], thanks_report: ["Thank you. AL MANARAH will review this.", "Merci. AL MANARAH va vérifier.", "شكرًا لك، ستراجعه المنارة."],
    reviews: ["Reviews", "Avis", "التقييمات"], no_reviews: ["No reviews yet.", "Pas encore d’avis.", "لا توجد تقييمات بعد."], write_review: ["Rate this seller", "Noter ce vendeur", "قيّم هذا البائع"],
    your_name: ["Your name", "Votre nom", "اسمك"], comment: ["Comment", "Commentaire", "تعليق"], review_sent: ["Thank you! Your review will appear shortly.", "Merci ! Votre avis apparaîtra sous peu.", "شكرًا! سيظهر تقييمك قريبًا."],
    share_p: ["Share", "Partager", "مشاركة"], pay_online: ["Pay online", "Payer en ligne", "الدفع أونلاين"],
    pay_sec: ["Online payment (optional)", "Paiement en ligne (facultatif)", "الدفع أونلاين (اختياري)"], pay_hint: ["Customers see these numbers when they tap “Pay online” on your store.", "Les clients voient ces numéros en touchant « Payer en ligne » sur votre boutique.", "يرى الزبائن هذه الأرقام عند الضغط على «الدفع أونلاين» في متجرك."],
    country: ["Country", "Pays", "الدولة"], all_countries: ["All countries", "Tous les pays", "كل الدول"],
    pay_ng: ["Pay by bank transfer to one of these accounts:", "Payez par virement sur l’un de ces comptes :", "ادفع بالتحويل إلى أحد هذه الحسابات:"],
    agree: ["I have read and accept the", "J’ai lu et j’accepte le", "قرأت وأوافق على"], agreement: ["Seller agreement", "Contrat vendeur", "عقد البائع"], agree_err: ["Please accept the seller agreement.", "Veuillez accepter le contrat vendeur.", "يرجى الموافقة على عقد البائع."],
    one_rule: ["One product per listing — no photos of a whole shop or many items.", "Un produit par annonce — pas de photo d’une boutique entière ou de plusieurs articles.", "منتج واحد لكل إعلان — لا تصوّر الدكان كله أو سلعًا كثيرة في إعلان واحد."],
    yearly: ["12 months — pay only 6", "12 mois — payez seulement 6", "12 شهرًا — ادفع 6 فقط"], per_year: ["/ year", "/ an", "/ سنة"],
    qr: ["QR code", "Code QR", "رمز QR"], qr_dl: ["Download QR code", "Télécharger le code QR", "تحميل رمز QR"], qr_hint: ["Print it or send it: customers scan it to open your store.", "Imprimez-le ou envoyez-le : les clients le scannent pour ouvrir votre boutique.", "اطبعه أو أرسله: يمسحه الزبائن فيفتح متجرك مباشرة."], scan_me: ["Scan to see all our products", "Scannez pour voir tous nos produits", "امسح الرمز لترى كل منتجاتنا"],
    pay_name: ["Account name", "Nom du compte", "اسم صاحب الحساب"], pay_after: ["After paying, send your receipt to the seller on WhatsApp.", "Après le paiement, envoyez votre reçu au vendeur sur WhatsApp.", "بعد الدفع، أرسل الإيصال إلى البائع عبر الواتساب."], send_receipt: ["Send receipt on WhatsApp", "Envoyer le reçu sur WhatsApp", "أرسل الإيصال عبر الواتساب"], deals: ["Deals", "Bonnes affaires", "عروض"]
  };
  function t(k) { var r = D[k]; if (!r) return k; var l = L(); return l === "fr" ? r[1] : l === "ar" ? (r[2] || r[0]) : r[0]; }

  /* ---------------- helpers ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n, cur) { if (n == null || n === "") return ""; if (Number(n) === 0) return t("on_quote"); if (cur === "NGN") return "₦" + Number(n).toLocaleString("en-US"); return Number(n).toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " FCFA"; }
  var COUNTRIES = { CI: { flag: "🇨🇮", en: "Côte d’Ivoire", fr: "Côte d’Ivoire", ar: "ساحل العاج", cur: "XOF", code: "225" }, NG: { flag: "🇳🇬", en: "Nigeria", fr: "Nigeria", ar: "نيجيريا", cur: "NGN", code: "234" } };
  var CITIES = {
    CI: ["Abidjan", "Bouaké", "Yamoussoukro", "San-Pédro", "Daloa", "Korhogo", "Man", "Divo", "Gagnoa", "Abengourou", "Soubré", "Anyama", "Grand-Bassam", "Bingerville", "Séguéla", "Odienné", "Bondoukou", "Agboville", "Dimbokro", "Sassandra", "Ferkessédougou", "Issia", "Bouaflé", "Toumodi", "Dabou"],
    NG: ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin City", "Kaduna", "Ilorin", "Abeokuta", "Onitsha", "Enugu", "Jos", "Owerri", "Uyo", "Warri", "Calabar", "Aba", "Akure", "Osogbo", "Ogbomoso", "Zaria", "Sokoto", "Maiduguri", "Ado-Ekiti", "Asaba", "Minna", "Bauchi", "Yola", "Makurdi", "Lokoja"]
  };
  function citiesOf(country, extra) { var base = country ? (CITIES[country] || []) : [].concat(CITIES.CI, CITIES.NG); var all = base.concat((extra || []).filter(function (c) { return base.map(function (x) { return x.toLowerCase(); }).indexOf(c.toLowerCase()) < 0; })); return all; }
  function T3x(en, fr, ar) { return L() === "fr" ? fr : L() === "ar" ? ar : en; }
  function mkOr(cc) { return "country.eq." + cc + ",markets.cs.{" + cc + "}"; }
  function curOf(country) { return (COUNTRIES[country] || COUNTRIES.CI).cur; }
  function cName(c) { var x = COUNTRIES[c]; if (!x) return ""; var l = L(); return x.flag + " " + (l === "fr" ? x.fr : l === "ar" ? x.ar : x.en); }
  function myCountry() { try { return localStorage.getItem("mk_country") || ""; } catch (e) { return ""; } }
  function setCountry(c) { try { localStorage.setItem("mk_country", c || ""); } catch (e) {} }
  function qs(k) { return new URLSearchParams(location.search).get(k); }
  function digits(s) { return String(s || "").replace(/\D/g, ""); }
  function intl(s) { var d = digits(s); if (!d) return ""; if (d.length === 10 && d[0] === "0") d = "225" + d; else if (d.length === 11 && d[0] === "0") d = "234" + d.slice(1); if (d.indexOf("00") === 0) d = d.slice(2); return d; }
  function wa(num, text) { var d = intl(num); return d ? "https://wa.me/" + d + (text ? "?text=" + encodeURIComponent(text) : "") : ""; }
  function tel(num) { var d = intl(num); return d ? "tel:+" + d : ""; }
  function storeUrl(slug) { return location.origin + "/" + slug; }
  function productUrl(id) { return location.origin + "/product.html?id=" + id; }
  function initials(s) { return esc(String(s || "?").trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase()); }
  function slugify(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40); }
  function catName(c) { if (!c) return ""; var l = L(); return l === "fr" ? c.name_fr : l === "ar" ? c.name_ar : c.name_en; }
  function stLabel(s) { return '<span class="mk-status s-' + esc(s) + '">' + esc(t("st_" + s)) + "</span>"; }
  function msg(box, kind, text) { if (!box) return; box.innerHTML = text ? '<div class="mk-msg ' + kind + '">' + text + "</div>" : ""; }
  function dateFmt(d) { if (!d) return ""; try { return new Date(d).toLocaleDateString(L() === "fr" ? "fr-FR" : L() === "ar" ? "ar" : "en-GB", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return d; } }
  function pubUrl(path) { return sb.storage.from("market").getPublicUrl(path).data.publicUrl; }
  function rnd() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function lsGet(k) { try { var v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function isFav(id) { return lsGet("mk_fav").indexOf(id) > -1; }
  function pushRecent(id) { var r = lsGet("mk_recent").filter(function (x) { return x !== id; }); r.unshift(id); lsSet("mk_recent", r.slice(0, 12)); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-fav]"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var id = b.dataset.fav, f = lsGet("mk_fav"), i = f.indexOf(id);
    if (i > -1) f.splice(i, 1); else f.unshift(id);
    lsSet("mk_fav", f.slice(0, 200)); b.textContent = i > -1 ? "♡" : "♥";
  }, true);
  function stars(n) { n = Math.round(n || 0); return '<span class="mk-stars">' + "★★★★★".slice(0, n) + '<span style="color:#ccc">' + "★★★★★".slice(0, 5 - n) + "</span></span>"; }
  var rerender = function () {};
  document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("[data-setlang]")) setTimeout(function () { rerender(); }, 60); });

  async function compress(file, max) {
    max = max || 1280;
    try {
      var bmp = await createImageBitmap(file);
      var sc = Math.min(1, max / Math.max(bmp.width, bmp.height));
      var c = document.createElement("canvas"); c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc);
      c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
      var blob = await new Promise(function (res) { c.toBlob(res, "image/webp", 0.82); });
      if (!blob || blob.type !== "image/webp") blob = await new Promise(function (res) { c.toBlob(res, "image/jpeg", 0.85); });
      return blob;
    } catch (e) { return file; }
  }
  async function upload(file, folder) {
    var u = await user(); if (!u) throw new Error("auth");
    var blob = await compress(file, folder === "r" ? 1600 : 1280);
    var ext = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
    var path = u.id + "/" + folder + "/" + rnd() + "." + ext;
    var r = await sb.storage.from("market").upload(path, blob, { contentType: blob.type || "image/jpeg", upsert: false });
    if (r.error) throw r.error;
    return pubUrl(path);
  }
  async function removeImg(url) {
    var u = await user(); if (!u || !url) return;
    var m = url.split("/object/public/market/")[1]; if (m && m.indexOf(u.id + "/") === 0) { try { await sb.storage.from("market").remove([m]); } catch (e) {} }
  }

  var _user;
  async function user() { if (_user !== undefined) return _user; var r = await sb.auth.getSession(); _user = r.data.session ? r.data.session.user : null; return _user; }
  var _prof;
  async function profile() { if (_prof !== undefined) return _prof; var u = await user(); if (!u) return (_prof = null); var r = await sb.from("profiles").select("*").eq("id", u.id).maybeSingle(); _prof = r.data || null; return _prof; }
  var CATS = null, PLANS = null;
  async function cats() { if (CATS) return CATS; var r = await sb.from("categories").select("*").order("sort_order"); CATS = r.data || []; return CATS; }
  async function plans() { if (PLANS) return PLANS; var r = await sb.from("plans").select("*").order("sort_order"); PLANS = r.data || []; return PLANS; }
  function catById(id) { return (CATS || []).filter(function (c) { return c.id === id; })[0]; }

  /* promotions: returns map productId -> discount%, and storeId -> discount% */
  async function promoMap(products) {
    var map = { p: {}, s: {} }; if (!products || !products.length) return map;
    var now = new Date().toISOString();
    var sids = Array.from(new Set(products.map(function (p) { return p.store_id; })));
    var r = await sb.from("promotions").select("store_id,product_id,discount_percent,ends_at,starts_at").eq("status", "approved").in("store_id", sids).lte("starts_at", now);
    (r.data || []).forEach(function (pr) {
      if (pr.ends_at && pr.ends_at < now) return; if (!pr.discount_percent) return;
      if (pr.product_id) map.p[pr.product_id] = Math.max(map.p[pr.product_id] || 0, pr.discount_percent);
      else map.s[pr.store_id] = Math.max(map.s[pr.store_id] || 0, pr.discount_percent);
    });
    return map;
  }
  function priceOf(p, pm) { var r = priceOf0(p, pm); r.cur = p.currency === "NGN" ? "NGN" : curOf((p.stores || {}).country || p.__country); return r; }
  function priceOf0(p, pm) {
    var d = (pm && (pm.p[p.id] || pm.s[p.store_id])) || 0;
    if (d) return { now: Math.round(p.price * (100 - d) / 100), was: p.price, off: d };
    return { now: p.price, was: p.compare_at_price && p.compare_at_price > p.price ? p.compare_at_price : null, off: p.compare_at_price > p.price ? Math.round(100 - p.price * 100 / p.compare_at_price) : 0 };
  }
  function priceHtml(pr) { return '<span class="mk-price">' + money(pr.now, pr.cur) + (pr.was ? "<s>" + money(pr.was, pr.cur) + "</s>" : "") + "</span>"; }

  var PSEL = "id,title,price,currency,section,compare_at_price,images,store_id,category_id,featured_until,created_at,condition,negotiable,stores(name,slug,verified,city,country,markets)";
  function card(p, pm) {
    var pr = priceOf(p, pm), s = p.stores || {}, img = (p.images || [])[0];
    var feat = p.featured_until && p.featured_until > new Date().toISOString();
    return '<a class="mk-card" href="/product.html?id=' + p.id + '"><div class="img">' +
      (img ? '<img src="' + esc(img) + '" alt="' + esc(p.title) + '" loading="lazy">' : '<span class="noimg">' + esc((catById(p.category_id) || {}).icon || "🛍️") + "</span>") +
      (feat ? '<span class="mk-badge top">' + t("top") + "</span>" : pr.off ? '<span class="mk-badge">-' + pr.off + "%</span>" : "") +
      '<button type="button" class="mk-fav" data-fav="' + p.id + '" aria-label="' + t("saved") + '">' + (isFav(p.id) ? "♥" : "♡") + "</button>" +
      (p.condition && p.condition !== "new" ? '<span class="mk-cond">' + t("c_" + p.condition) + "</span>" : "") +
      '</div><div class="body"><h3>' + esc(p.title) + "</h3>" + priceHtml(pr) +
      '<span class="seller">' + esc(s.name || "") + (s.verified ? ' <span class="mk-verified">✔</span>' : "") + (s.city ? " · " + esc(s.city) : "") + "</span></div></a>";
  }
  function emptyBox(e, a, b, cta) { return '<div class="mk-empty"><span class="e">' + (e || "🛍️") + "</span><b>" + esc(a) + "</b><p>" + esc(b || "") + "</p>" + (cta ? '<a class="btn btn-primary btn-sm" href="/sell.html">' + t("open_store") + "</a>" : "") + "</div>"; }
  function storeCard(s, n) {
    return '<a class="mk-store" href="/' + esc(s.slug) + '"><div class="cover"' + (s.cover_url ? ' style="background-image:url(\'' + esc(s.cover_url) + '\')"' : "") + '></div><div class="info">' +
      (s.logo_url ? '<img class="logo" src="' + esc(s.logo_url) + '" alt="">' : '<span class="logo">' + initials(s.name) + "</span>") +
      "<h3>" + esc(s.name) + (s.verified ? ' <span class="mk-verified">✔ ' + t("verified") + "</span>" : "") + '</h3><span class="meta">' + esc(catName(catById(s.category_id))) + (s.city ? " · " + esc(s.city) : "") + (n != null ? " · " + n + " " + t("products") : "") + "</span></div></a>";
  }

  /* home: one card per store (store name + what's new / its offers), details inside the store */
  function groupByStore(list) {
    var g = {}, order = [];
    (list || []).forEach(function (p) { if (!p || !p.store_id) return; if (!g[p.store_id]) { g[p.store_id] = { p: p, items: [] }; order.push(p.store_id); } g[p.store_id].items.push(p); });
    return order.map(function (id) { return g[id]; });
  }
  function storeOffer(gr, smap, badge, sub) {
    var p = gr.p, s = Object.assign({}, p.stores || {}, smap[p.store_id] || {}), img = (p.images || [])[0];
    return '<a class="mk-store mk-offer" href="/' + esc(s.slug || "") + '"><div class="cover"' + (img ? ' style="background-image:url(\'' + esc(img) + '\')"' : "") + ">" + (badge ? '<span class="ob">' + badge + "</span>" : "") + '</div><div class="info">' +
      (s.logo_url ? '<img class="logo" src="' + esc(s.logo_url) + '" alt="">' : '<span class="logo">' + initials(s.name || "") + "</span>") +
      "<h3>" + esc(s.name || "") + (s.verified ? ' <span class="mk-verified">✔</span>' : "") + '</h3><span class="meta">' + (s.city ? esc(s.city) + " · " : "") + sub + '</span><span class="go">' + (L() === "fr" ? "Voir la boutique →" : L() === "ar" ? "ادخل المتجر ←" : "Visit store →") + "</span></div></a>";
  }

  /* live search: suggestions while typing (stores, products, categories) */
  function liveSearch(input) {
    if (!input || input.dataset.live) return; input.dataset.live = 1;
    var box = document.createElement("div"); box.className = "mk-sug mk-hide"; input.parentNode.style.position = "relative"; input.parentNode.appendChild(box);
    var timer, last = "";
    function norm(x) { return String(x || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    input.setAttribute("autocomplete", "off");
    input.addEventListener("input", function () {
      clearTimeout(timer); var q = input.value.trim(); if (q.length < 2) { box.classList.add("mk-hide"); return; }
      timer = setTimeout(async function () {
        if (q === last) return; last = q; var sq = q.replace(/[%,()]/g, " ");
        var [st, pr] = await Promise.all([
          sb.from("stores").select("name,slug,city,logo_url,verified").eq("status", "approved").or("name.ilike.%" + sq + "%,city.ilike.%" + sq + "%").limit(5),
          sb.from("products").select("id,title,price,currency,images,stores(name,country)").eq("status", "approved").ilike("title", "%" + sq + "%").limit(6)
        ]);
        await cats(); var nq = norm(q);
        var cs = CATS.filter(function (c) { return c.active && [c.name_en, c.name_fr, c.name_ar, c.slug].some(function (n) { return norm(n).indexOf(nq) > -1; }); }).slice(0, 3);
        var html = cs.map(function (c) { return '<a href="/shop.html?cat=' + c.slug + '"><span class="i">' + esc(c.icon) + "</span><span>" + esc(catName(c)) + "</span></a>"; }).join("") +
          (st.data || []).map(function (x) { return '<a href="/' + esc(x.slug) + '"><span class="i">' + (x.logo_url ? '<img src="' + esc(x.logo_url) + '" alt="">' : "🏪") + "</span><span><b>" + esc(x.name) + "</b>" + (x.verified ? " ✔" : "") + "<small>" + esc(x.city || "") + "</small></span></a>"; }).join("") +
          (pr.data || []).map(function (x) { return '<a href="/product.html?id=' + x.id + '"><span class="i">' + ((x.images || [])[0] ? '<img src="' + esc(x.images[0]) + '" alt="">' : "🛍️") + "</span><span>" + esc(x.title) + "<small>" + money(x.price, x.currency === "NGN" ? "NGN" : curOf((x.stores || {}).country)) + " · " + esc((x.stores || {}).name || "") + "</small></span></a>"; }).join("");
        box.innerHTML = html || '<div class="mk-sug-none">' + t("none") + "</div>";
        box.classList.remove("mk-hide");
      }, 250);
    });
    document.addEventListener("click", function (e) { if (!box.contains(e.target) && e.target !== input) box.classList.add("mk-hide"); });
    input.addEventListener("focus", function () { if (box.innerHTML && input.value.trim().length > 1) box.classList.remove("mk-hide"); });
  }

  /* =============== HOME =============== */
  /* first visit: guide the visitor (buy / sell / video) */
  function welcome(force) {
    var seen; try { seen = localStorage.getItem("mk_welcome"); } catch (e) {}
    if (seen && !force) return;
    var L2 = L(), T = function (en, fr, ar) { return L2 === "fr" ? fr : L2 === "ar" ? ar : en; };
    function done() { try { localStorage.setItem("mk_welcome", "1"); } catch (e) {} }
    var m = document.createElement("div"); m.className = "mk-modal mk-wel";
    m.innerHTML = '<div class="box"><button class="x" type="button" aria-label="close">✕</button>' +
      '<img src="/logo-wide.png" alt="AL MANARAH GLOBAL SERVICES" class="wl-logo">' +
      '<h2>' + T("Welcome 👋", "Bienvenue 👋", "مرحبًا بك 👋") + '</h2><p class="wl-sub">' + T("The marketplace of Côte d’Ivoire and Nigeria. What would you like to do?", "La marketplace de Côte d’Ivoire et du Nigeria. Que voulez-vous faire ?", "سوق ساحل العاج ونيجيريا. ماذا تريد أن تفعل؟") + "</p>" +
      '<div class="wl-ch"><a href="/shop.html" data-go class="wl-b"><span>🛍️</span><b>' + T("I want to buy", "Je veux acheter", "أريد الشراء") + "</b><small>" + T("Find stores near you", "Trouvez des boutiques près de chez vous", "اعثر على متاجر قريبة منك") + '</small></a>' +
      '<a href="/sell.html" data-go class="wl-b gold"><span>🏪</span><b>' + T("I want to sell", "Je veux vendre", "أريد البيع") + "</b><small>" + T("Open your store — free", "Ouvrez votre boutique — gratuit", "افتح متجرك مجانًا") + "</small></a></div>" +
      '<button type="button" class="wl-skip" data-tuto style="text-decoration:none;color:#B78A32;font-weight:700">▶ ' + T("How to open my store (video)", "Comment ouvrir ma boutique (vidéo)", "كيف أفتح متجري (فيديو)") + "</button>" +
      '<button type="button" class="wl-vid" data-vid><img src="' + (L() === "fr" ? "/lancement.jpg" : "/lancement-en.jpg") + '" alt=""><span class="pl">▶</span><span class="lb">' + T("Discover in 50 seconds", "Découvrir en 50 secondes", "اكتشف في 50 ثانية") + "</span></button>" +
      '<button type="button" class="wl-skip">' + T("Just browse", "Visiter le site", "تصفح الموقع") + " →</button></div>";
    document.body.appendChild(m);
    function close() { done(); m.remove(); }
    $(".x", m).onclick = close; $$(".wl-skip", m).forEach(function (b) { b.addEventListener("click", close); });
    m.addEventListener("click", function (e) { if (e.target === m) close(); });
    $$("[data-go]", m).forEach(function (a) { a.addEventListener("click", done); });
    $("[data-vid]", m).onclick = function () { var b = this; var vf = L() === "fr" ? "/lancement.mp4?v=2" : "/lancement-en.mp4", vp = L() === "fr" ? "/lancement.jpg" : "/lancement-en.jpg"; b.outerHTML = '<video class="wl-video" src="' + vf + '" poster="' + vp + '" controls autoplay playsinline></video>'; done(); };
  }
  window.AMG_WELCOME = welcome;
  function tutoModal() {
    var lg = L() === "fr" ? "fr" : "en";
    var m = document.createElement("div"); m.className = "mk-modal mk-wel";
    m.innerHTML = '<div class="box" style="width:min(900px,100%)"><button class="x" type="button" aria-label="close">✕</button><h3 style="margin:0 0 10px;color:#101B45">' + (lg === "fr" ? "Comment ouvrir votre boutique et ajouter vos produits" : "How to open your store and add your products") + '</h3><video class="wl-video" style="max-height:none;aspect-ratio:16/9" src="/tuto-' + lg + '.mp4" poster="/tuto-' + lg + '.jpg" controls autoplay playsinline></video><p style="margin:12px 0 0"><a class="btn btn-primary btn-sm" href="/sell.html">' + (lg === "fr" ? "Ouvrir ma boutique" : "Open my store") + "</a></p></div>";
    document.body.appendChild(m);
    function close() { var v = $("video", m); if (v) v.pause(); m.remove(); }
    $(".x", m).onclick = close; m.addEventListener("click", function (e) { if (e.target === m) close(); });
  }
  window.AMG_TUTO = tutoModal;
  document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("#tutoBtn,[data-tuto]")) { e.preventDefault(); tutoModal(); } });

  async function pageHome() {
    setTimeout(function () { welcome(false); }, 900);
    var wv = $("#mkVideo"); if (wv) wv.addEventListener("click", function () { welcome(true); });
    await cats();
    var CC = myCountry();
    var hc = $("#mkCountry"); if (hc) { hc.innerHTML = ["", "CI", "NG"].map(function (c) { return '<button type="button" class="mk-chip' + (CC === c ? " on" : "") + '" data-cc="' + c + '">' + (c ? cName(c) : "🌍 " + t("all_countries")) + "</button>"; }).join(""); hc.addEventListener("click", function (e) { var b = e.target.closest("[data-cc]"); if (!b) return; setCountry(b.dataset.cc); location.reload(); }); }
    function PQ() { var q = sb.from("products").select(CC ? PSEL.replace("stores(", "stores!inner(") : PSEL).eq("status", "approved"); return CC ? q.or(mkOr(CC), { referencedTable: "stores" }) : q; }
    var [cnt, stc, recent, feat, stores] = await Promise.all([
      sb.from("products").select("category_id,store_id").eq("status", "approved").limit(5000),
      sb.from("stores").select("category_id").eq("status", "approved").limit(5000),
      PQ().order("created_at", { ascending: false }).limit(80),
      PQ().gt("featured_until", new Date().toISOString()).limit(8),
      (CC ? sb.from("stores").select("id,name,slug,logo_url,cover_url,city,country,category_id,verified").or(mkOr(CC)) : sb.from("stores").select("id,name,slug,logo_url,cover_url,city,country,category_id,verified")).eq("status", "approved").order("verified", { ascending: false }).order("created_at", { ascending: false }).limit(8)
    ]);
    var byCat = {}, byStore = {}, stCat = {};
    (stc.data || []).forEach(function (r) { stCat[r.category_id] = (stCat[r.category_id] || 0) + 1; });
    (cnt.data || []).forEach(function (r) { byCat[r.category_id] = (byCat[r.category_id] || 0) + 1; byStore[r.store_id] = (byStore[r.store_id] || 0) + 1; });
    var now = new Date().toISOString();
    var [ban, prm, disc] = await Promise.all([
      sb.from("banners").select("*").eq("active", true).order("sort_order"),
      sb.from("promotions").select("product_id,store_id").eq("status", "approved").lte("starts_at", now).or("ends_at.is.null,ends_at.gt." + now).limit(100),
      PQ().not("compare_at_price", "is", null).order("created_at", { ascending: false }).limit(24)
    ]);
    var pids = (prm.data || []).map(function (x) { return x.product_id; }).filter(Boolean), sids = (prm.data || []).filter(function (x) { return !x.product_id; }).map(function (x) { return x.store_id; });
    var dealQ = [];
    if (pids.length) dealQ.push(sb.from("products").select(PSEL).eq("status", "approved").in("id", pids.slice(0, 50)));
    if (sids.length) dealQ.push(sb.from("products").select(PSEL).eq("status", "approved").in("store_id", sids.slice(0, 20)).limit(24));
    var dealRes = await Promise.all(dealQ), dealPool = (disc.data || []);
    dealRes.forEach(function (r) { dealPool = dealPool.concat(r.data || []); });
    if (CC) dealPool = dealPool.filter(function (p) { return (p.stores || {}).country === CC; });
    var rec = lsGet("mk_recent"), recRes = rec.length ? await sb.from("products").select(PSEL).eq("status", "approved").in("id", rec) : { data: [] };
    var recentList = rec.map(function (id) { return (recRes.data || []).filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    var all = (recent.data || []).concat(feat.data || [], dealPool, recentList), pm = await promoMap(all);
    var seen = {}, deals = dealPool.filter(function (p) { if (seen[p.id]) return false; seen[p.id] = 1; return priceOf(p, pm).off > 0; }).sort(function (a, b) { return priceOf(b, pm).off - priceOf(a, pm).off; }).slice(0, 8);
    var bans = (ban.data || []).filter(function (b) { return !b.ends_at || b.ends_at > now; });
    if (bans.length) {
      $("#mkBanWrap").classList.remove("mk-hide");
      var bx = $("#mkBanners"), cur = 0;
      bx.innerHTML = bans.map(function (b, i) { var inner = '<img src="' + esc(b.image_url) + '" alt="' + esc(b.title || "") + '">' + (b.title ? '<span class="cap">' + esc(b.title) + "</span>" : ""); return b.link ? '<a class="' + (i ? "" : "on") + '" href="' + esc(b.link) + '">' + inner + "</a>" : '<div class="sl ' + (i ? "" : "on") + '">' + inner + "</div>"; }).join("") + (bans.length > 1 ? '<div class="dots">' + bans.map(function (b, i) { return '<button type="button" data-d="' + i + '"' + (i ? "" : ' class="on"') + ' aria-label="' + (i + 1) + '"></button>'; }).join("") + "</div>" : "");
      var slides = $$("a,div.sl", bx), dots = $$(".dots button", bx);
      function go(i) { cur = (i + slides.length) % slides.length; slides.forEach(function (x, j) { x.classList.toggle("on", j === cur); }); dots.forEach(function (x, j) { x.classList.toggle("on", j === cur); }); }
      dots.forEach(function (d) { d.addEventListener("click", function () { go(+d.dataset.d); }); });
      if (slides.length > 1) setInterval(function () { go(cur + 1); }, 5000);
    }
    rerender = function () {
      $("#mkDealsWrap").classList.toggle("mk-hide", !deals.length);
      var smap = {}; (stores.data || []).forEach(function (x) { smap[x.id] = x; });
      var LF = L() === "fr", LA = L() === "ar";
      $("#mkDeals").innerHTML = groupByStore(deals).map(function (g) { var mx = Math.max.apply(null, g.items.map(function (p) { return priceOf(p, pm).off; })); return storeOffer(g, smap, "-" + mx + "%", g.items.length + " " + (LF ? "offre(s)" : LA ? "عرض" : "deal(s)")); }).join("");
      $("#mkRecentWrap").classList.toggle("mk-hide", !recentList.length);
      $("#mkRecent").innerHTML = recentList.slice(0, 8).map(function (p) { return card(p, pm); }).join("");
      var st = $("#mkStats"); if (st) st.innerHTML = "<div><b>" + (cnt.data || []).length + "</b>" + t("products") + "</div><div><b>" + Object.keys(byStore).length + "</b>" + t("stores") + "</div><div><b>" + (CATS.length) + "</b>" + (L() === "fr" ? "catégories" : L() === "ar" ? "أقسام" : "categories") + "</div>";
      $("#mkCats").innerHTML = CATS.filter(function (c) { return c.active; }).map(function (c) {
        var trv = c.slug === "travel";
        return '<a class="mk-cat' + (trv ? " travel" : "") + '" href="' + "/shop.html?cat=" + c.slug + '"><span class="ico">' + esc(c.icon || "🛍️") + "</span>" + esc(catName(c)) +
          '<span class="cnt">' + (false ? (L() === "fr" ? "Omra · Hajj · Hôtels · Visas" : L() === "ar" ? "عمرة · حج · فنادق · تأشيرات" : "Umrah · Hajj · Hotels · Visas") : (stCat[c.id] || 0) + " " + (L() === "fr" ? "boutique(s)" : L() === "ar" ? "متجر" : "store(s)") + " · " + (byCat[c.id] || 0) + " " + t("products")) + "</span></a>";
      }).join("");
      var f = feat.data || [];
      $("#mkFeatWrap").classList.toggle("mk-hide", !f.length);
      $("#mkFeat").innerHTML = groupByStore(f).map(function (g) { return storeOffer(g, smap, "⭐", g.items.length + " " + (LF ? "produit(s) à la une" : LA ? "منتج مميز" : "featured")); }).join("");
      var r = recent.data || [];
      $("#mkNew").innerHTML = r.length ? groupByStore(r).slice(0, 8).map(function (g) { return storeOffer(g, smap, (LF ? "Nouveau" : LA ? "جديد" : "New"), g.items.length + " " + (LF ? "nouveauté(s)" : LA ? "جديد" : "new")); }).join("") : emptyBox("🛍️", t("none"), t("none_hint"), true);
      var s = stores.data || [];
      $("#mkStoresWrap").classList.toggle("mk-hide", !s.length);
      $("#mkStores").innerHTML = s.map(function (x) { return storeCard(x, byStore[x.id] || 0); }).join("");
    };
    rerender();
    liveSearch($("#mkSearchForm input[name=q]"));
    var shb = $("#mkShareSite"); if (shb) shb.addEventListener("click", function () { shareModal({ name: "AL MANARAH GLOBAL SERVICES", url: location.origin + "/", file: "almanarah" }); });
    var f = $("#mkSearchForm"); if (f) f.addEventListener("submit", function (e) { e.preventDefault(); var q = f.q.value.trim(); location.href = "/shop.html" + (q ? "?q=" + encodeURIComponent(q) : ""); });
  }

  /* =============== SHOP =============== */
  async function pageShop() {
    await cats();
    var state = { cat: qs("cat") || "", q: qs("q") || "", sort: "new", page: 0, items: [], done: false, pm: { p: {}, s: {} }, country: myCountry(), city: "", cond: "", min: "", max: "", fav: qs("fav") === "1" };
    var input = $("#shopQ"), sort = $("#shopSort"); input.value = state.q; liveSearch(input);
    var cityRes = await sb.from("stores").select("city,country").eq("status", "approved").limit(2000);
    function storeCities(cc) { return Array.from(new Set((cityRes.data || []).filter(function (x) { return !cc || x.country === cc; }).map(function (x) { return (x.city || "").trim(); }).filter(Boolean))); }
    function filtersUI() {
      var fc = $("#fCountry"); if (!fc) { fc = document.createElement("select"); fc.id = "fCountry"; $("#shopFilters").prepend(fc); fc.addEventListener("change", function () { state.country = fc.value; state.city = ""; setCountry(fc.value); filtersUI(); load(true); }); }
      fc.innerHTML = '<option value="">🌍 ' + t("all_countries") + "</option>" + ["CI", "NG"].map(function (c) { return '<option value="' + c + '"' + (state.country === c ? " selected" : "") + ">" + cName(c) + "</option>"; }).join("");
      function opts(list) { return list.map(function (c) { return '<option' + (state.city === c ? " selected" : "") + ">" + esc(c) + "</option>"; }).join(""); }
      $("#fCity").innerHTML = '<option value="">' + t("any_city") + "</option>" + (state.country ? opts(citiesOf(state.country, storeCities(state.country))) : ["CI", "NG"].map(function (cc) { return '<optgroup label="' + esc(cName(cc)) + '">' + opts(citiesOf(cc, storeCities(cc))) + "</optgroup>"; }).join(""));
      $("#fCond").innerHTML = '<option value="">' + t("any_cond") + "</option>" + ["new", "used", "refurbished"].map(function (c) { return '<option value="' + c + '"' + (state.cond === c ? " selected" : "") + ">" + t("c_" + c) + "</option>"; }).join("");
      $("#fMin").placeholder = t("pmin"); $("#fMax").placeholder = t("pmax");
      $("#shopFilters").classList.toggle("mk-hide", state.fav);
    }
    $("#fApply").addEventListener("click", function () { state.city = $("#fCity").value; state.cond = $("#fCond").value; state.min = $("#fMin").value; state.max = $("#fMax").value; load(true); });
    ["#fCity", "#fCond"].forEach(function (id) { $(id).addEventListener("change", function () { $("#fApply").click(); }); });
    function chips() {
      filtersUI();
      $("#shopChips").innerHTML = '<a class="mk-chip' + (state.fav ? " on" : "") + '" data-fav-chip="1">♥ ' + t("saved") + '</a><a class="mk-chip' + (state.cat || state.fav ? "" : " on") + '" data-cat="">' + t("all") + "</a>" + CATS.filter(function (c) { return c.active; }).map(function (c) {
        return '<a class="mk-chip' + (state.cat === c.slug ? " on" : "") + '" data-cat="' + c.slug + '">' + esc(c.icon) + " " + esc(catName(c)) + "</a>";
      }).join("");
      var c = CATS.filter(function (x) { return x.slug === state.cat; })[0];
      var tb = $("#shopTravel"); if (!tb) { tb = document.createElement("div"); tb.id = "shopTravel"; $("#shopChips").after(tb); }
      tb.innerHTML = false ? '<a class="mk-trv" style="max-width:none;margin:0 0 18px" href="/services.html"><span class="ico">✈️</span><span class="t"><b>' + (L() === "fr" ? "Voyages par AL MANARAH" : L() === "ar" ? "السفريات مع المنارة" : "Travel by AL MANARAH") + "</b><small>" + (L() === "fr" ? "Omra, Hajj, hôtels, visas (Schengen, Chine, Qatar…)" : L() === "ar" ? "عمرة، حج، فنادق، تأشيرات (شنغن، الصين، قطر…)" : "Umrah, Hajj, hotels, visas (Schengen, China, Qatar…)") + '</small></span><span class="go">→</span></a>' : "";
      $("#shopTitle").textContent = state.fav ? "♥ " + t("saved") : c ? catName(c) : (state.q ? "“" + state.q + "”" : (L() === "fr" ? "Toutes les boutiques" : L() === "ar" ? "كل المتاجر" : "All stores"));
      input.placeholder = t("search"); $("#shopGo").textContent = t("go"); $("#shopMore").textContent = t("more");
      sort.innerHTML = '<option value="new">' + t("newest") + '</option><option value="asc">' + t("cheap") + '</option><option value="desc">' + t("dear") + "</option>"; sort.value = state.sort;
    }
    var storeCounts = {};
    async function loadStores() {
      if (state.fav) { $("#shopStoresWrap").classList.add("mk-hide"); state.hasStores = false; return; }
      var c = CATS.filter(function (x) { return x.slug === state.cat; })[0];
      var q = sb.from("stores").select("id,name,slug,logo_url,cover_url,city,country,category_id,verified").eq("status", "approved");
      if (c) q = q.eq("category_id", c.id);
      if (state.country) q = q.or(mkOr(state.country));
      if (state.city) q = q.eq("city", state.city);
      if (state.q) {
        var sq = state.q.replace(/[%,()]/g, " ");
        var pr = await sb.from("products").select("store_id").eq("status", "approved").or("title.ilike.%" + sq + "%,description.ilike.%" + sq + "%").limit(1000);
        var ids = Array.from(new Set((pr.data || []).map(function (x) { return x.store_id; }))).slice(0, 150);
        q = q.or("name.ilike.%" + sq + "%,description.ilike.%" + sq + "%,city.ilike.%" + sq + "%" + (ids.length ? ",id.in.(" + ids.join(",") + ")" : ""));
      }
      var r = await q.order("verified", { ascending: false }).order("created_at", { ascending: false }).limit(60);
      var st = r.data || [];
      $("#shopStoresWrap").classList.remove("mk-hide");
      $("#shopStoresT").textContent = (L() === "ar" ? "المتاجر" : L() === "en" ? "Stores" : "Boutiques") + " (" + st.length + ")";
      $("#shopStores").innerHTML = st.length ? st.map(function (x) { return storeCard(x, null); }).join("") : emptyBox("🔎", t("none"), t("none_hint"), true);
      state.hasStores = st.length > 0;
    }
    function draw() {
      $("#shopProdT").classList.toggle("mk-hide", !state.hasStores || state.fav);
      $("#shopProdT").textContent = L() === "ar" ? "المنتجات" : L() === "en" ? "Products" : "Produits";
      if (!state.items.length && state.hasStores && !state.fav) { $("#shopGrid").innerHTML = '<p class="mk-small">' + t("none") + "</p>"; $("#shopMore").classList.add("mk-hide"); return; }
      $("#shopGrid").innerHTML = state.items.length ? state.items.map(function (p) { return card(p, state.pm); }).join("") : state.fav ? emptyBox("♡", t("no_saved")) : emptyBox("🔎", t("none"), t("none_hint"), true);
      $("#shopMore").classList.toggle("mk-hide", state.done || !state.items.length);
    }
    async function load(reset) {
      /* products are shown only inside each store: the shop lists stores (saved items excepted) */
      var only = !state.fav;
      ["#fCond", "#fMin", "#fMax", "#shopSort"].forEach(function (id) { var e = $(id); if (e) e.classList.toggle("mk-hide", only); });
      if (only) { await loadStores(); $("#shopProdT").classList.add("mk-hide"); $("#shopGrid").innerHTML = ""; $("#shopMore").classList.add("mk-hide"); return; }
      $("#shopStoresWrap").classList.add("mk-hide");
      if (reset) { await loadStores(); state.page = 0; state.items = []; state.done = false; $("#shopGrid").innerHTML = '<div class="mk-skel"></div><div class="mk-skel"></div><div class="mk-skel"></div>'; }
      var per = 24, q = sb.from("products").select(state.city || state.country ? PSEL.replace("stores(", "stores!inner(") : PSEL).eq("status", "approved");
      if (state.country) q = q.or(mkOr(state.country), { referencedTable: "stores" });
      if (state.fav) { var fv = lsGet("mk_fav"); if (!fv.length) { state.items = []; state.done = true; return draw(); } q = q.in("id", fv.slice(0, 200)); }
      if (state.city) q = q.eq("stores.city", state.city);
      if (state.cond) q = q.eq("condition", state.cond);
      if (state.min !== "") q = q.gte("price", +state.min);
      if (state.max !== "") q = q.lte("price", +state.max);
      var c = CATS.filter(function (x) { return x.slug === state.cat; })[0]; if (c && !state.fav) q = q.eq("category_id", c.id);
      if (state.q) q = q.or("title.ilike.%" + state.q.replace(/[%,()]/g, " ") + "%,description.ilike.%" + state.q.replace(/[%,()]/g, " ") + "%");
      q = state.sort === "asc" ? q.order("price", { ascending: true }) : state.sort === "desc" ? q.order("price", { ascending: false }) : q.order("created_at", { ascending: false });
      var r = await q.range(state.page * per, state.page * per + per - 1);
      var got = r.data || []; state.items = state.items.concat(got); state.done = got.length < per; state.page++;
      state.pm = await promoMap(state.items); draw();
    }
    $("#shopChips").addEventListener("click", function (e) {
      var fc = e.target.closest("[data-fav-chip]"); if (fc) { e.preventDefault(); state.fav = true; state.cat = ""; history.replaceState(null, "", "/shop.html?fav=1"); chips(); load(true); return; }
      var a = e.target.closest("[data-cat]"); if (!a) return; e.preventDefault(); state.fav = false; state.cat = a.dataset.cat; history.replaceState(null, "", "/shop.html" + (state.cat ? "?cat=" + state.cat : "")); chips(); load(true); });
    $("#shopForm").addEventListener("submit", function (e) { e.preventDefault(); state.q = input.value.trim(); load(true); chips(); });
    sort.addEventListener("change", function () { state.sort = sort.value; load(true); });
    $("#shopMore").addEventListener("click", function () { load(false); });
    rerender = function () { chips(); draw(); };
    chips(); load(true);
  }

  /* =============== STORE =============== */
  async function pageStore() {
    await cats();
    var m = location.pathname.toLowerCase().match(/^\/(?:store\/)?([a-z0-9][a-z0-9-]+)\/?$/), slug = (m && m[1] !== "store" && m[1]) || qs("s") || "";
    var box = $("#storeApp");
    if (!slug) { box.innerHTML = '<div class="container section">' + emptyBox("🔎", t("not_found")) + "</div>"; return; }
    var r = await sb.from("stores").select("*").eq("slug", slug).maybeSingle(), s = r.data;
    if (!s) { box.innerHTML = '<div class="container section">' + emptyBox("🔎", t("not_found")) + "</div>"; return; }
    document.title = s.name + " | AL MANARAH GLOBAL SERVICES";
    var md = document.querySelector('meta[name="description"]'); if (md && s.description) md.content = s.description.slice(0, 160);
    var pr = await sb.from("products").select(PSEL).eq("store_id", s.id).eq("status", "approved").order("created_at", { ascending: false }).limit(1000);
    var items = pr.data || [], pm = await promoMap(items), state = { q: "", cat: 0 };
    var rv = await sb.from("reviews").select("name,rating,comment,created_at").eq("store_id", s.id).eq("status", "approved").order("created_at", { ascending: false }).limit(100);
    var revs = rv.data || [], avg = revs.length ? revs.reduce(function (a, r) { return a + r.rating; }, 0) / revs.length : 0;
    var link = storeUrl(s.slug), picks = [];
    /* multi-select: the customer picks several products and sends one request */
    function T3(en, fr, ar) { return L() === "fr" ? fr : L() === "ar" ? ar : en; }
    function pickBar() {
      var bar = $("#stPickBar"); if (!bar) { bar = document.createElement("div"); bar.id = "stPickBar"; bar.className = "mk-pickbar"; document.body.appendChild(bar); }
      if (!picks.length) { bar.classList.add("mk-hide"); return; }
      bar.classList.remove("mk-hide");
      bar.innerHTML = '<span><b>' + picks.length + "</b> " + T3("selected", "sélectionné(s)", "مختار") + '</span><button type="button" class="mk-link" data-pclear>' + T3("Clear", "Effacer", "مسح") + '</button><button type="button" class="btn btn-gold btn-sm" data-preq>' + T3("Request these", "Demander ces produits", "اطلب هذه") + " →</button>";
    }
    function markPicks() { $$("#stGrid [data-pick]").forEach(function (b) { var on = picks.indexOf(b.dataset.pick) > -1; b.classList.toggle("on", on); b.textContent = on ? "✓" : "+"; }); }
    function pickedItems() { return picks.map(function (id) { return items.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean); }
    function multiModal() {
      var list = pickedItems(), tot = {};
      list.forEach(function (p) { var x = priceOf(p, pm); if (x.now) tot[x.cur] = (tot[x.cur] || 0) + x.now; });
      var lines = list.map(function (p) { var x = priceOf(p, pm); return "• " + p.title + (x.now ? " — " + money(x.now, x.cur) : ""); });
      var totTxt = Object.keys(tot).map(function (c) { return money(tot[c], c); }).join(" + ");
      var md = document.createElement("div"); md.className = "mk-modal";
      md.innerHTML = '<div class="box"><button class="x" type="button">✕</button><h3 style="margin-top:0">' + T3("Your selection", "Votre sélection", "اختياراتك") + " (" + list.length + ')</h3><div class="mk-small" style="white-space:pre-line;color:var(--ink);line-height:1.6">' + esc(lines.join("\n")) + "</div>" + (totTxt ? '<p style="margin:10px 0"><b>' + t("total") + ": " + esc(totTxt) + "</b></p>" : "") +
        '<form class="mk-form" id="mrF"><div><label>' + t("name") + ' *</label><input name="cname" required maxlength="80"></div><div><label>' + t("phone") + ' *</label><input name="phone" required type="tel" maxlength="30"></div><div class="full"><label>' + t("city") + '</label><input name="city" maxlength="60"></div><div class="full"><label>' + t("message") + '</label><textarea name="note" maxlength="800" style="min-height:70px"></textarea></div>' +
        '<div class="full" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary" type="submit">' + t("send") + "</button>" + (wa(s.whatsapp || s.phone) ? '<a class="btn btn-wa2" target="_blank" rel="noopener" href="' + wa(s.whatsapp || s.phone, T3("Hello, I am interested in:", "Bonjour, je suis intéressé(e) par :", "السلام عليكم، أنا مهتم بـ:") + "\n" + lines.join("\n") + (totTxt ? "\n" + t("total") + ": " + totTxt : "") + "\n" + link) + '">' + t("wa") + "</a>" : "") + '</div><div class="full" id="mrM"></div></form></div>';
      document.body.appendChild(md);
      $(".x", md).onclick = function () { md.remove(); }; md.addEventListener("click", function (e) { if (e.target === md) md.remove(); });
      $("#mrF", md).addEventListener("submit", async function (e) {
        e.preventDefault(); var f = e.target, b = f.querySelector("button[type=submit]"); b.disabled = true;
        var note = (f.note.value.trim() ? f.note.value.trim() + "\n" : "") + T3("Grouped request:", "Demande groupée :", "طلب مجمّع:") + "\n" + lines.join("\n");
        var refs = [], bad = false;
        for (var i = 0; i < list.length; i++) { var r = await sb.rpc("submit_request", { p_store: s.id, p_product: list[i].id, p_qty: 1, p_name: f.cname.value.trim(), p_phone: f.phone.value.trim(), p_city: f.city.value.trim() || null, p_note: note.slice(0, 800) }); if (r.error) bad = true; else refs.push(r.data); }
        b.disabled = false;
        if (bad && !refs.length) return msg($("#mrM", md), "err", t("fail"));
        msg($("#mrM", md), "ok", t("sent") + " <b>" + esc(refs.join(", ")) + "</b>"); f.reset(); picks = []; markPicks(); pickBar();
      });
    }
    document.addEventListener("click", function (e) {
      var pb = e.target.closest && e.target.closest("#stGrid [data-pick]");
      if (pb) { e.preventDefault(); e.stopPropagation(); var id = pb.dataset.pick, i = picks.indexOf(id); if (i > -1) picks.splice(i, 1); else picks.push(id); markPicks(); pickBar(); return; }
      if (e.target.closest && e.target.closest("[data-pclear]")) { picks = []; markPicks(); pickBar(); }
      if (e.target.closest && e.target.closest("[data-preq]")) multiModal();
    }, true);
    function grid() {
      var list = items.filter(function (p) { return (!state.sec || p.section === state.sec) && (!state.cat || p.category_id === state.cat) && (!state.q || (p.title + " " + (p.description || "")).toLowerCase().indexOf(state.q) > -1); });
      $("#stGrid").innerHTML = list.length ? list.map(function (p) { return card(p, pm).replace('<div class="img">', '<div class="img"><button type="button" class="mk-pick" data-pick="' + p.id + '" aria-label="select">+</button>'); }).join("") : emptyBox("🛍️", t("none"));
      markPicks(); pickBar();
      if (list.length > 1 && !$("#stPickHint")) { var h = document.createElement("p"); h.id = "stPickHint"; h.className = "mk-small"; h.style.margin = "0 0 10px"; h.textContent = T3("Tip: tap + on several products to request them together.", "Astuce : touchez + sur plusieurs produits pour les demander ensemble.", "نصيحة: اضغط + على عدة منتجات لتطلبها معًا."); $("#stGrid").before(h); }
    }
    rerender = function () {
      var used = Array.from(new Set(items.map(function (p) { return p.category_id; })));
      var secs = (s.sections || []).filter(function (x) { return items.some(function (p) { return p.section === x; }); });
      box.innerHTML = '<div class="st-cover"' + (s.cover_url ? ' style="background-image:url(\'' + esc(s.cover_url) + '\')"' : "") + '></div><div class="container"><div class="st-head">' +
        (s.logo_url ? '<img class="logo" src="' + esc(s.logo_url) + '" alt="' + esc(s.name) + '">' : '<span class="logo">' + initials(s.name) + "</span>") +
        '<div class="t"><h1>' + esc(s.name) + "</h1>" + '<div class="meta">' + (s.verified ? '<span class="mk-verified">✔ ' + t("verified") + "</span>" : "") + "<span>" + esc(catName(catById(s.category_id))) + "</span>" + (s.city ? "<span>📍 " + esc(s.city) + (s.address ? ", " + esc(s.address) : "") + "</span>" : "") + "<span>" + items.length + " " + t("products") + "</span>" + (revs.length ? "<span>" + stars(avg) + " " + avg.toFixed(1) + " (" + revs.length + ")</span>" : "") + "<span>" + t("member") + " " + dateFmt(s.created_at) + "</span></div></div>" +
        '<div class="st-actions">' + (wa(s.whatsapp || s.phone) ? '<a class="btn btn-wa2 btn-sm" target="_blank" rel="noopener" href="' + wa(s.whatsapp || s.phone, t("wa_store") + " " + link) + '">' + t("wa") + "</a>" : "") + (tel(s.phone) ? '<a class="btn btn-outline btn-sm" href="' + tel(s.phone) + '">' + t("call") + "</a>" : "") + (hasPay(s) ? '<button type="button" class="btn btn-gold btn-sm" id="stPay">💳 ' + t("pay_online") + "</button>" : "") + "</div></div>" +
        (s.status !== "approved" ? '<div class="mk-msg warn" style="margin-top:16px">' + t("preview") + "</div>" : "") +
        (s.description ? '<p class="st-desc">' + esc(s.description) + "</p>" : "") +
        '<div class="st-share"><b>' + t("share") + ':</b> <code>' + esc(link) + '</code> <button class="mk-btn" id="stCopy" type="button">' + t("copy") + '</button> <a class="mk-btn" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(s.name + " — " + link) + '">' + t("wa") + '</a> <button class="mk-btn" id="stQr" type="button">▦ ' + t("qr") + "</button></div>" +
        '<section class="section" style="padding-top:34px"><div class="mk-bar"><input id="stQ" type="search" placeholder="' + t("in_store") + '"></div>' +
        (secs.length ? '<div class="mk-chips" id="stSecs"><a class="mk-chip on" data-sec="">' + t("all") + "</a>" + secs.map(function (x) { return '<a class="mk-chip" data-sec="' + esc(x) + '">' + esc(x) + "</a>"; }).join("") + "</div>" :
        used.length > 1 ? '<div class="mk-chips" id="stChips"><a class="mk-chip on" data-c="0">' + t("all") + "</a>" + used.map(function (id) { var c = catById(id); return c ? '<a class="mk-chip" data-c="' + id + '">' + esc(c.icon) + " " + esc(catName(c)) + "</a>" : ""; }).join("") + "</div>" : "") +
        '<div class="mk-grid" id="stGrid"></div></section>' +
        '<section class="section" style="padding-top:0"><div class="grid-2" style="align-items:start"><div><h2>' + t("reviews") + (revs.length ? " " + stars(avg) + ' <span class="mk-small">' + avg.toFixed(1) + " / 5 · " + revs.length + "</span>" : "") + "</h2>" +
        (revs.length ? revs.slice(0, 20).map(function (r) { return '<div class="mk-rev">' + stars(r.rating) + " <b>" + esc(r.name) + '</b> <span class="mk-small">' + dateFmt(r.created_at) + "</span>" + (r.comment ? "<p style=\"margin:6px 0 0\">" + esc(r.comment) + "</p>" : "") + "</div>"; }).join("") : '<p class="mk-small">' + t("no_reviews") + "</p>") +
        '<p style="margin-top:14px"><button type="button" class="mk-link" id="stReport">⚑ ' + t("report") + '</button></p></div><div class="mk-panel"><h3 style="margin-top:0">' + t("write_review") + '</h3><form class="mk-form" id="rvF"><div class="full"><div class="mk-rate" id="rvStars">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-n="' + n + '" aria-label="' + n + '">★</button>'; }).join("") + '</div></div><div class="full"><label>' + t("your_name") + ' *</label><input name="rn" required maxlength="60"></div><div class="full"><label>' + t("comment") + '</label><textarea name="rc" maxlength="600" style="min-height:80px"></textarea></div><div class="full"><button class="btn btn-primary btn-sm" type="submit">' + t("send") + '</button><div id="rvM"></div></div></form></div></div></section></div>';
      grid();
      $("#stQ").addEventListener("input", function () { state.q = this.value.trim().toLowerCase(); grid(); });
      var sc = $("#stSecs"); if (sc) sc.addEventListener("click", function (e) { var a = e.target.closest("[data-sec]"); if (!a) return; state.sec = a.dataset.sec; $$(".mk-chip", sc).forEach(function (x) { x.classList.toggle("on", x === a); }); grid(); });
      var ch = $("#stChips"); if (ch) ch.addEventListener("click", function (e) { var a = e.target.closest("[data-c]"); if (!a) return; state.cat = +a.dataset.c; $$(".mk-chip", ch).forEach(function (x) { x.classList.toggle("on", x === a); }); grid(); });
      var rate = 0;
      $$("#rvStars button").forEach(function (b) { b.addEventListener("click", function () { rate = +b.dataset.n; $$("#rvStars button").forEach(function (x) { x.classList.toggle("on", +x.dataset.n <= rate); }); }); });
      $("#rvF").addEventListener("submit", async function (e) { e.preventDefault(); var f = e.target; if (!rate) return msg($("#rvM"), "err", t("required")); var r = await sb.rpc("submit_review", { p_store: s.id, p_name: f.rn.value.trim(), p_rating: rate, p_comment: f.rc.value.trim() || null }); if (r.error) return msg($("#rvM"), "err", t("fail")); msg($("#rvM"), "ok", t("review_sent")); f.reset(); });
      $("#stReport").addEventListener("click", function () { reportModal(s.id, null); });
      var sq = $("#stQr"); if (sq) sq.addEventListener("click", function () { qrModal(s); });
      var sp = $("#stPay"); if (sp) sp.addEventListener("click", function () { payModal(s, ""); });
      $("#stCopy").addEventListener("click", function () { var b = this; (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { b.textContent = t("copied"); }).catch(function () { prompt(t("copy"), link); }); });
    };
    rerender();
  }

  async function qrCanvas(store) {
    var url = store.url || storeUrl(store.slug), qr = window.qrcode(0, "H"); qr.addData(url); qr.make();
    var n = qr.getModuleCount(), W = 720, H = 900, pad = 70, size = W - pad * 2, cell = size / n;
    var c = document.createElement("canvas"); c.width = W; c.height = H; var g = c.getContext("2d");
    g.fillStyle = "#ffffff"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#101B45"; g.fillRect(0, 0, W, 120);
    g.fillStyle = "#ffffff"; g.textAlign = "center"; g.font = "bold 40px Manrope, Arial, sans-serif";
    var name = store.name.length > 28 ? store.name.slice(0, 27) + "…" : store.name; g.fillText(name, W / 2, 72);
    g.fillStyle = "#B78A32"; g.fillRect(0, 120, W, 6);
    var top = 160; g.fillStyle = "#101B45";
    for (var r = 0; r < n; r++) for (var col = 0; col < n; col++) if (qr.isDark(r, col)) g.fillRect(Math.floor(pad + col * cell), Math.floor(top + r * cell), Math.ceil(cell), Math.ceil(cell));
    var src = store.logo_url || "/logo.png";
    await new Promise(function (res) { var im = new Image(); im.crossOrigin = "anonymous"; im.onload = function () { var L = size * 0.2, x = W / 2 - L / 2, y = top + size / 2 - L / 2; g.fillStyle = "#fff"; g.fillRect(x - 8, y - 8, L + 16, L + 16); g.drawImage(im, x, y, L, L); res(); }; im.onerror = res; im.src = src; });
    g.fillStyle = "#101B45"; g.font = "bold 30px Manrope, Arial, sans-serif"; g.fillText(t("scan_me"), W / 2, top + size + 60);
    g.fillStyle = "#555"; g.font = "22px Manrope, Arial, sans-serif"; g.fillText(url.replace(/^https?:\/\//, ""), W / 2, top + size + 100);
    g.fillStyle = "#B78A32"; g.font = "bold 20px Manrope, Arial, sans-serif"; g.fillText("AL MANARAH GLOBAL SERVICES", W / 2, H - 24);
    return c;
  }
  async function qrModal(store) {
    if (!window.qrcode) return;
    var m = document.createElement("div"); m.className = "mk-modal";
    m.innerHTML = '<div class="box" style="text-align:center"><button class="x" type="button">✕</button><h3 style="margin-top:0">' + t("qr") + " — " + esc(store.name) + '</h3><p class="mk-small">' + t("qr_hint") + '</p><div id="qrBox">' + t("loading") + '</div><p><a class="btn btn-primary btn-sm" id="qrDl" download="' + esc(store.slug) + '-qr.png">⬇ ' + t("qr_dl") + "</a></p></div>";
    document.body.appendChild(m); $(".x", m).onclick = function () { m.remove(); }; m.addEventListener("click", function (e) { if (e.target === m) m.remove(); });
    var c = await qrCanvas(store), url;
    try { url = c.toDataURL("image/png"); } catch (e) { store = Object.assign({}, store, { logo_url: null }); c = await qrCanvas(store); url = c.toDataURL("image/png"); }
    $("#qrBox", m).innerHTML = '<img src="' + url + '" alt="QR" style="width:min(320px,100%);border:1px solid var(--line);border-radius:12px;margin:0 auto;display:block">';
    $("#qrDl", m).href = url;
  }

  /* share anything (site, product): link or QR */
  async function shareModal(o) {
    var url = o.url, text = o.name + " — " + url;
    var m = document.createElement("div"); m.className = "mk-modal";
    m.innerHTML = '<div class="box" style="text-align:center"><button class="x" type="button">✕</button><h3 style="margin-top:0">📤 ' + t("share_p") + '</h3><p class="mk-small" style="word-break:break-all"><b>' + esc(o.name) + "</b><br>" + esc(url.replace(/^https?:\/\//, "")) + "</p>" +
      '<div class="mk-share-grid">' + (navigator.share ? '<button type="button" class="mk-btn" data-sh="native">📲 ' + t("share_p") + "</button>" : "") +
      '<a class="mk-btn" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(text) + '">WhatsApp</a>' +
      '<a class="mk-btn" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '">Facebook</a>' +
      '<button type="button" class="mk-btn" data-sh="copy">🔗 ' + t("copy") + '</button><button type="button" class="mk-btn" data-sh="qr">▦ ' + t("qr") + "</button></div>" +
      '<div id="shQr" style="margin-top:14px"></div></div>';
    document.body.appendChild(m); $(".x", m).onclick = function () { m.remove(); }; m.addEventListener("click", function (e) { if (e.target === m) m.remove(); });
    m.addEventListener("click", async function (e) {
      var b = e.target.closest("[data-sh]"); if (!b) return;
      if (b.dataset.sh === "native") { try { await navigator.share({ title: o.name, text: o.name, url: url }); } catch (x) {} }
      if (b.dataset.sh === "copy") { try { await navigator.clipboard.writeText(url); } catch (x) {} b.textContent = "✓ " + t("copied"); }
      if (b.dataset.sh === "qr") {
        var box = $("#shQr", m); box.textContent = t("loading");
        var c = await qrCanvas({ name: o.name, url: url, logo_url: o.logo || "/logo.png" }), d;
        try { d = c.toDataURL("image/png"); } catch (x) { c = await qrCanvas({ name: o.name, url: url, logo_url: "/logo.png" }); d = c.toDataURL("image/png"); }
        box.innerHTML = '<img src="' + d + '" alt="QR" style="width:min(300px,100%);border:1px solid var(--line);border-radius:12px;margin:0 auto;display:block"><p><a class="btn btn-primary btn-sm" download="' + esc(o.file || "almanarah") + '-qr.png" href="' + d + '">⬇ ' + t("qr_dl") + "</a></p>";
      }
    });
  }
  window.AMG_SHARE = shareModal;

  var RESERVED = ["index","shop","store","product","sell","manage","about","contact","travel","umrah","hajj","hotels","visas","services","partners","track","pay","privacy","terms","experiences","library","admin","seller-terms","s","api","www","mail","help","support","login","account","almanarah"];
  var PAYS_ALL = { CI: [["pay_mtn", "MTN Mobile Money"], ["pay_orange", "Orange Money"], ["pay_moov", "Moov Money"], ["pay_wave", "Wave"]], NG: [["pay_opay", "OPay"], ["pay_palmpay", "PalmPay"], ["pay_bank", "Bank transfer (bank – account no.)"]] };
  var PAYS = PAYS_ALL.CI.concat(PAYS_ALL.NG);
  function hasPay(s) { return PAYS.some(function (p) { return s && s[p[0]]; }); }
  function payModal(s, what) {
    var m = document.createElement("div"); m.className = "mk-modal";
    m.innerHTML = '<div class="box"><button class="x" type="button">✕</button><h3 style="margin-top:0">💳 ' + t("pay_online") + " — " + esc(s.name) + "</h3>" + (what ? "<p><b>" + esc(what) + "</b></p>" : "") +
      '<div class="mk-list">' + PAYS.filter(function (p) { return s[p[0]]; }).map(function (p) { return '<div class="mk-row"><div class="mid"><b>' + p[1] + '</b><small style="font-size:1.05rem;color:var(--ink)">' + esc(s[p[0]]) + "</small></div></div>"; }).join("") + "</div>" +
      (s.pay_name ? '<p style="margin-top:12px">' + t("pay_name") + ": <b>" + esc(s.pay_name) + "</b></p>" : "") + '<p class="mk-small">' + t("pay_after") + "</p>" +
      (wa(s.whatsapp || s.phone) ? '<a class="btn btn-wa2 btn-sm" target="_blank" rel="noopener" href="' + wa(s.whatsapp || s.phone, t("pay_online") + (what ? " — " + what : "")) + '">' + t("send_receipt") + "</a>" : "") + "</div>";
    document.body.appendChild(m); $(".x", m).onclick = function () { m.remove(); }; m.addEventListener("click", function (e) { if (e.target === m) m.remove(); });
  }

  function reportModal(storeId, productId) {
    var m = document.createElement("div"); m.className = "mk-modal";
    m.innerHTML = '<div class="box"><button class="x" type="button">✕</button><h3 style="margin-top:0">⚑ ' + t("report_t") + '</h3><form class="mk-form" id="rpF"><div class="full"><label>' + t("reason") + '</label><select name="r">' + ["r_scam", "r_fake", "r_sold", "r_bad", "r_other"].map(function (k) { return '<option value="' + k + '">' + t(k) + "</option>"; }).join("") + '</select></div><div class="full"><label>' + t("details") + '</label><textarea name="d" maxlength="800" style="min-height:80px"></textarea></div><div class="full"><label>' + t("your_contact") + '</label><input name="c" maxlength="80"></div><div class="full"><button class="btn btn-primary btn-sm" type="submit">' + t("send") + '</button><div id="rpM"></div></div></form></div>';
    document.body.appendChild(m); $(".x", m).onclick = function () { m.remove(); };
    $("#rpF", m).onsubmit = async function (e) { e.preventDefault(); var f = e.target; var r = await sb.rpc("submit_report", { p_store: storeId || null, p_product: productId || null, p_reason: f.r.value, p_details: f.d.value.trim() || null, p_contact: f.c.value.trim() || null }); if (r.error) return msg($("#rpM", m), "err", t("fail")); msg($("#rpM", m), "ok", t("thanks_report")); setTimeout(function () { m.remove(); }, 1600); };
  }

  /* =============== PRODUCT =============== */
  async function pageProduct() {
    await cats();
    var id = qs("id"), box = $("#pdApp");
    if (!id) { box.innerHTML = emptyBox("🔎", t("not_found")); return; }
    var r = await sb.from("products").select("*,stores(id,name,slug,logo_url,city,country,phone,whatsapp,verified,status,pay_mtn,pay_orange,pay_moov,pay_wave,pay_opay,pay_palmpay,pay_bank,pay_name)").eq("id", id).maybeSingle(), p = r.data;
    if (!p) { box.innerHTML = emptyBox("🔎", t("not_found")); return; }
    document.title = p.title + " | AL MANARAH GLOBAL SERVICES";
    var s = p.stores || {}, pm = await promoMap([p]), pr = priceOf(p, pm), imgs = p.images || [], cur = 0;
    var [more, sim, st] = await Promise.all([
      sb.from("products").select(PSEL).eq("store_id", p.store_id).eq("status", "approved").neq("id", p.id).limit(8),
      sb.from("products").select(PSEL).eq("category_id", p.category_id).eq("status", "approved").neq("store_id", p.store_id).order("created_at", { ascending: false }).limit(8),
      sb.from("product_stats").select("views").eq("product_id", p.id).maybeSingle()
    ]);
    var views = ((st.data || {}).views || 0) + (p.status === "approved" ? 1 : 0);
    if (p.status === "approved") { pushRecent(p.id); sb.rpc("add_view", { p_product: p.id }).then(function () {}, function () {}); }
    var morePm = await promoMap((more.data || []).concat(sim.data || []));
    var link = productUrl(p.id);
    rerender = function () {
      var c = catById(p.category_id), waText = t("wa_msg") + "\n" + p.title + " — " + money(pr.now, pr.cur) + "\n" + link;
      box.innerHTML = '<div class="crumb"><a href="/">AL MANARAH</a> / ' + (c ? '<a href="/shop.html?cat=' + c.slug + '">' + esc(catName(c)) + "</a> / " : "") + "<span>" + esc(p.title) + "</span></div>" +
        (p.status !== "approved" ? '<div class="mk-msg warn">' + stLabel(p.status) + " " + t("review_note") + "</div>" : "") +
        '<div class="pd" style="margin-top:18px"><div><div class="pd-main">' + (imgs.length ? '<img id="pdImg" src="' + esc(imgs[cur]) + '" alt="' + esc(p.title) + '">' : '<div class="mk-empty" style="height:100%;border:0"><span class="e">' + esc((c || {}).icon || "🛍️") + "</span></div>") + "</div>" +
        (imgs.length > 1 ? '<div class="pd-thumbs">' + imgs.map(function (u, i) { return '<button type="button" data-i="' + i + '"' + (i === cur ? ' class="on"' : "") + '><img src="' + esc(u) + '" alt=""></button>'; }).join("") + "</div>" : "") + "</div>" +
        "<div><h1>" + esc(p.title) + "</h1>" + priceHtml(pr) + (pr.off ? ' <span class="mk-status s-new">-' + pr.off + "%</span>" : "") +
        '<div class="mk-tags"><span class="mk-tag">' + t("c_" + (p.condition || "new")) + "</span>" + (p.negotiable ? '<span class="mk-tag">🤝 ' + t("negotiable") + "</span>" : "") + (p.stock != null ? '<span class="mk-tag">' + (p.stock > 0 ? t("stock") + " (" + p.stock + ")" : t("out")) + "</span>" : "") + '<span class="mk-tag">👁 ' + views + " " + t("views") + '</span><span class="mk-tag">' + t("posted") + " " + dateFmt(p.created_at) + "</span></div>" +
        '<div class="pd-cta" style="margin-top:18px">' + (wa(s.whatsapp || s.phone) ? '<a class="btn btn-wa2" target="_blank" rel="noopener" href="' + wa(s.whatsapp || s.phone, waText) + '">' + t("wa") + "</a>" : "") + (tel(s.phone) ? '<a class="btn btn-outline" href="' + tel(s.phone) + '">' + t("call") + "</a>" : "") + (hasPay(s) ? '<button type="button" class="btn btn-gold" id="pdPay">💳 ' + t("pay_online") + "</button>" : "") + "</div>" +
        '<div class="mk-inline" style="margin-top:12px"><button type="button" class="mk-btn" data-fav="' + p.id + '">' + (isFav(p.id) ? "♥" : "♡") + " " + t("saved") + '</button><a class="mk-btn" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(p.title + " — " + money(pr.now, pr.cur) + "\n" + link) + '">' + t("share_p") + ' (WhatsApp)</a><button type="button" class="mk-btn" id="pdCopy">' + t("copy") + '</button><button type="button" class="mk-btn" id="pdShare">📤 ' + t("share_p") + " / " + t("qr") + "</button></div>" +
        (p.description ? '<div class="pd-desc">' + esc(p.description) + "</div>" : "") +
        '<div class="mk-safe"><b>🛡 ' + t("safety_t") + "</b><ul>" + t("safety").map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul><p style="margin:8px 0 0"><button type="button" class="mk-link" id="pdReport">⚑ ' + t("report") + "</button></p></div>" +
        '<a class="pd-seller" href="/' + esc(s.slug) + '">' + (s.logo_url ? '<img class="logo" src="' + esc(s.logo_url) + '" alt="">' : '<span class="logo">' + initials(s.name) + "</span>") +
        '<span><span class="mk-small">' + t("seller") + "</span><br><b>" + esc(s.name) + "</b>" + (s.verified ? ' <span class="mk-verified">✔ ' + t("verified") + "</span>" : "") + "<br><span class=\"mk-small\">" + esc(s.city || "") + '</span></span><span class="mk-more" style="margin-inline-start:auto">' + t("view_store") + " →</span></a>" +
        '<div class="mk-panel"><h3 style="margin-top:0">' + t("req_title") + '</h3><p class="mk-small">' + t("req_note") + '</p><form id="reqForm" class="mk-form">' +
        '<div><label>' + t("name") + ' *</label><input name="cname" required maxlength="80" autocomplete="name"></div><div><label>' + t("phone") + ' *</label><input name="phone" required type="tel" maxlength="30" autocomplete="tel"></div>' +
        '<div><label>' + t("city") + '</label><input name="city" maxlength="60"></div><div><label>' + t("qty") + '</label><input name="qty" type="number" min="1" value="1"></div>' +
        '<div class="full"><label>' + t("message") + '</label><textarea name="note" maxlength="800" style="min-height:80px"></textarea></div><div class="full"><button class="btn btn-primary" type="submit">' + t("send") + '</button><div id="reqMsg"></div></div></form></div></div></div>' +
        ((more.data || []).length ? '<section class="section" style="padding-bottom:0"><div class="mk-sec-head"><h2>' + t("more_store") + '</h2><a class="mk-more" href="/' + esc(s.slug) + '">' + t("view_store") + ' →</a></div><div class="mk-grid">' + more.data.map(function (x) { return card(x, morePm); }).join("") + "</div></section>" : "") +
        ((sim.data || []).length ? '<section class="section" style="padding-bottom:0"><div class="mk-sec-head"><h2>' + t("similar") + '</h2></div><div class="mk-grid">' + sim.data.map(function (x) { return card(x, morePm); }).join("") + "</div></section>" : "") +
        '<div class="mk-sticky">' + (wa(s.whatsapp || s.phone) ? '<a class="btn btn-wa2" target="_blank" rel="noopener" href="' + wa(s.whatsapp || s.phone, waText) + '">' + t("wa") + "</a>" : "") + (tel(s.phone) ? '<a class="btn btn-primary" href="' + tel(s.phone) + '">' + t("call") + "</a>" : "") + "</div>";
      $("#pdShare").addEventListener("click", function () { shareModal({ name: p.title, url: link, logo: (p.images || [])[0], file: "produit" }); });
      $("#pdCopy").addEventListener("click", function () { var b = this; (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { b.textContent = t("copied"); }).catch(function () { prompt(t("copy"), link); }); });
      $("#pdReport").addEventListener("click", function () { reportModal(p.store_id, p.id); });
      var pp = $("#pdPay"); if (pp) pp.addEventListener("click", function () { payModal(s, p.title + " — " + money(pr.now, pr.cur)); });
      var th = $(".pd-thumbs"); if (th) th.addEventListener("click", function (e) { var b = e.target.closest("[data-i]"); if (!b) return; cur = +b.dataset.i; $("#pdImg").src = imgs[cur]; $$("button", th).forEach(function (x) { x.classList.toggle("on", x === b); }); });
      $("#reqForm").addEventListener("submit", async function (e) {
        e.preventDefault(); var f = e.target, b = f.querySelector("button"); b.disabled = true;
        var ins = await sb.rpc("submit_request", { p_store: p.store_id, p_product: p.id, p_qty: Math.max(1, +f.qty.value || 1), p_name: f.cname.value.trim(), p_phone: f.phone.value.trim(), p_city: f.city.value.trim() || null, p_note: f.note.value.trim() || null });
        b.disabled = false;
        if (ins.error) msg($("#reqMsg"), "err", t("fail")); else { msg($("#reqMsg"), "ok", t("sent") + " <b>" + esc(ins.data) + "</b>"); f.reset(); }
      });
    };
    rerender();
  }

  /* =============== SELLER (merchant) =============== */
  async function pageSell() {
    var app = $("#sellApp"), recovering = false;
    sb.auth.onAuthStateChange(function (ev, session) {
      if (ev === "PASSWORD_RECOVERY") { recovering = true; _user = session ? session.user : null; showRecovery(); }
    });
    var u = await user();
    if (recovering) return;
    if (!u) return showAuth();
    var me = await profile(), adminView = qs("store"), store;
    if (adminView && me && me.role === "admin") store = (await sb.from("stores").select("*").eq("id", adminView).maybeSingle()).data;
    else store = (await sb.from("stores").select("*").eq("owner_id", u.id).order("created_at").limit(1).maybeSingle()).data;
    $("#sellIntro") && $("#sellIntro").classList.add("mk-hide");
    if (!store) return showSetup(me);
    return dashboard(store, me, !!adminView);

    function showRecovery() {
      app.innerHTML = '<div class="mk-panel mk-auth"><h2>' + t("new_pw") + '</h2><form id="rcF" class="mk-form"><div class="full"><label>' + t("new_pw") + '</label><input name="pw" type="password" minlength="8" required autocomplete="new-password"></div><div class="full"><button class="btn btn-primary">' + t("save_pw") + '</button></div></form><div id="rcM"></div></div>';
      $("#rcF").addEventListener("submit", async function (e) { e.preventDefault(); var r = await sb.auth.updateUser({ password: e.target.pw.value }); if (r.error) msg($("#rcM"), "err", esc(r.error.message)); else { msg($("#rcM"), "ok", t("pw_saved")); setTimeout(function () { location.href = "/sell.html"; }, 1200); } });
    }
    function showAuth(mode) {
      mode = mode || (qs("mode") === "login" ? "login" : "signup");
      rerender = function () { showAuth(mode); };
      app.innerHTML = '<div class="mk-panel mk-auth"><div class="mk-tabs"><button type="button" data-m="signup"' + (mode === "signup" ? ' class="on"' : "") + ">" + t("signup") + '</button><button type="button" data-m="login"' + (mode === "login" ? ' class="on"' : "") + ">" + t("login") + "</button></div>" +
        (mode === "forgot" ? '<form id="auF" class="mk-form"><div class="full"><label>' + t("email") + '</label><input name="email" type="email" required autocomplete="email"></div><div class="full"><button class="btn btn-primary">' + t("send_reset") + "</button></div></form>" :
          '<form id="auF" class="mk-form">' + (mode === "signup" ? '<div class="full"><label>' + t("owner") + ' *</label><input name="full_name" required maxlength="80" autocomplete="name"></div><div class="full"><label>' + t("store_phone") + ' *</label><input name="phone" type="tel" required maxlength="30" autocomplete="tel"><div class="hint">' + t("phone_hint") + "</div></div>" : "") +
          '<div class="full"><label>' + t("email") + ' *</label><input name="email" type="email" required autocomplete="email"></div><div class="full"><label>' + t("password") + ' *</label><input name="pw" type="password" minlength="8" required autocomplete="' + (mode === "signup" ? "new-password" : "current-password") + '"><div class="hint">' + t("pw_hint") + "</div></div>" +
          '<div class="full"><button class="btn btn-primary" style="width:100%">' + (mode === "signup" ? t("signup") : t("login")) + "</button></div>" + (mode === "login" ? '<div class="full"><a href="#" id="auForgot" class="mk-small">' + t("forgot") + "</a></div>" : "") + "</form>") +
        '<div id="auM"></div></div>';
      $$(".mk-tabs button", app).forEach(function (b) { b.addEventListener("click", function () { showAuth(b.dataset.m); }); });
      var fg = $("#auForgot"); if (fg) fg.addEventListener("click", function (e) { e.preventDefault(); showAuth("forgot"); });
      $("#auF").addEventListener("submit", async function (e) {
        e.preventDefault(); var f = e.target, b = f.querySelector("button"), M = $("#auM"); b.disabled = true; msg(M, "info", t("loading"));
        var r;
        if (mode === "forgot") { r = await sb.auth.resetPasswordForEmail(f.email.value.trim(), { redirectTo: location.origin + "/sell.html" }); b.disabled = false; return r.error ? msg(M, "err", esc(r.error.message)) : msg(M, "ok", t("reset_sent")); }
        if (mode === "login") r = await sb.auth.signInWithPassword({ email: f.email.value.trim(), password: f.pw.value });
        else r = await sb.auth.signUp({ email: f.email.value.trim(), password: f.pw.value, options: { emailRedirectTo: location.origin + "/sell.html", data: { full_name: f.full_name.value.trim(), phone: f.phone.value.trim() } } });
        b.disabled = false;
        if (r.error) return msg(M, "err", mode === "login" ? t("bad_login") : esc(r.error.message));
        if (!r.data.session) return msg(M, "ok", t("confirm_email"));
        location.reload();
      });
    }
  }

  async function showSetup(me, existing) {
    await cats();
    var app = $("#sellApp"), u = await user(), s = existing || {};
    var draft = { logo: s.logo_url || "", cover: s.cover_url || "" };
    rerender = function () { showSetup(me, existing); };
    app.innerHTML = (existing ? "" : '<div class="mk-panel"><h2 style="margin-top:0">' + t("setup_t") + '</h2><p class="mk-small">' + t("setup_p") + "</p>") + storeForm(s, me) + (existing ? "" : "</div>");
    wireStoreForm(draft, s, u, async function (row) {
      var r = await sb.from("stores").insert(row).select().single();
      if (r.error) return r.error;
      location.reload();
    });
  }
  function storeForm(s, me) {
    var catOpts = (CATS || []).filter(function (c) { return c.active; }).map(function (c) { return '<option value="' + c.id + '"' + (s.category_id === c.id ? " selected" : "") + ">" + esc(c.icon + " " + catName(c)) + "</option>"; }).join("");
    var locked = s.id && s.status === "approved";
    return '<form id="stF" class="mk-form">' +
      '<div><label>' + t("owner") + ' *</label><input name="owner_name" required maxlength="80" value="' + esc(s.owner_name || (me && me.full_name) || "") + '"></div>' +
      '<div><label>' + t("bname") + ' *</label><input name="bname" required maxlength="80" value="' + esc(s.name || "") + '"></div>' +
      '<div class="full"><label>' + t("slug") + ' *</label><div class="mk-inline"><span class="mk-small">' + esc(location.host) + '/</span><input name="slug" required pattern="[a-z0-9][a-z0-9-]{2,40}" style="flex:1;min-width:160px" value="' + esc(s.slug || "") + '"' + (locked ? " readonly" : "") + '></div><div class="hint">' + t("slug_hint") + "</div></div>" +
      '<div><label>' + t("main_cat") + ' *</label><select name="category_id" required><option value="">' + t("choose") + "</option>" + catOpts + "</select></div>" +
      '<div><label>' + t("country") + ' *</label><select name="country" required>' + Object.keys(COUNTRIES).map(function (c) { return '<option value="' + c + '"' + ((s.country || myCountry() || "CI") === c ? " selected" : "") + ">" + cName(c) + "</option>"; }).join("") + "</select>" +
        '<label style="display:flex;gap:8px;align-items:center;font-weight:500;margin-top:8px"><input type="checkbox" name="both"' + ((s.markets || []).length > 1 ? " checked" : "") + " style=\"width:auto\"> " + T3x("I sell in both countries (Côte d’Ivoire + Nigeria)", "Je vends dans les deux pays (Côte d’Ivoire + Nigeria)", "أبيع في البلدين (ساحل العاج + نيجيريا)") + "</label></div>" +
      '<div><label>' + t("city") + ' *</label><input name="city" required maxlength="60" list="cityList" autocomplete="off" value="' + esc(s.city || "") + '"><datalist id="cityList"></datalist></div>' +
      '<div class="full"><label>' + t("address") + '</label><input name="address" maxlength="160" value="' + esc(s.address || "") + '"></div>' +
      '<div><label>' + t("store_phone") + ' *</label><input name="phone" type="tel" required maxlength="30" value="' + esc(s.phone || (me && me.phone) || "") + '"><div class="hint">' + t("phone_hint") + "</div></div>" +
      '<div><label>' + t("store_wa") + '</label><input name="whatsapp" type="tel" maxlength="30" value="' + esc(s.whatsapp || "") + '"></div>' +
      '<div class="full"><label>' + t("desc") + '</label><textarea name="description" maxlength="1200">' + esc(s.description || "") + "</textarea></div>" +
      '<div class="full"><label>' + T3x("My sections — what I sell (optional)", "Mes rubriques — ce que je vends (facultatif)", "أقسام متجري — ما أبيعه (اختياري)") + '</label><input name="sections" maxlength="400" placeholder="' + T3x("e.g. Phones, Accessories, Chargers", "ex. : Téléphones, Accessoires, Chargeurs", "مثال: هواتف، إكسسوارات، شواحن") + '" value="' + esc((s.sections || []).join(", ")) + '"><small class="mk-small">' + T3x("Separate with commas. Customers will see them as tabs in your store.", "Séparez par des virgules. Les clients les verront comme onglets dans votre boutique.", "افصل بينها بفاصلة، وتظهر للزبائن كتبويبات في متجرك.") + "</small></div>" +
      '<div class="full" style="margin-top:8px"><b>💳 ' + t("pay_sec") + '</b><div class="hint">' + t("pay_hint") + "</div></div>" +
      PAYS.map(function (p) { var cc = PAYS_ALL.NG.indexOf(p) > -1 ? "NG" : "CI"; return '<div class="pay-f" data-c="' + cc + '"><label>' + p[1] + '</label><input name="' + p[0] + '" type="text" maxlength="' + (p[0] === "pay_bank" ? 80 : 30) + '" value="' + esc(s[p[0]] || "") + '"></div>'; }).join("") +
      '<div class="full"><label>' + t("pay_name") + '</label><input name="pay_name" maxlength="80" value="' + esc(s.pay_name || "") + '"></div>' +
      '<div><label>' + t("logo") + '</label><div class="mk-imgs" id="lgBox"></div></div><div><label>' + t("cover") + '</label><div class="mk-imgs" id="cvBox"></div></div>' +
      (s.id ? "" : '<div class="full"><label style="display:flex;gap:8px;align-items:flex-start;font-weight:600"><input type="checkbox" name="agree" style="width:auto;margin-top:4px"> <span>' + t("agree") + ' <a href="/seller-terms.html" target="_blank">' + t("agreement") + "</a> — AL MANARAH GLOBAL SERVICES.</span></label></div>") +
      '<div class="full"><button class="btn btn-primary" type="submit">' + (s.id ? t("save") : t("create_store")) + '</button><div id="stM"></div></div></form>';
  }
  function wireStoreForm(draft, s, u, save) {
    var f = $("#stF");
    function imgBox(boxId, key) {
      var b = $("#" + boxId);
      b.innerHTML = draft[key] ? '<div class="im"><img src="' + esc(draft[key]) + '" alt=""><button type="button" aria-label="x">✕</button></div>' : '<label class="add">＋ ' + t("add_photo") + '<input type="file" accept="image/*" hidden></label>';
      var x = $("button", b); if (x) x.onclick = function () { draft[key] = ""; imgBox(boxId, key); };
      var inp = $("input", b); if (inp) inp.onchange = async function () { if (!inp.files[0]) return; b.innerHTML = '<div class="add">' + t("uploading") + "</div>"; try { draft[key] = await upload(inp.files[0], "s"); } catch (e) { msg($("#stM"), "err", t("fail")); } imgBox(boxId, key); };
    }
    imgBox("lgBox", "logo"); imgBox("cvBox", "cover");
    function cityList() { $("#cityList", f).innerHTML = citiesOf(f.country.value).map(function (c) { return '<option value="' + esc(c) + '">'; }).join(""); }
    f.country.addEventListener("change", cityList); cityList();
    function payVis() { var c = f.country.value; $$(".pay-f", f).forEach(function (d) { d.classList.toggle("mk-hide", d.dataset.c !== c); }); }
    f.country.addEventListener("change", payVis); payVis();
    if (!s.id) f.bname.addEventListener("input", function () { if (!f.slug.dataset.touched) f.slug.value = slugify(f.bname.value); });
    f.slug.addEventListener("input", function () { f.slug.dataset.touched = 1; f.slug.value = slugify(f.slug.value); });
    f.addEventListener("submit", async function (e) {
      e.preventDefault(); var M = $("#stM"), b = f.querySelector("button[type=submit]");
      var row = { owner_name: f.owner_name.value.trim(), name: f.bname.value.trim(), slug: slugify(f.slug.value), category_id: +f.category_id.value || null, city: f.city.value.trim(), address: f.address.value.trim() || null, phone: f.phone.value.trim(), whatsapp: f.whatsapp.value.trim() || null, description: f.description.value.trim() || null, logo_url: draft.logo || null, cover_url: draft.cover || null, pay_name: f.pay_name.value.trim() || null, country: f.country.value };
      row.markets = f.both && f.both.checked ? ["CI", "NG"] : [row.country];
      if (f.sections) { var secSeen = {}; row.sections = f.sections.value.split(/[,،;\n]/).map(function (x) { return x.trim().slice(0, 40); }).filter(function (x) { var k = x.toLowerCase(); if (!x || secSeen[k]) return false; secSeen[k] = 1; return true; }).slice(0, 20); }
      PAYS.forEach(function (p) { row[p[0]] = f[p[0]].value.trim() || null; });
      if (!row.owner_name || !row.name || !row.slug || row.slug.length < 3 || !row.category_id || !row.city || !row.phone) return msg(M, "err", t("required"));
      if (RESERVED.indexOf(row.slug) > -1) return msg(M, "err", t("slug_taken"));
      if (!s.id) { if (!f.agree.checked) return msg(M, "err", t("agree_err")); row.owner_id = u.id; row.accepted_terms_at = new Date().toISOString(); }
      b.disabled = true; var err = await save(row); b.disabled = false;
      if (err) msg(M, "err", /stores_slug_key|duplicate/.test(err.message || "") ? t("slug_taken") : esc(err.message)); else msg(M, "ok", t("saved"));
    });
  }

  async function dashboard(store, me, adminView) {
    await Promise.all([cats(), plans()]);
    var app = $("#sellApp"), tab = (location.hash || "#over").slice(1), data = {};
    async function loadAll() {
      var [p, o, pr, rq, st] = await Promise.all([
        sb.from("products").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
        sb.from("orders").select("*,products(title)").eq("store_id", store.id).order("created_at", { ascending: false }).limit(300),
        sb.from("promotions").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
        sb.from("plan_requests").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
        sb.from("stores").select("*").eq("id", store.id).single()
      ]);
      data = { products: p.data || [], orders: o.data || [], promos: pr.data || [], preqs: rq.data || [] }; if (st.data) store = st.data;
    }
    function plan() {
      var p = Object.assign({}, (PLANS || []).filter(function (x) { return x.id === store.plan_id; })[0] || { id: "free", name: "Free", product_limit: 15, price_xof: 0 });
      if (store.custom_product_limit) { p.product_limit = store.custom_product_limit; p.name = p.name + " ★"; }
      return p;
    }
    var maxImg = store.custom_image_limit || MAX_IMAGES;
    function shell() {
      var nNew = data.orders.filter(function (o) { return o.status === "new"; }).length;
      var tabs = [["over", t("t_over")], ["prod", t("t_prod"), data.products.length], ["req", t("t_req"), nNew], ["promo", t("t_promo")], ["store", t("t_store")], ["plan", t("t_plan")]];
      app.innerHTML = (adminView ? '<div class="mk-msg warn">' + t("admin_mode") + ' <a href="/manage.html">' + t("to_admin") + "</a></div>" : "") +
        '<div class="mk-inline" style="justify-content:space-between;margin-bottom:10px"><div class="mk-inline">' + (store.logo_url ? '<img src="' + esc(store.logo_url) + '" alt="" style="width:46px;height:46px;border-radius:50%;object-fit:cover">' : "") + '<h2 style="margin:0">' + esc(store.name) + "</h2> " + stLabel(store.status) + (store.verified ? ' <span class="mk-verified">✔ ' + t("verified") + "</span>" : "") + '</div><div class="mk-inline">' + (me && me.role === "admin" ? '<a class="mk-btn dark" href="/manage.html">' + t("to_admin") + "</a>" : "") + '<button type="button" class="mk-btn" data-tuto>▶ ' + (L() === "fr" ? "Tutoriel" : "Tutorial") + '</button><button class="mk-btn" id="lo" type="button">' + t("logout") + "</button></div></div>" +
        '<div class="mk-tabs">' + tabs.map(function (x) { return '<button type="button" data-t="' + x[0] + '"' + (tab === x[0] ? ' class="on"' : "") + ">" + x[1] + (x[2] ? ' <span class="n">' + x[2] + "</span>" : "") + "</button>"; }).join("") + '</div><div id="tabBody"></div>';
      $$(".mk-tabs button", app).forEach(function (b) { b.addEventListener("click", function () { tab = b.dataset.t; history.replaceState(null, "", location.pathname + location.search + "#" + tab); shell(); }); });
      $("#lo").addEventListener("click", async function () { await sb.auth.signOut(); location.href = "/sell.html?mode=login"; });
      ({ over: tOver, prod: tProd, req: tReq, promo: tPromo, store: tStore, plan: tPlan })[tab] ? ({ over: tOver, prod: tProd, req: tReq, promo: tPromo, store: tStore, plan: tPlan })[tab]() : tOver();
    }
    rerender = shell;
    var B = function () { return $("#tabBody"); };

    function tOver() {
      var pl = plan(), link = storeUrl(store.slug), nNew = data.orders.filter(function (o) { return o.status === "new"; }).length;
      var banner = store.status === "pending" ? '<div class="mk-msg warn">' + t("store_pending") + "</div>" : store.status === "rejected" ? '<div class="mk-msg err">' + t("store_rejected") + (store.admin_note ? "<br>" + t("note_from") + " " + esc(store.admin_note) : "") + "</div>" : store.status === "suspended" ? '<div class="mk-msg err">' + t("store_suspended") + (store.admin_note ? "<br>" + esc(store.admin_note) : "") + "</div>" : "";
      B().innerHTML = banner + '<div class="mk-kpis"><div class="mk-kpi"><b>' + data.products.length + " / " + (pl.product_limit >= 100000 ? "∞" : pl.product_limit) + "</b><span>" + t("used") + '</span></div><div class="mk-kpi"><b>' + nNew + "</b><span>" + t("new_reqs") + '</span></div><div class="mk-kpi"><b>' + esc(pl.name) + "</b><span>" + t("cur_plan") + (store.plan_expires_at ? " · " + t("until") + " " + dateFmt(store.plan_expires_at) : "") + "</span></div></div>" +
        '<div class="st-share"><b>' + t("your_link") + "</b> <code>" + esc(link) + '</code> <button class="mk-btn" id="cp" type="button">' + t("copy") + '</button> <a class="mk-btn" href="/' + esc(store.slug) + '" target="_blank">' + t("view_store") + '</a> <a class="mk-btn" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(store.name + " — " + link) + '">' + t("wa") + '</a> <button class="mk-btn gold" id="ovQr" type="button">▦ ' + t("qr_dl") + "</button></div>" +
        '<p style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" id="goAdd" type="button">＋ ' + t("add_prod") + '</button><button class="btn btn-outline" id="goEdit" type="button">' + t("t_store") + "</button></p>" +
        '<p class="mk-small">' + T3x("You can change your store details at any time: name, city, country (or both countries), phone, WhatsApp, logo, sections and payment numbers.", "Vous pouvez modifier les informations de votre boutique à tout moment : nom, ville, pays (ou les deux pays), téléphone, WhatsApp, logo, rubriques et numéros de paiement.", "يمكنك تعديل بيانات متجرك في أي وقت: الاسم، المدينة، الدولة (أو البلدين)، الهاتف، واتساب، الشعار، الأقسام وأرقام الدفع.") + "</p>";
      $("#cp").addEventListener("click", function () { var b = this; (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { b.textContent = t("copied"); }).catch(function () { prompt(t("copy"), link); }); });
      $("#goAdd").addEventListener("click", function () { productModal(null); });
      $("#goEdit").addEventListener("click", function () { var b = document.querySelector('.mk-tabs [data-t="store"]'); if (b) b.click(); window.scrollTo(0, 0); });
      $("#ovQr").addEventListener("click", function () { qrModal(store); });
    }

    function tProd() {
      var pl = plan();
      B().innerHTML = '<div class="mk-inline" style="justify-content:space-between;margin-bottom:14px"><p class="mk-small" style="margin:0">' + data.products.length + " / " + (pl.product_limit >= 100000 ? "∞" : pl.product_limit) + " " + t("used") + " · " + t("review_note") + '</p><button class="btn btn-primary btn-sm" id="addP" type="button">＋ ' + t("add_prod") + "</button></div>" +
        '<div class="mk-list">' + (data.products.length ? data.products.map(function (p) {
          return '<div class="mk-row">' + ((p.images || [])[0] ? '<img class="th" src="' + esc(p.images[0]) + '" alt="">' : '<span class="th">🛍️</span>') + '<div class="mid"><b>' + esc(p.title) + "</b><small>" + money(p.price, p.currency === "NGN" ? "NGN" : curOf(store.country)) + " · " + esc(catName(catById(p.category_id))) + "</small>" + (p.admin_note ? '<small style="color:#8b2a22">' + t("note_from") + " " + esc(p.admin_note) + "</small>" : "") + "</div>" + stLabel(p.status) +
            '<div class="acts"><button class="mk-btn" data-e="' + p.id + '">' + t("edit") + "</button>" + (p.status === "hidden" ? '<button class="mk-btn" data-s="' + p.id + '">' + t("show") + "</button>" : '<button class="mk-btn" data-h="' + p.id + '">' + t("hide") + "</button>") + '<button class="mk-btn no" data-d="' + p.id + '">' + t("del") + "</button></div></div>";
        }).join("") : emptyBox("📦", t("none"))) + "</div>";
      $("#addP").addEventListener("click", function () { if (data.products.length >= pl.product_limit && !(me && me.role === "admin")) { tab = "plan"; shell(); alert(t("limit")); return; } productModal(null); });
      B().addEventListener("click", async function (e) {
        var b = e.target.closest("button"); if (!b) return;
        var find = function (id) { return data.products.filter(function (p) { return p.id === id; })[0]; };
        if (b.dataset.e) productModal(find(b.dataset.e));
        if (b.dataset.h) { await sb.from("products").update({ status: "hidden" }).eq("id", b.dataset.h); await loadAll(); shell(); }
        if (b.dataset.s) { await sb.from("products").update({ status: "pending" }).eq("id", b.dataset.s); await loadAll(); shell(); }
        if (b.dataset.d && confirm(t("sure"))) { var p = find(b.dataset.d); await sb.from("products").delete().eq("id", b.dataset.d); (p.images || []).forEach(removeImg); await loadAll(); shell(); }
      });
    }

    function productModal(p) {
      p = p || {}; var imgs = (p.images || []).slice();
      var m = document.createElement("div"); m.className = "mk-modal";
      var catOpts = CATS.filter(function (c) { return c.active; }).map(function (c) { return '<option value="' + c.id + '"' + ((p.category_id || store.category_id) === c.id ? " selected" : "") + ">" + esc(c.icon + " " + catName(c)) + "</option>"; }).join("");
      m.innerHTML = '<div class="box"><button class="x" type="button">✕</button><h2 style="margin-top:0">' + (p.id ? t("edit") : t("add_prod")) + '</h2><form class="mk-form" id="pF">' +
        '<div class="full"><label>' + t("title") + ' *</label><input name="ptitle" required maxlength="120" value="' + esc(p.title || "") + '"></div>' +
        '<div><label>' + t("category") + ' *</label><select name="category_id" required>' + catOpts + "</select></div>" +
        ((store.sections || []).length ? '<div><label>' + T3x("Section", "Rubrique", "القسم") + '</label><select name="section"><option value="">—</option>' + store.sections.map(function (x) { return '<option' + (p.section === x ? " selected" : "") + ">" + esc(x) + "</option>"; }).join("") + "</select></div>" : "") +
        ((store.markets || []).length > 1 ? '<div><label>' + T3x("Currency", "Devise", "العملة") + '</label><select name="cur"><option value="XOF"' + (p.currency !== "NGN" ? " selected" : "") + '>FCFA (Côte d’Ivoire)</option><option value="NGN"' + (p.currency === "NGN" ? " selected" : "") + ">₦ Naira (Nigeria)</option></select></div>" : "") +
        '<div><label>' + t("price").replace("FCFA", store.country === "NG" ? "₦" : "FCFA").replace("فرنك", store.country === "NG" ? "نيرة" : "فرنك") + ' *</label><input name="price" type="number" min="0" step="1" required value="' + esc(p.price != null ? p.price : "") + '"></div>' +
        '<div><label>' + t("old_price") + '</label><input name="old" type="number" min="0" step="1" value="' + esc(p.compare_at_price || "") + '"></div>' +
        '<div><label>' + t("qty_stock") + '</label><input name="stock" type="number" min="0" step="1" value="' + esc(p.stock != null ? p.stock : "") + '"></div>' +
        '<div><label>' + t("condition") + '</label><select name="cond">' + ["new", "used", "refurbished"].map(function (c) { return '<option value="' + c + '"' + ((p.condition || "new") === c ? " selected" : "") + ">" + t("c_" + c) + "</option>"; }).join("") + "</select></div>" +
        '<div><label>&nbsp;</label><label style="display:flex;gap:8px;align-items:center;font-weight:600"><input type="checkbox" name="neg" style="width:auto"' + (p.negotiable ? " checked" : "") + "> " + t("negotiable") + "</label></div>" +
        '<div class="full"><label>' + t("desc") + '</label><textarea name="description" maxlength="3000">' + esc(p.description || "") + "</textarea></div>" +
        '<div class="full"><label>' + t("photos").replace("6", maxImg) + '</label><div class="mk-imgs" id="pImgs"></div></div>' +
        '<div class="full"><div class="mk-msg warn" style="margin:0 0 10px">⚠ ' + t("one_rule") + '</div><p class="mk-small">' + t("review_note") + ' <a href="/seller-terms.html" target="_blank">' + t("agreement") + '</a></p><button class="btn btn-primary" type="submit">' + t("save") + '</button><div id="pM"></div></div></form></div>';
      document.body.appendChild(m);
      function close() { m.remove(); }
      $(".x", m).onclick = close; m.addEventListener("click", function (e) { if (e.target === m) close(); });
      function drawImgs() {
        var b = $("#pImgs", m);
        b.innerHTML = imgs.map(function (u, i) { return '<div class="im"><img src="' + esc(u) + '" alt=""><button type="button" data-x="' + i + '">✕</button></div>'; }).join("") + (imgs.length < maxImg ? '<label class="add">＋ ' + t("add_photo") + '<input type="file" accept="image/*" multiple hidden></label>' : "");
        $$("[data-x]", b).forEach(function (x) { x.onclick = function () { imgs.splice(+x.dataset.x, 1); drawImgs(); }; });
        var inp = $("input[type=file]", b); if (inp) inp.onchange = async function () {
          var files = Array.prototype.slice.call(inp.files, 0, maxImg - imgs.length); var add = $(".add", b); if (add) add.textContent = t("uploading");
          for (var i = 0; i < files.length; i++) { try { imgs.push(await upload(files[i], "p")); } catch (e) { msg($("#pM", m), "err", t("fail")); } }
          drawImgs();
        };
      }
      drawImgs();
      $("#pF", m).addEventListener("submit", async function (e) {
        e.preventDefault(); var f = e.target, b = f.querySelector("button[type=submit]"), M = $("#pM", m);
        var row = { title: f.ptitle.value.trim(), category_id: +f.category_id.value, price: Math.max(0, Math.round(+f.price.value || 0)), compare_at_price: +f.old.value ? Math.round(+f.old.value) : null, stock: f.stock.value === "" ? null : Math.max(0, Math.round(+f.stock.value)), description: f.description.value.trim() || null, images: imgs, condition: f.cond.value, negotiable: f.neg.checked };
        if (f.section) row.section = f.section.value || null;
        row.currency = f.cur ? f.cur.value : (store.country === "NG" ? "NGN" : "XOF");
        if (!row.title || !row.category_id) return msg(M, "err", t("required"));
        b.disabled = true;
        var r = p.id ? await sb.from("products").update(row).eq("id", p.id) : await sb.from("products").insert(Object.assign({ store_id: store.id }, row));
        b.disabled = false;
        if (r.error) return msg(M, "err", /PLAN_LIMIT/.test(r.error.message) ? t("limit") : esc(r.error.message));
        close(); tab = "prod"; await loadAll(); shell();
      });
    }

    function tReq() {
      B().innerHTML = '<div class="mk-list">' + (data.orders.length ? data.orders.map(function (o) {
        var waT = (L() === "fr" ? "Bonjour " : L() === "ar" ? "السلام عليكم " : "Hello ") + o.customer_name + " — " + store.name + " (" + o.ref + ")";
        return '<div class="mk-row"><div class="mid"><b>' + esc(o.customer_name) + ' <span class="mk-small">' + esc(o.ref) + "</span></b><small>" + esc(o.product_title || (o.products || {}).title || "") + (o.unit_price ? " · " + money(o.unit_price, curOf(store.country)) : "") + " · " + t("qty") + ": " + o.quantity + "</small><small>📞 " + esc(o.customer_phone) + (o.customer_city ? " · " + esc(o.customer_city) : "") + " · " + dateFmt(o.created_at) + "</small>" + (o.note ? "<small>💬 " + esc(o.note) + "</small>" : "") + "</div>" +
          '<div class="acts"><a class="mk-btn ok" target="_blank" rel="noopener" href="' + wa(o.customer_phone, waT) + '">' + t("reply_wa") + '</a><a class="mk-btn" href="' + tel(o.customer_phone) + '">' + t("call") + '</a><select class="mk-btn" data-o="' + o.id + '">' + ["new", "contacted", "completed", "cancelled"].map(function (s) { return '<option value="' + s + '"' + (o.status === s ? " selected" : "") + ">" + t("st_" + s) + "</option>"; }).join("") + "</select></div></div>";
      }).join("") : emptyBox("📭", t("no_req"))) + "</div>";
      $$("select[data-o]", B()).forEach(function (s) { s.addEventListener("change", async function () { await sb.from("orders").update({ status: s.value }).eq("id", s.dataset.o); var o = data.orders.filter(function (x) { return x.id === s.dataset.o; })[0]; if (o) o.status = s.value; }); });
    }

    function tPromo() {
      var prodOpts = '<option value="">—</option>' + data.products.map(function (p) { return '<option value="' + p.id + '">' + esc(p.title) + "</option>"; }).join("");
      B().innerHTML = '<div class="mk-panel" style="margin-bottom:20px"><h3 style="margin-top:0">' + t("new_promo") + '</h3><form class="mk-form" id="prF"><div class="full"><label>' + t("promo_title") + ' *</label><input name="ptitle" required maxlength="100"></div>' +
        '<div><label>' + t("discount") + ' *</label><input name="d" type="number" min="1" max="90" required></div><div><label>' + t("product_opt") + '</label><select name="pid">' + prodOpts + "</select></div>" +
        '<div><label>' + t("starts") + '</label><input name="s" type="date"></div><div><label>' + t("ends") + '</label><input name="e" type="date"></div>' +
        '<div class="full"><p class="mk-small">' + t("review_note") + '</p><button class="btn btn-primary btn-sm" type="submit">' + t("save") + '</button><div id="prM"></div></div></form></div>' +
        '<div class="mk-list">' + (data.promos.length ? data.promos.map(function (x) { var pp = data.products.filter(function (p) { return p.id === x.product_id; })[0]; return '<div class="mk-row"><div class="mid"><b>' + esc(x.title) + " · -" + x.discount_percent + "%</b><small>" + (pp ? esc(pp.title) : esc(store.name)) + " · " + dateFmt(x.starts_at) + (x.ends_at ? " → " + dateFmt(x.ends_at) : "") + "</small>" + (x.admin_note ? '<small style="color:#8b2a22">' + esc(x.admin_note) + "</small>" : "") + "</div>" + stLabel(x.status) + '<div class="acts"><button class="mk-btn no" data-dp="' + x.id + '">' + t("del") + "</button></div></div>"; }).join("") : emptyBox("🏷️", t("no_promo"))) + "</div>" +
        '<div class="mk-msg info" style="margin-top:20px">' + t("boost") + ' <a class="mk-btn gold" target="_blank" rel="noopener" href="' + wa(ADMIN_WA, "AL MANARAH — " + store.name + " (" + storeUrl(store.slug) + "): " + t("boost_btn")) + '">' + t("boost_btn") + "</a></div>";
      $("#prF").addEventListener("submit", async function (e) {
        e.preventDefault(); var f = e.target;
        var r = await sb.from("promotions").insert({ store_id: store.id, product_id: f.pid.value || null, title: f.ptitle.value.trim(), discount_percent: +f.d.value, starts_at: f.s.value ? new Date(f.s.value).toISOString() : new Date().toISOString(), ends_at: f.e.value ? new Date(f.e.value + "T23:59:59").toISOString() : null });
        if (r.error) return msg($("#prM"), "err", esc(r.error.message));
        await loadAll(); shell();
      });
      $$("[data-dp]", B()).forEach(function (b) { b.addEventListener("click", async function () { if (!confirm(t("sure"))) return; await sb.from("promotions").delete().eq("id", b.dataset.dp); await loadAll(); shell(); }); });
    }

    async function tStore() {
      var u = await user(), draft = { logo: store.logo_url || "", cover: store.cover_url || "" };
      B().innerHTML = '<div class="mk-panel">' + storeForm(store, me) + "</div>";
      wireStoreForm(draft, store, u, async function (row) { var r = await sb.from("stores").update(row).eq("id", store.id).select().single(); if (r.error) return r.error; store = r.data; });
    }

    function tPlan() {
      var pl = plan(), C = window.SITE_CONFIG && window.SITE_CONFIG.payments || {}, NG = store.country === "NG";
      function pp(x) { return NG ? (x.price_ngn || 0) : x.price_xof; }
      function mm(n) { return money(n, NG ? "NGN" : "XOF"); }
      B().innerHTML = '<div class="mk-plans">' + PLANS.filter(function (x) { return x.active; }).map(function (x) {
        return '<div class="mk-plan' + (x.id === pl.id ? " cur" : "") + '"><h3>' + esc(x.name) + '</h3><div class="p">' + (pp(x) ? mm(pp(x)) + " <small>" + t("per_month") + "</small>" : t("free")) + "</div><ul><li>" + t("upto") + " " + x.product_limit + " " + t("products") + "</li>" + (x.featured ? "<li>✔ " + t("verified") + "</li>" : "") + "</ul>" +
          (x.id === pl.id ? '<span class="mk-status s-approved">' + t("cur_plan") + (store.plan_expires_at ? " · " + t("until") + " " + dateFmt(store.plan_expires_at) : "") + "</span>" : pp(x) ? '<button class="mk-btn gold" data-pl="' + x.id + '">' + t("choose_plan") + "</button>" : "") + "</div>";
      }).join("") + '</div><div id="payBox"></div>' +
        (data.preqs.length ? '<h3 style="margin-top:28px">' + t("my_reqs") + '</h3><div class="mk-list">' + data.preqs.map(function (r) { return '<div class="mk-row"><div class="mid"><b>' + esc(r.plan_id) + " × " + r.months + "</b><small>" + dateFmt(r.created_at) + " · " + esc(r.payment_ref || "") + "</small>" + (r.admin_note ? "<small>" + esc(r.admin_note) + "</small>" : "") + "</div>" + stLabel(r.status) + "</div>"; }).join("") + "</div>" : "");
      $$("[data-pl]", B()).forEach(function (b) { b.addEventListener("click", function () { payForm(b.dataset.pl); }); });
      function payForm(pid) {
        var x = PLANS.filter(function (y) { return y.id === pid; })[0], receipt = "";
        $("#payBox").innerHTML = '<div class="mk-panel" style="margin-top:20px"><h3 style="margin-top:0">' + t("pay_t") + " — " + esc(x.name) + '</h3><p>' + (NG ? esc(t("pay_ng")) + "<br><b>GTBank: 0926802497</b> — MUHAMMAD JAMIU ISMAIL<br><b>Access Bank: 0823159299</b> — MUHAMMAD-JAMIU ISMAIL<br><b>Moniepoint: 8132881718</b> — AL MANARAH GLOBAL SERVICES" : t("pay_to") + "<br><b>MTN MoMo: " + esc(C.mtn || "+225 05 06 12 23 37") + "</b><br><b>Wave: " + esc(C.wave || "+225 05 06 12 23 37") + "</b><br>" + esc(C.name || "")) + '</p><form class="mk-form" id="pyF">' +
          '<div><label>' + t("months") + '</label><select name="m">' + [1].map(function (n) { return '<option value="' + n + '">' + n + "</option>"; }).join("") + '</select></div><div><label>' + t("method") + '</label><select name="pm">' + (NG ? '<option value="other">GTBank</option><option value="other">Access Bank</option><option value="other">Moniepoint</option>' : '<option value="mtn_momo">MTN MoMo</option><option value="wave">Wave</option><option value="other">Other</option>') + '</select></div>' +
          '<div class="full"><b>' + t("total") + ': <span id="pyT"></span></b></div><div><label>' + t("pay_ref") + ' *</label><input name="ref" required maxlength="80"></div><div><label>' + t("receipt") + '</label><div class="mk-imgs" id="rcBox"></div></div>' +
          '<div class="full"><button class="btn btn-primary btn-sm" type="submit">' + t("submit_pay") + '</button><div id="pyM"></div></div></form></div>';
        var f = $("#pyF"); function tot() { $("#pyT").textContent = mm(pp(x) * +f.m.value); } f.m.onchange = tot; tot();
        function rc() { var b = $("#rcBox"); b.innerHTML = receipt ? '<div class="im"><img src="' + esc(receipt) + '" alt=""><button type="button">✕</button></div>' : '<label class="add">＋<input type="file" accept="image/*" hidden></label>'; var xb = $("button", b); if (xb) xb.onclick = function () { receipt = ""; rc(); }; var i = $("input", b); if (i) i.onchange = async function () { b.innerHTML = '<div class="add">' + t("uploading") + "</div>"; try { receipt = await upload(i.files[0], "r"); } catch (e) {} rc(); }; }
        rc();
        f.addEventListener("submit", async function (e) { e.preventDefault(); var r = await sb.from("plan_requests").insert({ store_id: store.id, plan_id: pid, months: +f.m.value, payment_method: f.pm.value, payment_ref: f.ref.value.trim(), receipt_url: receipt || null }); if (r.error) return msg($("#pyM"), "err", esc(r.error.message)); msg($("#pyM"), "ok", t("pay_sent")); await loadAll(); setTimeout(shell, 1500); });
        $("#payBox").scrollIntoView({ behavior: "smooth" });
      }
    }

    await loadAll(); shell();
  }

  /* =============== ADMIN =============== */
  async function pageManage() {
    var app = $("#admApp"), u = await user();
    if (!u) { app.innerHTML = '<div class="mk-msg info">' + t("login") + ': <a href="/sell.html?mode=login">' + t("login") + "</a></div>"; return; }
    var me = await profile();
    if (!me || me.role !== "admin") { app.innerHTML = '<div class="mk-msg err">Access denied.</div>'; return; }
    await Promise.all([cats(), plans()]);
    try { await sb.rpc("expire_plans"); } catch (e) {}
    var tab = (location.hash || "#over").slice(1), D2 = {}, filt = { st: "pending", pr: "pending", q: "" };
    async function load() {
      var [s, p, pr, rq, o, rv, rp, bn, ms] = await Promise.all([
        sb.from("stores").select("*,profiles(email)").order("created_at", { ascending: false }),
        sb.from("products").select("*,stores(name,slug,country)").order("updated_at", { ascending: false }).limit(2000),
        sb.from("promotions").select("*,stores(name,slug),products(title)").order("created_at", { ascending: false }),
        sb.from("plan_requests").select("*,stores(name,slug,country)").order("created_at", { ascending: false }),
        sb.from("orders").select("*,stores(name,slug)").order("created_at", { ascending: false }).limit(500),
        sb.from("reviews").select("*,stores(name,slug)").order("created_at", { ascending: false }).limit(500),
        sb.from("reports").select("*,stores(name,slug),products(title)").order("created_at", { ascending: false }).limit(500),
        sb.from("banners").select("*").order("sort_order"),
        sb.from("messages").select("*").order("created_at", { ascending: false }).limit(500)
      ]);
      D2 = { stores: s.data || [], products: p.data || [], promos: pr.data || [], preqs: rq.data || [], orders: o.data || [], reviews: rv.data || [], reports: rp.data || [], banners: bn.data || [], msgs: (ms && ms.data) || [] };
    }
    function cnt(arr, st) { return arr.filter(function (x) { return x.status === st; }).length; }
    function shell() {
      var tabs = [["over", "Overview"], ["stores", "Stores", cnt(D2.stores, "pending")], ["products", "Products", cnt(D2.products, "pending")], ["promos", "Promotions", cnt(D2.promos, "pending")], ["pay", "Plan payments", cnt(D2.preqs, "pending")], ["reviews", "Reviews", cnt(D2.reviews, "pending")], ["reports", "Reports", cnt(D2.reports, "open")], ["msgs", "Messages", cnt(D2.msgs, "open")], ["banners", "Banners"], ["orders", "Customer requests"], ["cats", "Categories"], ["plans", "Plans"]];
      app.innerHTML = '<div class="mk-tabs">' + tabs.map(function (x) { return '<button type="button" data-t="' + x[0] + '"' + (tab === x[0] ? ' class="on"' : "") + ">" + x[1] + (x[2] ? ' <span class="n">' + x[2] + "</span>" : "") + "</button>"; }).join("") + '</div><div id="aB"></div>';
      $$(".mk-tabs button", app).forEach(function (b) { b.addEventListener("click", function () { tab = b.dataset.t; history.replaceState(null, "", "#" + tab); shell(); }); });
      var fn = { over: aOver, stores: aStores, products: aProducts, promos: aPromos, pay: aPay, orders: aOrders, cats: aCats, plans: aPlans, reviews: aReviews, reports: aReports, msgs: aMsgs, banners: aBanners }[tab] || aOver; fn();
    }
    var B = function () { return $("#aB"); };
    async function act(promise) { var r = await promise; if (r && r.error) alert(r.error.message); await load(); shell(); }
    function pcount(sid) { return D2.products.filter(function (p) { return p.store_id === sid; }).length; }

    function aOver() {
      var paid = D2.stores.filter(function (s) { return s.plan_id !== "free"; });
      var mrr = paid.reduce(function (a, s) { var p = PLANS.filter(function (x) { return x.id === s.plan_id; })[0]; return a + (p ? p.price_xof : 0); }, 0);
      B().innerHTML = '<div class="mk-kpis">' + [[D2.stores.length, "Stores"], [cnt(D2.stores, "approved"), "Live stores"], [cnt(D2.stores, "pending"), "Stores to approve"], [D2.products.length, "Products"], [cnt(D2.products, "pending"), "Products to approve"], [cnt(D2.preqs, "pending"), "Payments to confirm"], [paid.length, "Paid stores"], [money(mrr), "Monthly subscriptions"], [D2.orders.length, "Customer requests"]].map(function (k) { return '<div class="mk-kpi"><b>' + k[0] + "</b><span>" + k[1] + "</span></div>"; }).join("") + "</div>" +
        '<p class="mk-small">Customer requests go to each seller. You approve stores, products, promotions and plan payments here. Travel enquiries (AMG) stay in your <a href="/admin.html">travel dashboard</a>.</p>';
    }

    function aStores() {
      var list = D2.stores.filter(function (s) { return (!filt.st || s.status === filt.st) && (!filt.q || (s.name + " " + s.owner_name + " " + s.phone + " " + s.city + " " + s.slug).toLowerCase().indexOf(filt.q) > -1); });
      B().innerHTML = '<p><button class="btn btn-primary btn-sm" id="newSt" type="button">＋ Create a store for a seller</button></p><div class="mk-bar"><select id="fSt">' + ["", "pending", "approved", "suspended", "rejected"].map(function (s) { return '<option value="' + s + '"' + (filt.st === s ? " selected" : "") + ">" + (s || "All") + "</option>"; }).join("") + '</select><input id="fQ" type="search" placeholder="Search name, phone, city…" value="' + esc(filt.q) + '"></div><div class="mk-list">' +
        (list.length ? list.map(function (s) {
          var pl = PLANS.filter(function (x) { return x.id === s.plan_id; })[0] || {};
          return '<div class="mk-row">' + (s.logo_url ? '<img class="th" src="' + esc(s.logo_url) + '" alt="">' : '<span class="th">🏪</span>') + '<div class="mid"><b>' + esc(s.name) + (s.verified ? ' <span class="mk-verified">✔</span>' : "") + "</b><small>" + esc(s.owner_name) + " · " + esc(s.phone) + (s.whatsapp ? " / WA " + esc(s.whatsapp) : "") + " · " + esc((s.profiles || {}).email || "") + "</small><small>" + cName(s.country || "CI") + " · 📍 " + esc(s.city) + (s.address ? ", " + esc(s.address) : "") + " · " + esc(catName(catById(s.category_id))) + " · /" + esc(s.slug) + "</small><small>Plan: <b>" + esc(pl.name || s.plan_id) + "</b>" + (s.custom_product_limit ? " ★ " + (s.custom_product_limit >= 100000 ? "unlimited" : s.custom_product_limit) + " products" : "") + (s.custom_image_limit ? " · " + s.custom_image_limit + " photos" : "") + (s.plan_expires_at ? " until " + dateFmt(s.plan_expires_at) : "") + " · " + pcount(s.id) + " products · joined " + dateFmt(s.created_at) + "</small>" + (s.admin_note ? '<small style="color:#8b2a22">Note: ' + esc(s.admin_note) + "</small>" : "") + "</div>" + stLabel(s.status) +
            '<div class="acts">' + (s.status !== "approved" ? '<button class="mk-btn ok" data-a="approve" data-id="' + s.id + '">Approve</button>' : "") + (s.status === "pending" ? '<button class="mk-btn no" data-a="reject" data-id="' + s.id + '">Reject</button>' : "") + (s.status === "approved" ? '<button class="mk-btn no" data-a="suspend" data-id="' + s.id + '">Suspend</button>' : "") +
            '<button class="mk-btn" data-a="verify" data-id="' + s.id + '">' + (s.verified ? "Unverify" : "Verify ✔") + '</button><button class="mk-btn gold" data-a="plan" data-id="' + s.id + '">Plan</button><a class="mk-btn" target="_blank" href="/' + esc(s.slug) + '">View</a><a class="mk-btn dark" href="/sell.html?store=' + s.id + '">Manage</a><button class="mk-btn" data-a="owner" data-id="' + s.id + '">Give to seller</button><a class="mk-btn" target="_blank" rel="noopener" href="' + wa(s.whatsapp || s.phone, "AL MANARAH GLOBAL SERVICES — " + s.name) + '">WA</a><button class="mk-btn no" data-a="delete" data-id="' + s.id + '">Delete</button></div></div>';
        }).join("") : emptyBox("🏪", "No stores")) + "</div>";
      $("#fSt").onchange = function () { filt.st = this.value; aStores(); };
      $("#newSt").onclick = function () { adminStoreModal(); };
      $("#fQ").oninput = function () { filt.q = this.value.toLowerCase(); var p = this.selectionStart; aStores(); var i = $("#fQ"); i.focus(); i.setSelectionRange(p, p); };
      $$("[data-a]", B()).forEach(function (b) {
        b.addEventListener("click", function () {
          var id = b.dataset.id, s = D2.stores.filter(function (x) { return x.id === id; })[0], q = sb.from("stores");
          if (b.dataset.a === "approve") act(q.update({ status: "approved", admin_note: null }).eq("id", id));
          if (b.dataset.a === "reject") { var n = prompt("Reason (shown to the seller):"); if (n !== null) act(q.update({ status: "rejected", admin_note: n }).eq("id", id)); }
          if (b.dataset.a === "suspend") { var n2 = prompt("Reason for suspension (shown to the seller):"); if (n2 !== null) act(q.update({ status: "suspended", admin_note: n2 }).eq("id", id)); }
          if (b.dataset.a === "verify") act(q.update({ verified: !s.verified }).eq("id", id));
          if (b.dataset.a === "delete" && confirm("Delete the store \"" + s.name + "\" and ALL its products permanently? This cannot be undone.")) act(q.delete().eq("id", id));
          if (b.dataset.a === "plan") planModal(s);
          if (b.dataset.a === "owner") {
            var em = prompt("Seller's email (the seller must first create an account on /sell):"); if (!em) return;
            sb.from("profiles").select("id,email").ilike("email", em.trim()).maybeSingle().then(function (r) { if (!r.data) return alert("No account with this email yet. Ask the seller to create an account on /sell first."); act(sb.from("stores").update({ owner_id: r.data.id }).eq("id", id)); alert("Done. The store now belongs to " + r.data.email + "."); });
          }
        });
      });
    }
    async function adminStoreModal() {
      var m = document.createElement("div"); m.className = "mk-modal"; var u = await user();
      m.innerHTML = '<div class="box"><button class="x" type="button">✕</button><h3 style="margin-top:0">Create a store for a seller</h3><p class="mk-small">You manage it yourself (add products with “Manage”). Later, use “Give to seller” to hand it to the seller’s own account.</p>' + storeForm({}, null).replace('<div class="full"><label style="display:flex;gap:8px;align-items:flex-start;font-weight:600"><input type="checkbox" name="agree"', '<div class="full mk-hide"><label><input type="checkbox" name="agree" checked') + "</div>";
      document.body.appendChild(m); $(".x", m).onclick = function () { m.remove(); };
      var draft = { logo: "", cover: "" };
      wireStoreForm(draft, {}, u, async function (row) { row.status = "approved"; row.owner_id = u.id; var r = await sb.from("stores").insert(row).select().single(); if (r.error) return r.error; m.remove(); await load(); shell(); });
    }
    function planModal(s) {
      var m = document.createElement("div"); m.className = "mk-modal";
      m.innerHTML = '<div class="box"><button class="x" type="button">✕</button><h3 style="margin-top:0">Plan — ' + esc(s.name) + '</h3><form class="mk-form" id="plF"><div><label>Plan</label><select name="p">' + PLANS.map(function (x) { return '<option value="' + x.id + '"' + (x.id === s.plan_id ? " selected" : "") + ">" + esc(x.name) + " (" + x.product_limit + ")</option>"; }).join("") + '</select></div><div><label>Expires on (empty = never ends)</label><input type="date" name="d" value="' + (s.plan_expires_at ? s.plan_expires_at.slice(0, 10) : "") + '"></div>' +
        '<div class="full" style="margin-top:6px"><b>Special plan for this store</b><div class="hint">Leave empty to use the normal plan limits.</div></div>' +
        '<div><label>Max products</label><input type="number" min="1" name="cp" value="' + (s.custom_product_limit && s.custom_product_limit < 100000 ? s.custom_product_limit : "") + '"><label style="display:flex;gap:6px;align-items:center;font-weight:600;margin-top:6px"><input type="checkbox" name="cpu" style="width:auto"' + (s.custom_product_limit >= 100000 ? " checked" : "") + '> Unlimited</label></div>' +
        '<div><label>Max photos per product</label><input type="number" min="1" max="30" name="ci" value="' + (s.custom_image_limit || "") + '" placeholder="6"></div>' +
        '<div class="full"><button class="btn btn-primary btn-sm">Save</button></div></form></div>';
      document.body.appendChild(m); $(".x", m).onclick = function () { m.remove(); };
      $("#plF", m).onsubmit = function (e) { e.preventDefault(); var f = e.target; m.remove(); act(sb.from("stores").update({ plan_id: f.p.value, plan_expires_at: f.d.value ? new Date(f.d.value + "T23:59:59").toISOString() : null, custom_product_limit: f.cpu.checked ? 100000 : (+f.cp.value || null), custom_image_limit: +f.ci.value || null }).eq("id", s.id)); };
    }

    function aProducts() {
      var list = D2.products.filter(function (p) { return (!filt.pr || p.status === filt.pr) && (!filt.q || (p.title + " " + ((p.stores || {}).name || "")).toLowerCase().indexOf(filt.q) > -1); });
      var now = new Date().toISOString();
      B().innerHTML = '<div class="mk-bar"><select id="fPr">' + ["pending", "approved", "rejected", "hidden", ""].map(function (s) { return '<option value="' + s + '"' + (filt.pr === s ? " selected" : "") + ">" + (s || "All") + "</option>"; }).join("") + '</select><input id="fQ2" type="search" placeholder="Search product or store…" value="' + esc(filt.q) + '">' + (filt.pr === "pending" && list.length ? '<button class="mk-btn ok" id="apAll">Approve all shown</button>' : "") + '</div><div class="mk-list">' +
        (list.length ? list.slice(0, 300).map(function (p) {
          return '<div class="mk-row">' + ((p.images || [])[0] ? '<a href="/product.html?id=' + p.id + '" target="_blank"><img class="th" src="' + esc(p.images[0]) + '" alt=""></a>' : '<span class="th">🛍️</span>') + '<div class="mid"><b>' + esc(p.title) + "</b><small>" + money(p.price, p.currency === "NGN" ? "NGN" : curOf((p.stores || {}).country)) + " · " + esc(catName(catById(p.category_id))) + " · " + (p.images || []).length + " photo(s)</small><small>🏪 " + esc((p.stores || {}).name || "") + " · " + dateFmt(p.updated_at) + (p.featured_until > now ? " · ⭐ featured until " + dateFmt(p.featured_until) : "") + "</small>" + (p.description ? '<small>' + esc(p.description.slice(0, 160)) + "</small>" : "") + (p.admin_note ? '<small style="color:#8b2a22">Note: ' + esc(p.admin_note) + "</small>" : "") + "</div>" + stLabel(p.status) +
            '<div class="acts">' + (p.status !== "approved" ? '<button class="mk-btn ok" data-a="ok" data-id="' + p.id + '">Approve</button>' : "") + (p.status !== "rejected" ? '<button class="mk-btn no" data-a="no" data-id="' + p.id + '">Reject</button>' : "") + (p.status === "approved" ? '<button class="mk-btn" data-a="hide" data-id="' + p.id + '">Hide</button>' : "") +
            (p.featured_until > now ? '<button class="mk-btn" data-a="unfeat" data-id="' + p.id + '">Unfeature</button>' : '<button class="mk-btn gold" data-a="feat" data-id="' + p.id + '">Feature</button>') + '<a class="mk-btn" target="_blank" href="/product.html?id=' + p.id + '">View</a><button class="mk-btn no" data-a="del" data-id="' + p.id + '">Delete</button></div></div>';
        }).join("") : emptyBox("📦", "Nothing here")) + "</div>";
      $("#fPr").onchange = function () { filt.pr = this.value; aProducts(); };
      $("#fQ2").oninput = function () { filt.q = this.value.toLowerCase(); var p = this.selectionStart; aProducts(); var i = $("#fQ2"); i.focus(); i.setSelectionRange(p, p); };
      var all = $("#apAll"); if (all) all.onclick = function () { if (confirm("Approve " + list.length + " products?")) act(sb.from("products").update({ status: "approved", admin_note: null }).in("id", list.map(function (p) { return p.id; }))); };
      $$("[data-a]", B()).forEach(function (b) {
        b.addEventListener("click", function () {
          var id = b.dataset.id, q = sb.from("products");
          if (b.dataset.a === "ok") act(q.update({ status: "approved", admin_note: null }).eq("id", id));
          if (b.dataset.a === "no") { var n = prompt("Reason (shown to the seller):"); if (n !== null) act(q.update({ status: "rejected", admin_note: n }).eq("id", id)); }
          if (b.dataset.a === "hide") act(q.update({ status: "hidden" }).eq("id", id));
          if (b.dataset.a === "feat") { var d = prompt("Feature for how many days?", "7"); if (d) act(q.update({ featured_until: new Date(Date.now() + (+d || 7) * 864e5).toISOString() }).eq("id", id)); }
          if (b.dataset.a === "unfeat") act(q.update({ featured_until: null }).eq("id", id));
          if (b.dataset.a === "del" && confirm("Delete this product permanently?")) act(q.delete().eq("id", id));
        });
      });
    }

    function aPromos() {
      B().innerHTML = '<div class="mk-list">' + (D2.promos.length ? D2.promos.map(function (x) {
        return '<div class="mk-row"><div class="mid"><b>' + esc(x.title) + " · -" + x.discount_percent + "%</b><small>🏪 " + esc((x.stores || {}).name || "") + " · " + (x.products ? esc(x.products.title) : "whole store") + " · " + dateFmt(x.starts_at) + (x.ends_at ? " → " + dateFmt(x.ends_at) : "") + "</small></div>" + stLabel(x.status) +
          '<div class="acts">' + (x.status !== "approved" ? '<button class="mk-btn ok" data-a="ok" data-id="' + x.id + '">Approve</button>' : "") + (x.status !== "rejected" ? '<button class="mk-btn no" data-a="no" data-id="' + x.id + '">Reject</button>' : "") + '<button class="mk-btn no" data-a="del" data-id="' + x.id + '">Delete</button></div></div>';
      }).join("") : emptyBox("🏷️", "No promotions")) + "</div>";
      $$("[data-a]", B()).forEach(function (b) { b.addEventListener("click", function () { var id = b.dataset.id, q = sb.from("promotions"); if (b.dataset.a === "ok") act(q.update({ status: "approved", admin_note: null }).eq("id", id)); if (b.dataset.a === "no") { var n = prompt("Reason:"); if (n !== null) act(q.update({ status: "rejected", admin_note: n }).eq("id", id)); } if (b.dataset.a === "del" && confirm("Delete?")) act(q.delete().eq("id", id)); }); });
    }

    function aPay() {
      B().innerHTML = '<div class="mk-list">' + (D2.preqs.length ? D2.preqs.map(function (r) {
        var pl = PLANS.filter(function (x) { return x.id === r.plan_id; })[0] || {};
        return '<div class="mk-row">' + (r.receipt_url ? '<a href="' + esc(r.receipt_url) + '" target="_blank"><img class="th" src="' + esc(r.receipt_url) + '" alt="receipt"></a>' : '<span class="th">🧾</span>') + '<div class="mid"><b>' + esc((r.stores || {}).name || "") + " → " + esc(pl.name || r.plan_id) + " × " + r.months + " month(s)</b><small>Expected: <b>" + ((r.stores || {}).country === "NG" ? money((pl.price_ngn || 0) * r.months, "NGN") : money((pl.price_xof || 0) * r.months)) + "</b> · " + esc(r.payment_method || "") + " · Ref: " + esc(r.payment_ref || "—") + " · " + dateFmt(r.created_at) + "</small></div>" + stLabel(r.status) +
          (r.status === "pending" ? '<div class="acts"><button class="mk-btn ok" data-a="ok" data-id="' + r.id + '">Confirm payment</button><button class="mk-btn no" data-a="no" data-id="' + r.id + '">Reject</button></div>' : "") + "</div>";
      }).join("") : emptyBox("🧾", "No payment requests")) + "</div>";
      $$("[data-a]", B()).forEach(function (b) { b.addEventListener("click", function () { var id = b.dataset.id, q = sb.from("plan_requests"); if (b.dataset.a === "ok" && confirm("Payment received? The plan will be activated.")) act(q.update({ status: "approved" }).eq("id", id)); if (b.dataset.a === "no") { var n = prompt("Reason:"); if (n !== null) act(q.update({ status: "rejected", admin_note: n }).eq("id", id)); } }); });
    }

    function aReviews() {
      B().innerHTML = '<div class="mk-list">' + (D2.reviews.length ? D2.reviews.map(function (r) {
        return '<div class="mk-row"><div class="mid"><b>' + stars(r.rating) + " " + esc(r.name) + "</b><small>🏪 " + esc((r.stores || {}).name || "") + " · " + dateFmt(r.created_at) + "</small>" + (r.comment ? "<small>💬 " + esc(r.comment) + "</small>" : "") + "</div>" + stLabel(r.status) +
          '<div class="acts">' + (r.status !== "approved" ? '<button class="mk-btn ok" data-a="ok" data-id="' + r.id + '">Approve</button>' : "") + (r.status !== "rejected" ? '<button class="mk-btn no" data-a="no" data-id="' + r.id + '">Reject</button>' : "") + '<button class="mk-btn no" data-a="del" data-id="' + r.id + '">Delete</button></div></div>';
      }).join("") : emptyBox("⭐", "No reviews")) + "</div>";
      $$("[data-a]", B()).forEach(function (b) { b.addEventListener("click", function () { var q = sb.from("reviews"), id = b.dataset.id; if (b.dataset.a === "ok") act(q.update({ status: "approved" }).eq("id", id)); if (b.dataset.a === "no") act(q.update({ status: "rejected" }).eq("id", id)); if (b.dataset.a === "del" && confirm("Delete this review?")) act(q.delete().eq("id", id)); }); });
    }
    function aReports() {
      B().innerHTML = '<div class="mk-list">' + (D2.reports.length ? D2.reports.map(function (r) {
        return '<div class="mk-row"><div class="mid"><b>⚑ ' + esc(t(r.reason) || r.reason) + "</b><small>🏪 " + esc((r.stores || {}).name || "") + (r.products ? " · 📦 " + esc(r.products.title) : "") + " · " + dateFmt(r.created_at) + "</small>" + (r.details ? "<small>" + esc(r.details) + "</small>" : "") + (r.contact ? "<small>📞 " + esc(r.contact) + "</small>" : "") + '</div><span class="mk-status ' + (r.status === "open" ? "s-pending" : "s-approved") + '">' + esc(r.status) + "</span>" +
          '<div class="acts">' + (r.product_id ? '<a class="mk-btn" target="_blank" href="/product.html?id=' + r.product_id + '">View product</a>' : "") + (r.stores ? '<a class="mk-btn" target="_blank" href="/' + esc(r.stores.slug) + '">View store</a>' : "") + (r.status === "open" ? '<button class="mk-btn ok" data-id="' + r.id + '">Mark handled</button>' : "") + "</div></div>";
      }).join("") : emptyBox("⚑", "No reports")) + "</div>";
      $$("button[data-id]", B()).forEach(function (b) { b.addEventListener("click", function () { act(sb.from("reports").update({ status: "closed" }).eq("id", b.dataset.id)); }); });
    }
    function aMsgs() {
      var SUBJ = { question: "General question", open_store: "Open a store", plan: "Plan / payment", ads: "Advertising", problem: "Problem", other: "Other" };
      B().innerHTML = '<div class="mk-list">' + (D2.msgs.length ? D2.msgs.map(function (r) {
        return '<div class="mk-row"><div class="mid"><b>✉ ' + esc(r.name) + " — " + esc(SUBJ[r.subject] || r.subject) + "</b><small>" + (r.country ? cName(r.country) + " · " : "") + dateFmt(r.created_at) + "</small><small style=\"white-space:pre-wrap;color:var(--ink)\">" + esc(r.message) + "</small>" + (r.phone ? "<small>📞 " + esc(r.phone) + "</small>" : "") + (r.email ? "<small>✉ " + esc(r.email) + "</small>" : "") + "</div>" +
          '<div class="acts">' + (r.phone && wa(r.phone) ? '<a class="mk-btn" target="_blank" rel="noopener" href="' + wa(r.phone, "AL MANARAH GLOBAL SERVICES — ") + '">WhatsApp</a>' : "") + (r.email ? '<a class="mk-btn" href="mailto:' + esc(r.email) + '">E-mail</a>' : "") + (r.status === "open" ? '<button class="mk-btn ok" data-mid="' + r.id + '">Mark handled</button>' : '<span class="mk-small">✓ handled</span>') + '<button class="mk-btn no" data-mdel="' + r.id + '">Delete</button></div></div>';
      }).join("") : emptyBox("✉", "No messages")) + "</div>";
      $$("[data-mid]", B()).forEach(function (b) { b.addEventListener("click", function () { act(sb.from("messages").update({ status: "closed" }).eq("id", b.dataset.mid)); }); });
      $$("[data-mdel]", B()).forEach(function (b) { b.addEventListener("click", function () { if (confirm("Delete this message?")) act(sb.from("messages").delete().eq("id", b.dataset.mdel)); }); });
    }
    function aBanners() {
      var img = "";
      B().innerHTML = '<p class="mk-small">Banners rotate at the top of the home page. Use wide images (about 1500 × 500). You can sell banner space to sellers.</p><div class="mk-list">' + D2.banners.map(function (b) {
        return '<div class="mk-row"><img class="th" style="width:150px" src="' + esc(b.image_url) + '" alt=""><div class="mid"><b>' + esc(b.title || "—") + "</b><small>" + esc(b.link || "") + " · order " + b.sort_order + (b.ends_at ? " · until " + dateFmt(b.ends_at) : "") + "</small></div>" + '<span class="mk-status ' + (b.active ? "s-approved" : "s-hidden") + '">' + (b.active ? "on" : "off") + '</span><div class="acts"><button class="mk-btn" data-t="' + b.id + '">' + (b.active ? "Turn off" : "Turn on") + '</button><button class="mk-btn no" data-d="' + b.id + '">Delete</button></div></div>';
      }).join("") + '</div><div class="mk-panel" style="margin-top:20px"><h3 style="margin-top:0">Add a banner</h3><form class="mk-form" id="bnF"><div class="full"><label>Image *</label><div class="mk-imgs" id="bnImg"></div></div><div><label>Title (optional)</label><input name="ti" maxlength="80"></div><div><label>Link (optional, e.g. /store-name)</label><input name="li" maxlength="200"></div><div><label>Order</label><input name="o" type="number" value="' + (D2.banners.length + 1) + '"></div><div><label>Show until (optional)</label><input name="e" type="date"></div><div class="full"><button class="btn btn-primary btn-sm">Add</button><div id="bnM"></div></div></form></div>';
      function im() { var b = $("#bnImg"); b.innerHTML = img ? '<div class="im" style="width:200px"><img src="' + esc(img) + '" alt=""><button type="button">✕</button></div>' : '<label class="add">＋<input type="file" accept="image/*" hidden></label>'; var x = $("button", b); if (x) x.onclick = function () { img = ""; im(); }; var i = $("input", b); if (i) i.onchange = async function () { b.innerHTML = '<div class="add">…</div>'; try { img = await upload(i.files[0], "b"); } catch (e) { alert(e.message); } im(); }; }
      im();
      $("#bnF").onsubmit = function (e) { e.preventDefault(); var f = e.target; if (!img) return msg($("#bnM"), "err", "Choose an image."); act(sb.from("banners").insert({ image_url: img, title: f.ti.value.trim() || null, link: f.li.value.trim() || null, sort_order: +f.o.value || 0, ends_at: f.e.value ? new Date(f.e.value + "T23:59:59").toISOString() : null })); };
      $$("[data-t]", B()).forEach(function (b) { b.onclick = function () { var x = D2.banners.filter(function (y) { return y.id === b.dataset.t; })[0]; act(sb.from("banners").update({ active: !x.active }).eq("id", x.id)); }; });
      $$("[data-d]", B()).forEach(function (b) { b.onclick = function () { if (confirm("Delete this banner?")) act(sb.from("banners").delete().eq("id", b.dataset.d)); }; });
    }

    function aOrders() {
      B().innerHTML = '<p class="mk-small">Read-only. These requests are handled by each seller.</p><table class="mk-table"><thead><tr><th>Ref</th><th>Store</th><th>Product</th><th>Customer</th><th>Status</th><th>Date</th></tr></thead><tbody>' +
        D2.orders.map(function (o) { return "<tr><td>" + esc(o.ref) + "</td><td>" + esc((o.stores || {}).name || "") + "</td><td>" + esc(o.product_title || "") + "</td><td>" + esc(o.customer_name) + "<br><span class=\"mk-small\">" + esc(o.customer_phone) + "</span></td><td>" + stLabel(o.status) + "</td><td>" + dateFmt(o.created_at) + "</td></tr>"; }).join("") + "</tbody></table>";
    }

    async function aCats() {
      var r = await sb.from("categories").select("*").order("sort_order"); CATS = r.data || CATS;
      B().innerHTML = '<table class="mk-table"><thead><tr><th>Icon</th><th>English</th><th>Français</th><th>العربية</th><th>Order</th><th>Active</th><th></th></tr></thead><tbody>' + CATS.map(function (c) {
        return '<tr data-id="' + c.id + '"><td><input value="' + esc(c.icon || "") + '" data-f="icon" style="width:56px"></td><td><input value="' + esc(c.name_en) + '" data-f="name_en"></td><td><input value="' + esc(c.name_fr) + '" data-f="name_fr"></td><td><input value="' + esc(c.name_ar) + '" data-f="name_ar" dir="rtl"></td><td><input type="number" value="' + c.sort_order + '" data-f="sort_order" style="width:64px"></td><td><input type="checkbox" data-f="active"' + (c.active ? " checked" : "") + '></td><td><button class="mk-btn ok" data-save>Save</button></td></tr>';
      }).join("") + '</tbody></table><h3 style="margin-top:26px">Add a category</h3><form class="mk-form" id="cF"><div><label>Icon (emoji)</label><input name="icon" maxlength="4"></div><div><label>Link name (e.g. home-kitchen)</label><input name="slug" required pattern="[a-z0-9-]+"></div><div><label>English</label><input name="en" required></div><div><label>Français</label><input name="fr" required></div><div><label>العربية</label><input name="ar" required dir="rtl"></div><div><label>Order</label><input name="o" type="number" value="' + (CATS.length + 1) + '"></div><div class="full"><button class="btn btn-primary btn-sm">Add</button></div></form>';
      $$("[data-save]", B()).forEach(function (b) { b.onclick = function () { var tr = b.closest("tr"), row = {}; $$("[data-f]", tr).forEach(function (i) { row[i.dataset.f] = i.type === "checkbox" ? i.checked : i.type === "number" ? +i.value : i.value; }); act(sb.from("categories").update(row).eq("id", +tr.dataset.id)); CATS = null; }; });
      $("#cF").onsubmit = function (e) { e.preventDefault(); var f = e.target; CATS = null; act(sb.from("categories").insert({ icon: f.icon.value, slug: f.slug.value, name_en: f.en.value, name_fr: f.fr.value, name_ar: f.ar.value, sort_order: +f.o.value })).then(cats); };
    }

    function aPlans() {
      B().innerHTML = '<table class="mk-table"><thead><tr><th>Plan</th><th>Name</th><th>Max products</th><th>Price / month (FCFA)</th><th>Price / month (₦ Nigeria)</th><th>Active</th><th></th></tr></thead><tbody>' + PLANS.map(function (x) {
        return '<tr data-id="' + x.id + '"><td>' + esc(x.id) + '</td><td><input value="' + esc(x.name) + '" data-f="name"></td><td><input type="number" value="' + x.product_limit + '" data-f="product_limit" style="width:100px"></td><td><input type="number" value="' + x.price_xof + '" data-f="price_xof" style="width:120px"></td><td><input type="number" value="' + (x.price_ngn || 0) + '" data-f="price_ngn" style="width:120px"></td><td><input type="checkbox" data-f="active"' + (x.active ? " checked" : "") + '></td><td><button class="mk-btn ok" data-save>Save</button></td></tr>';
      }).join("") + "</tbody></table>";
      $$("[data-save]", B()).forEach(function (b) { b.onclick = async function () { var tr = b.closest("tr"), row = {}; $$("[data-f]", tr).forEach(function (i) { row[i.dataset.f] = i.type === "checkbox" ? i.checked : i.type === "number" ? +i.value : i.value; }); var r = await sb.from("plans").update(row).eq("id", tr.dataset.id); if (r.error) alert(r.error.message); PLANS = null; await plans(); b.textContent = "✔"; }; });
    }

    rerender = shell;
    await load(); shell();
  }

  /* ---------------- boot ---------------- */
  var page = document.body.dataset.market;
  async function pageContact() {
    var f = $("#ctForm"); if (!f) return;
    try { var cc = myCountry(); if (cc) f.country.value = cc; } catch (e) {}
    f.addEventListener("submit", async function (e) {
      e.preventDefault(); var box = $("#ctMsg"), L2 = L();
      var T = function (en, fr, ar) { return L2 === "fr" ? fr : L2 === "ar" ? ar : en; };
      if (!f.cname.value.trim() || !f.message.value.trim()) return msg(box, "err", T("Please enter your name and message.", "Indiquez votre nom et votre message.", "اكتب اسمك ورسالتك."));
      if (!f.phone.value.trim() && !f.email.value.trim()) return msg(box, "err", T("Add a phone number or an e-mail so we can reply.", "Ajoutez un téléphone ou un e-mail pour que nous puissions répondre.", "أضف رقم هاتف أو بريدًا لنرد عليك."));
      var b = f.querySelector("button[type=submit]"); b.disabled = true;
      var r = await sb.rpc("submit_message", { p_name: f.cname.value.trim(), p_phone: f.phone.value.trim() || null, p_email: f.email.value.trim() || null, p_country: f.country.value || null, p_subject: f.subject.value, p_message: f.message.value.trim() });
      b.disabled = false;
      if (r.error) return msg(box, "err", t("fail"));
      f.reset(); msg(box, "ok", T("Thank you! Your message has been sent. We will reply soon.", "Merci ! Votre message a été envoyé. Nous vous répondrons rapidement.", "شكرًا! تم إرسال رسالتك وسنرد عليك قريبًا."));
    });
  }
  var run = { contact: pageContact, home: pageHome, shop: pageShop, store: pageStore, product: pageProduct, sell: pageSell, manage: pageManage }[page];
  function go() { if (run) run().catch(function (e) { console.error(e); var b = document.querySelector("[data-mk-root]"); if (b) b.innerHTML = '<div class="mk-msg err">' + t("fail") + "</div>"; }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
