// Cookieless aggregate counters: no cookies, no identifiers, no personal data — only +1 on a daily total.
import { supabase } from "@/integrations/supabase/client";

export type Metric = "page_view" | "whatsapp_click" | "meta_pageview" | "meta_lead";

export function countMetric(metric: Metric) {
  try {
    void supabase.rpc("increment_metric", { _metric: metric }).then(() => undefined, () => undefined);
  } catch {
    /* counting must never affect the page */
  }
}

/** Counts Meta PageViews dispatched by the Pixel bootstrap (which may run before React mounts). */
export function watchMetaPageView() {
  const w = window as Window & { __radarMetaPvPending?: boolean };
  const flush = () => {
    if (!w.__radarMetaPvPending) return;
    w.__radarMetaPvPending = false;
    countMetric("meta_pageview");
  };
  flush();
  window.addEventListener("radar:meta-pageview", flush);
  return () => window.removeEventListener("radar:meta-pageview", flush);
}
