import { PIXEL_ID, advertisingPermittedNow } from "./meta-pixel";
import { countMetric } from "./metrics";
export { PIXEL_ID } from "./meta-pixel";
export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/GcNVB35EeMFGNIf8VlYAQV";

// Short window only to ignore accidental double-clicks; nothing is stored permanently.
const DOUBLE_CLICK_MS = 1500;
let lastLeadAt = 0;

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
    const now = Date.now();
    if (now - lastLeadAt < DOUBLE_CLICK_MS) return;
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (typeof fbq !== "function") return;
    lastLeadAt = now;
    fbq(
      "trackSingle",
      PIXEL_ID,
      "Lead",
      { content_name: "Grupo VIP - Perfumes Masculinos", content_category: "Perfumes" },
      { eventID: newId() },
    );
    countMetric("meta_lead");
  } catch {
    /* tracking must never block access */
  }
}

export function __resetLeadForTests() {
  lastLeadAt = 0;
}
