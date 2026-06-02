import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CompareProvider } from "./CompareContext";
import { useCompare } from "./compareStore";
import type { Product } from "../types/Product";

const product: Product = {
  id: 1,
  title: "Notebook Pro",
  description: "High performance notebook",
  category: "notebooks",
  price: 4999,
  rating: 4.8,
  stock: 7,
  thumbnail: "notebook.png",
  images: ["notebook.png"],
};

function CompareProbe() {
  const {
    selectedProducts,
    addProduct,
    removeProduct,
    clearProducts,
  } = useCompare();

  return (
    <>
      <span>Selecionados: {selectedProducts.length}</span>
      <button onClick={() => addProduct(product)}>Adicionar</button>
      <button onClick={() => removeProduct(product.id)}>Remover</button>
      <button onClick={clearProducts}>Limpar</button>
    </>
  );
}

describe("CompareProvider", () => {
  it("adds products without duplicates and supports remove and clear", async () => {
    const user = userEvent.setup();

    render(
      <CompareProvider>
        <CompareProbe />
      </CompareProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(screen.getByText("Selecionados: 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remover" }));
    expect(screen.getByText("Selecionados: 0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.click(screen.getByRole("button", { name: "Limpar" }));
    expect(screen.getByText("Selecionados: 0")).toBeInTheDocument();
  });
});
