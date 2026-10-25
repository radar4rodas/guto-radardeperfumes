import { PIXEL_ID, advertisingPermittedNow } from "./meta-pixel";
import { countMetric } from "./metrics";
export { PIXEL_ID } from "./meta-pixel";
export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/GcNVB35EeMFGNIf8VlYAQV";

// Deduplicate the Lead per browser for this Pixel and WhatsApp group.
const LEAD_STORAGE_KEY = `radar:meta-lead:${PIXEL_ID}:perfumes-vip`;
let sentThisSession = false;

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/** Sends Lead synchronously on click (before the WhatsApp tab opens); never blocks or throws. */
export function trackLeadOnce(): void {
  try {
    if (!advertisingPermittedNow()) return;
    if (sentThisSession) return;
    try {
      if (window.localStorage.getItem(LEAD_STORAGE_KEY) === "sent") {
        sentThisSession = true;
        return;
      }
    } catch {
      // Storage can be unavailable; still prevent repeats during this page session.
    }
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (typeof fbq !== "function") return;
    sentThisSession = true;
    fbq(
      "trackSingle",
      PIXEL_ID,
      "Lead",
      { content_name: "Grupo VIP - Perfumes Masculinos", content_category: "Perfumes" },
      { eventID: newId() },
    );
    try { window.localStorage.setItem(LEAD_STORAGE_KEY, "sent"); } catch { /* storage unavailable */ }
    countMetric("meta_lead");
  } catch {
    /* tracking must never block access */
  }
}

export function __resetLeadForTests() {
  sentThisSession = false;
}
