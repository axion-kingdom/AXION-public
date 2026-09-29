import { describe, expect, it } from "vitest";
import { createWellSchema } from "./well.schema.js";

describe("createWellSchema", () => {
  it("rejects an empty project id", () => {
    const parsed = createWellSchema.safeParse({
      project_id: "",
      wellNumber: 1,
      ownerName: "Public Example",
    });
    expect(parsed.success).toBe(false);
  });
});
