import { describe, it, expect } from "vitest";
import { cn } from "./utils.js";

describe("حي الواجهة المركزي — cn", () => {
  it("يدمج الفئات ويكتب الالتعادات", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("a", "b")).toBe("a b");
  });
});
