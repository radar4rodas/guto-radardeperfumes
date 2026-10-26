import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PIXEL_ID, PIXEL_SNIPPET } from "./meta-pixel";

type PixelTestWindow = Window & {
  __radarPixelStarted?: boolean;
  __radarMetaPvPending?: boolean;
  fbq?: { queue?: unknown[][] };
  _fbq?: unknown;
};

describe("Meta Pixel initialization", () => {
  let anchor: HTMLScriptElement;

  beforeEach(() => {
    anchor = document.createElement("script");
    document.head.appendChild(anchor);
    const w = window as PixelTestWindow;
    delete w.__radarPixelStarted;
    delete w.__radarMetaPvPending;
    delete w.fbq;
    delete w._fbq;
  });

  afterEach(() => {
    const w = window as PixelTestWindow;
    delete w.__radarPixelStarted;
    delete w.__radarMetaPvPending;
    delete w.fbq;
    delete w._fbq;
    document
      .querySelectorAll('script[src="https://connect.facebook.net/en_US/fbevents.js"]')
      .forEach((script) => script.remove());
    anchor.remove();
  });

  it("initializes the requested Pixel and queues PageView only once per document", () => {
    new Function(PIXEL_SNIPPET)();
    new Function(PIXEL_SNIPPET)(); // A second render must not duplicate events.

    const w = window as PixelTestWindow;
    expect(PIXEL_ID).toBe("2485910075234563");
    expect(w.__radarPixelStarted).toBe(true);
    expect(w.__radarMetaPvPending).toBe(true);
    expect(w.fbq?.queue).toEqual([
      ["init", PIXEL_ID],
      ["track", "PageView"],
    ]);
    expect(
      document.querySelectorAll('script[src="https://connect.facebook.net/en_US/fbevents.js"]'),
    ).toHaveLength(1);
  });
});
