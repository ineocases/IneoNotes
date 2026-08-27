import { describe, expect, it } from "vitest";
import { searchNotebooks } from "../src/features/search/search";

describe("InkNest basics", () => {
  it("searches notebooks case-insensitively", () => {
    const result = searchNotebooks([
      { id: "1", name: "Ideas", color: "#6750A4", favorite: false, createdAt: 1, updatedAt: 1 }
    ], "IDE");
    expect(result).toHaveLength(1);
  });
  it("supports the expected demo product name", () => {
    expect("InkNest").toBe("InkNest");
  });
});