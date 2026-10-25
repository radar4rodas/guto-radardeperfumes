import { beforeEach, describe, expect, it, vi } from "vitest";
import { PIXEL_ID, PIXEL_SNIPPET, permitsAdvertising } from "@/lib/meta-pixel";
vi.mock("@/lib/metrics", () => ({ countMetric: vi.fn() }));

describe("Radar Pixel rules", () => {
  beforeEach(() => { vi.resetModules(); localStorage.clear(); });

  it("uses only the requested Pixel", () => {
    expect(PIXEL_ID).toBe("1104208202495234");
    expect(PIXEL_SNIPPET).toContain("fbq('init','1104208202495234'");
    expect(PIXEL_SNIPPET).not.toContain("1576330420624489");
  });

  it("Brazil measures only after Aceitar; silence or Recusar never loads the Pixel", () => {
    expect(permitsAdvertising("BR")).toBe(false);
    expect(permitsAdvertising("BR", "denied")).toBe(false);
    expect(permitsAdvertising("BR", "granted")).toBe(true);
    expect(permitsAdvertising("XX")).toBe(false);
    expect(permitsAdvertising("")).toBe(false);
    expect(permitsAdvertising("US")).toBe(true);
    expect(permitsAdvertising("US", "denied")).toBe(false);
    expect(permitsAdvertising("BR", "granted", true)).toBe(false);
  });

  it("sends Lead with trackSingle to the correct Pixel, ignores double-clicks, no permanent block", async () => {
    vi.useFakeTimers();
    const fbq = vi.fn();
    Object.assign(window, { fbq, __radarAdvertisingAllowed: true });
    const { trackLeadOnce, WHATSAPP_GROUP_URL } = await import("@/lib/meta-lead");
    expect(fbq).not.toHaveBeenCalled();
    expect(WHATSAPP_GROUP_URL).toBe("https://chat.whatsapp.com/GcNVB35EeMFGNIf8VlYAQV");
    trackLeadOnce(); trackLeadOnce(); trackLeadOnce();
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq.mock.calls[0]?.slice(0, 3)).toEqual(["trackSingle", "1104208202495234", "Lead"]);
    vi.advanceTimersByTime(2000);
    trackLeadOnce();
    expect(fbq).toHaveBeenCalledTimes(2);
    expect(localStorage.length).toBe(0);
    vi.useRealTimers();
  });

  it("does not send or replay a click blocked by regional permission", async () => {
    const fbq = vi.fn();
    Object.assign(window, { fbq, __radarAdvertisingAllowed: false });
    const { trackLeadOnce } = await import("@/lib/meta-lead");
    trackLeadOnce();
    Object.assign(window, { __radarAdvertisingAllowed: true });
    expect(fbq).not.toHaveBeenCalled();
  });
});