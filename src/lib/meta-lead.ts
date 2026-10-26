import { PIXEL_ID } from "./meta-pixel";
import { countMetric } from "./metrics";

export { PIXEL_ID } from "./meta-pixel";
export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/GcNVB35EeMFGNIf8VlYAQV";

// One Meta Lead per browser for this Pixel and WhatsApp group, including revisits.
// The key includes the Pixel ID, so switching Pixels does not suppress new campaigns.
const LEAD_STORAGE_KEY = `radar:meta-lead:${PIXEL_ID}:perfumes-vip`;
let sentThisSession = false;

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Called only by the WhatsApp link click handler. Queue a standard Meta Lead
 * synchronously before the new WhatsApp tab opens. Never block navigation.
 *
 * A locally stored receipt prevents duplicate conversions after a refresh,
 * reopening the LP or repeated clicks. The unique eventID can also be used
 * later to deduplicate the same Lead if a Conversions API copy is implemented.
 */
export function trackLeadOnce(): void {
  if (typeof window === "undefined" || sentThisSession) return;

  try {
    const receipt = window.localStorage.getItem(LEAD_STORAGE_KEY);
    // "sent" was used by the earlier implementation. Preserve that history.
    if (receipt === "sent" || receipt?.startsWith("sent:")) {
      sentThisSession = true;
      return;
    }
  } catch {
    // Storage is optional. The in-memory flag still protects this page view.
  }

  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;

  const eventID = newId();
  const receipt = `sent:${eventID}`;
  let receiptStored = false;

  // Reserve before emitting, so rapid/reentrant clicks cannot send two Leads.
  try {
    window.localStorage.setItem(LEAD_STORAGE_KEY, receipt);
    receiptStored = true;
  } catch {
    // Private browsing or disabled storage: use the in-memory guard.
  }
  sentThisSession = true;

  try {
    fbq(
      "trackSingle",
      PIXEL_ID,
      "Lead",
      { content_name: "Grupo VIP - Perfumes Masculinos", content_category: "Perfumes" },
      { eventID },
    );
  } catch {
    // If the Pixel call throws, allow a future click to retry.
    sentThisSession = false;
    if (receiptStored) {
      try {
        if (window.localStorage.getItem(LEAD_STORAGE_KEY) === receipt) {
          window.localStorage.removeItem(LEAD_STORAGE_KEY);
        }
      } catch {
        // Tracking errors must never interfere with opening WhatsApp.
      }
    }
    return;
  }

  // Internal aggregate counter, not an additional event sent to Meta.
  countMetric("meta_lead");
}

// For isolated tests; intentionally does not clear saved receipts.
export function __resetLeadForTests(): void {
  sentThisSession = false;
}
