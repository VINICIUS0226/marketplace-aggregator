import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Compare } from ".";
import { CompareContext } from "../../contexts/compareStore";
import type { Product } from "../../types/Product";
import { useComparedProducts } from "../../hooks/useComparedProducts";

vi.mock("../../hooks/useComparedProducts");

const products: Product[] = [
  {
    id: 1,
    title: "Notebook Pro",
    description: "Notebook",
    category: "notebooks",
    price: 4999,
    rating: 4.8,
    stock: 7,
    thumbnail: "notebook.png",
    images: ["notebook.png"],
  },
  {
    id: 2,
    title: "Notebook Air",
    description: "Notebook",
    category: "notebooks",
    price: 3999,
    rating: 4.5,
    stock: 12,
    thumbnail: "notebook-air.png",
    images: ["notebook-air.png"],
  },
];

function renderCompare(selectedProducts: Product[]) {
  return render(
    <MemoryRouter>
      <CompareContext.Provider
        value={{
          selectedProducts,
          addProduct: () => undefined,
          removeProduct: () => undefined,
          clearProducts: () => undefined,
        }}
      >
        <Compare />
      </CompareContext.Provider>
    </MemoryRouter>,
  );
}

describe("Compare page", () => {
  beforeEach(() => {
    vi.mocked(useComparedProducts).mockReturnValue({
      data: products,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useComparedProducts>);
  });

  it("asks for at least two products", () => {
    renderCompare([products[0]]);

    expect(
      screen.getByText(/Select at least two products/i),
    ).toBeInTheDocument();
  });

  it("renders products side by side", () => {
    renderCompare(products);

    expect(screen.getByText("Notebook Pro")).toBeInTheDocument();
    expect(screen.getByText("Notebook Air")).toBeInTheDocument();
    expect(screen.getByText("R$ 4.999,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 3.999,00")).toBeInTheDocument();
  });

  it("renders revalidated stock returned by the API", () => {
    const staleProducts = products.map((product) => ({
      ...product,
      stock: product.stock + 100,
    }));

    renderCompare(staleProducts);

    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.queryByText("107")).not.toBeInTheDocument();
    expect(screen.queryByText("112")).not.toBeInTheDocument();
  });

  it("shows progress while loading the comparison", () => {
    vi.mocked(useComparedProducts).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useComparedProducts>);

    renderCompare(products);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("allows retrying a failed comparison", async () => {
    const refetch = vi.fn();

    vi.mocked(useComparedProducts).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useComparedProducts>);

    renderCompare(products);

    await userEvent.click(
      screen.getByRole("button", { name: /Try again/i }),
    );

    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
