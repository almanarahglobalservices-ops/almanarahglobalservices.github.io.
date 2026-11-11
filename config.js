/* AL MANARAH — site configuration. Edit here; no build step needed.
   SECURITY: never put API keys, secret keys or passwords in this file — it is public. */
window.SITE_CONFIG = {
  // WhatsApp numbers in international format, digits only (no +, spaces or leading 00).
  whatsappMain: "2250506122337",   // +225 05 06 12 23 37 (main)
  whatsappAlt:  "2250556197930",   // +225 05 56 19 79 30
  email: "almanarahglobalservices@gmail.com",

  // OPTIONAL backend. Leave "" to use the safe WhatsApp / email-only flow.
  // When set, forms POST JSON to this URL and only show success if the server replies 2xx.
  // See docs/BACKEND.md for the required server-side validation, spam protection and storage.
  formEndpoint: "",

  // OPTIONAL Cloudflare Turnstile PUBLIC site key (the secret key stays on the server).
  // Only used when formEndpoint is set. The server MUST verify the token.
  turnstileSiteKey: ""
};
