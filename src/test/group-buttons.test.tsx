import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GroupButtons } from "@/components/group-buttons";

const trackLead = vi.hoisted(() => vi.fn());
vi.mock("@/lib/metrics", () => ({ countMetric: vi.fn() }));
vi.mock("@/lib/meta-lead", () => ({
  WHATSAPP_GROUP_URL: "https://chat.whatsapp.com/test-invite",
  trackLeadOnce: trackLead,
}));

describe("Group availability", () => {
  beforeEach(() => trackLead.mockClear());

  it("allows the available group to open the invite and track the click", () => {
    render(<GroupButtons />);
    const available = screen.getByRole("link");
    expect(available.getAttribute("href")).toBe("https://chat.whatsapp.com/test-invite");
    fireEvent.click(available);
    expect(trackLead).toHaveBeenCalledTimes(1);
  });

  it("does not allow the full second group to open or track a lead", () => {
    render(<GroupButtons />);
    const full = screen.getByRole("button");
    expect(full).toBeDisabled();
    fireEvent.click(full);
    expect(trackLead).not.toHaveBeenCalled();
  });
});