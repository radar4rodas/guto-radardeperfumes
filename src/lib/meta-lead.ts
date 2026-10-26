import { PIXEL_ID } from "./meta-pixel";
import { countMetric } from "./metrics";

export { PIXEL_ID } from "./meta-pixel";
export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/GcNVB35EeMFGNIf8VlYAQV";

// One Meta Lead per browser for this Pixel and WhatsApp group, including revisits.
// The key includes the Pixel ID, so switching Pixels does not suppress new campaigns.
const LEAD_STORAGE_KEY = `radar:meta-lead:${PIXEL_ID}:perfumes-vip`;
let sentThisSession = false;
let testLeadSentThisPage = false;

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
  if (typeof window === "undefined") return;

  // Meta Events Manager testing: append ?meta_test=1 to the published LP URL.
  // This lets the owner test a previously used browser without deleting the
  // normal visitor's saved Lead receipt. Do not use this URL in live ads.
  const testMode = new URLSearchParams(window.location.search).get("meta_test") === "1";
  if (testMode ? testLeadSentThisPage : sentThisSession) return;

  if (!testMode) {
    try {
      const receipt = window.localStorage.getItem(LEAD_STORAGE_KEY);
      // "sent" is the legacy receipt format; preserve existing deduplication.
      if (receipt === "sent" || receipt?.startsWith("sent:")) {
        sentThisSession = true;
        return;
      }
    } catch {
      // Storage is optional. The in-memory flag still protects this page view.
    }
  }

  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;

  const eventID = newId();
  const receipt = `sent:${eventID}`;
  let receiptStored = false;

  // Reserve before invoking Meta; prevents repeat clicks in the same page.
  if (testMode) {
    testLeadSentThisPage = true;
  } else {
    try {
      window.localStorage.setItem(LEAD_STORAGE_KEY, receipt);
      receiptStored = true;
    } catch {
      // Private browsing or disabled storage: use the in-memory guard.
    }
    sentThisSession = true;
  }

  try {
    fbq(
      "trackSingle",
      PIXEL_ID,
      "Lead",
      { content_name: "Grupo VIP - Perfumes Masculinos", content_category: "Perfumes" },
      { eventID },
    );
  } catch {
    // If Meta's API throws, allow another click to retry.
    if (testMode) {
      testLeadSentThisPage = false;
    } else {
      sentThisSession = false;
      if (receiptStored) {
        try {
          if (window.localStorage.getItem(LEAD_STORAGE_KEY) === receipt) {
            window.localStorage.removeItem(LEAD_STORAGE_KEY);
          }
        } catch {
          // Do not interfere with WhatsApp navigation.
        }
      }
    }
    return;
  }

  // Internal aggregate counter is not an additional Meta event.
  // Keep diagnostic clicks out of this independent business metric.
  if (!testMode) countMetric("meta_lead");
}

// For isolated tests; intentionally does not clear saved receipts.
export function __resetLeadForTests(): void {
  sentThisSession = false;
  testLeadSentThisPage = false;
}
