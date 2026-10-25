import { describe, expect, it } from "vitest";
import { summarize } from "@/lib/report-math";

describe("report totals", () => {
  it("sums days and computes clicks / visits conversion", () => {
    const s = summarize([
      { day: "2026-10-23", metric: "page_view", count: 150 },
      { day: "2026-10-24", metric: "page_view", count: 50 },
      { day: "2026-10-24", metric: "whatsapp_click", count: 30 },
      { day: "2026-10-24", metric: "meta_lead", count: 12 },
    ]);
    expect(s.visits).toBe(200);
    expect(s.clicks).toBe(30);
    expect(s.conversion).toBe(15);
    expect(s.metaLeads).toBe(12);
  });
  it("conversion is 0 with no visits", () => {
    expect(summarize([]).conversion).toBe(0);
  });
});
