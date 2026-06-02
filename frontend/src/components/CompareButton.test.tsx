import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { CompareButton } from "./CompareButton";
import { useCompare } from "../contexts/compareStore";
import type { Product } from "../types/Product";

vi.mock("../contexts/compareStore");

const products = [
  { id: 1, title: "One" },
  { id: 2, title: "Two" },
] as Product[];

function LocationProbe() {
  const location = useLocation();
  return <span>{location.pathname}</span>;
}

describe("CompareButton", () => {
  it("stays hidden until two products are selected", () => {
    vi.mocked(useCompare).mockReturnValue({
      selectedProducts: [products[0]],
      addProduct: vi.fn(),
      removeProduct: vi.fn(),
      clearProducts: vi.fn(),
    });

    render(
      <MemoryRouter>
        <CompareButton />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole("button", { name: /Abrir comparação/i }),
    ).not.toBeInTheDocument();
  });

  it("opens comparison and clears selection when closing it", async () => {
    const clearProducts = vi.fn();
    const user = userEvent.setup();

    vi.mocked(useCompare).mockReturnValue({
      selectedProducts: products,
      addProduct: vi.fn(),
      removeProduct: vi.fn(),
      clearProducts,
    });

    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <CompareButton />
        <LocationProbe />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /Abrir comparação/i }),
    );
    expect(screen.getByText("/compare")).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={["/compare"]}>
        <Routes>
          <Route path="*" element={<CompareButton />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /Fechar comparação/i }),
    );
    expect(clearProducts).toHaveBeenCalledTimes(1);
  });
});
