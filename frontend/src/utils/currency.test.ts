import { describe, expect, it } from "vitest";

import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("formats BRL values for pt-BR", () => {
    expect(formatCurrency(4999.9)).toBe("R$\u00a04.999,90");
  });
});
