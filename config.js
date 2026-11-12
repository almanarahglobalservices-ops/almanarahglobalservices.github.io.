/* AL MANARAH — site configuration. Edit here; no build step needed.
   SECURITY: never put API keys, secret keys or passwords in this file — it is public. */
window.SITE_CONFIG = {
  whatsappMain: "2250506122337",   // +225 05 06 12 23 37 (main)
  whatsappAlt:  "2250544127112",   // +225 05 44 12 71 12
  email: "almanarahglobalservices@gmail.com",

  // CRM (Google Apps Script) — forms send enquiries here
  formEndpoint: "https://script.google.com/macros/s/AKfycbxpLogcLawjr_4SmuXgOMjzMxWCsCwNOX1sSw-1bPSHMxNTTMu52Opm853wJ9wai7ntjQ/exec",

  // Promotion shown on every page (floating card + top bar). Set on: false to hide.
  promo: {
    on: true,
    id: "dec2026",
    title: "December Umrah 2026", titleFr: "Omra de décembre 2026",
    dates: "26 Dec 2026 – 4 Jan 2027", datesFr: "26 déc. 2026 – 4 janv. 2027",
    from: "Departing from Côte d'Ivoire", fromFr: "Départ de Côte d’Ivoire",
    price: 1650000, currency: "FCFA",
    departure: "2026-12-26"          // the offer disappears automatically on this date
  },

  turnstileSiteKey: ""
};
