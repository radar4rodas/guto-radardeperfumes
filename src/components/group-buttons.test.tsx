import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/lib/meta-lead", () => ({
  WHATSAPP_GROUP_URL: "https://chat.whatsapp.com/GcNVB35EeMFGNIf8VlYAQV",
  trackLeadOnce: vi.fn(),
}));
vi.mock("@/lib/metrics", () => ({
  countMetric: vi.fn(),
}));

import { GroupButtons } from "./group-buttons";
import { trackLeadOnce } from "@/lib/meta-lead";
import { countMetric } from "@/lib/metrics";

describe("VIP WhatsApp call to action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fires the Lead handler only when the real WhatsApp button is clicked", () => {
    render(<GroupButtons />);

    expect(trackLeadOnce).not.toHaveBeenCalled();
    const cta = screen.getByRole("link", { name: /ENTRAR NO GRUPO VIP/i });
    expect(cta).toHaveAttribute("href", "https://chat.whatsapp.com/GcNVB35EeMFGNIf8VlYAQV");

    fireEvent.click(cta);

    expect(trackLeadOnce).toHaveBeenCalledTimes(1);
    expect(countMetric).toHaveBeenCalledWith("whatsapp_click");
  });
});
