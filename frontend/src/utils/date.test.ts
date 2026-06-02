import { describe, expect, it } from "vitest";

import { formatDate } from "./date";

describe("formatDate", () => {
  it("formats ISO dates for pt-BR without timezone shifts", () => {
    expect(formatDate("2026-06-01")).toBe("01/06/2026");
  });
});
