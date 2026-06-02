import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { Compare } from ".";
import { CompareContext } from "../../contexts/compareStore";
import type { Product } from "../../types/Product";

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
  it("asks for at least two products", () => {
    renderCompare([products[0]]);

    expect(
      screen.getByText(/Selecione ao menos dois produtos/i),
    ).toBeInTheDocument();
  });

  it("renders products side by side", () => {
    renderCompare(products);

    expect(screen.getByText("Notebook Pro")).toBeInTheDocument();
    expect(screen.getByText("Notebook Air")).toBeInTheDocument();
    expect(screen.getByText("R$ 4.999,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 3.999,00")).toBeInTheDocument();
  });
});
