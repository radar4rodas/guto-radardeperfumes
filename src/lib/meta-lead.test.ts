import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./metrics", () => ({
  countMetric: vi.fn(),
}));

import { countMetric } from "./metrics";
import { __resetLeadForTests, PIXEL_ID, trackLeadOnce } from "./meta-lead";

const storageKey = `radar:meta-lead:${PIXEL_ID}:perfumes-vip`;
type PixelWindow = Window & { fbq?: (...args: unknown[]) => void };

describe("Meta Pixel WhatsApp Lead tracking", () => {
  const fbq = vi.fn();

  beforeEach(() => {
    window.localStorage.clear();
    fbq.mockReset();
    vi.mocked(countMetric).mockClear();
    __resetLeadForTests();
    (window as PixelWindow).fbq = fbq;
  });

  afterEach(() => {
    delete (window as PixelWindow).fbq;
    window.localStorage.clear();
  });

  it("sends exactly one standard Lead to the configured Pixel, with an eventID", () => {
    trackLeadOnce();

    expect(fbq).toHaveBeenCalledTimes(1);
    const [command, pixel, eventName, eventData, options] = fbq.mock.calls[0];

    expect(command).toBe("trackSingle");
    expect(pixel).toBe("2485910075234563");
    expect(eventName).toBe("Lead");
    expect(eventData).toEqual({
      content_name: "Grupo VIP - Perfumes Masculinos",
      content_category: "Perfumes",
    });
    expect(options).toEqual({ eventID: expect.any(String) });
    expect(options.eventID.length).toBeGreaterThan(0);
    expect(window.localStorage.getItem(storageKey)).toMatch(/^sent:/);
    expect(countMetric).toHaveBeenCalledTimes(1);
    expect(countMetric).toHaveBeenCalledWith("meta_lead");
  });

  it("prevents duplicate Leads on repeated clicks and after a new page visit", () => {
    trackLeadOnce();
    trackLeadOnce();
    expect(fbq).toHaveBeenCalledTimes(1);

    __resetLeadForTests(); // Simulate a fresh browser page on the same origin
    trackLeadOnce();

    expect(fbq).toHaveBeenCalledTimes(1);
    expect(countMetric).toHaveBeenCalledTimes(1);
  });

  it("respects receipts saved by the previous implementation", () => {
    window.localStorage.setItem(storageKey, "sent");
    trackLeadOnce();
    expect(fbq).not.toHaveBeenCalled();
  });

  it("does not save a receipt when the Meta Pixel is absent", () => {
    delete (window as PixelWindow).fbq;
    trackLeadOnce();
    expect(window.localStorage.getItem(storageKey)).toBeNull();

    (window as PixelWindow).fbq = fbq;
    trackLeadOnce();
    expect(fbq).toHaveBeenCalledTimes(1);
  });

  it("rolls back the receipt when calling the Pixel throws, so a later click can retry", () => {
    fbq.mockImplementationOnce(() => {
      throw new Error("Pixel unavailable");
    });

    expect(() => trackLeadOnce()).not.toThrow();
    expect(window.localStorage.getItem(storageKey)).toBeNull();
    expect(countMetric).not.toHaveBeenCalled();

    trackLeadOnce();
    expect(fbq).toHaveBeenCalledTimes(2);
    expect(countMetric).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem(storageKey)).toMatch(/^sent:/);
  });
});
