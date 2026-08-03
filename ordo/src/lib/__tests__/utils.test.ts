import { describe, expect, it } from "vitest";
import { cn, formatCompact } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toContain("px-2");
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditionals", () => {
    expect(cn("base", false && "hidden", "ok")).toBe("base ok");
  });
});

describe("formatCompact", () => {
  it("formats thousands", () => {
    const s = formatCompact(1200);
    expect(s.toLowerCase()).toMatch(/1(\.|,)?2k|1\.2k|1200/);
  });
});
