import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ProductCard } from "./ProductCard";
import { useCompare } from "../contexts/compareStore";
import type { Product } from "../types/Product";

vi.mock("../contexts/compareStore");

const product: Product = {
  id: 1,
  title: "Notebook Pro",
  description: "Fast notebook",
  category: "notebooks",
  price: 4999,
  rating: 4.8,
  stock: 7,
  thumbnail: "notebook.png",
  images: ["notebook.png"],
};

describe("ProductCard", () => {
  it("formats price and adds the product to comparison", async () => {
    const addProduct = vi.fn();
    const user = userEvent.setup();

    vi.mocked(useCompare).mockReturnValue({
      selectedProducts: [],
      addProduct,
      removeProduct: vi.fn(),
      clearProducts: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(screen.getByText("R$ 4.999,00")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox"));
    expect(addProduct).toHaveBeenCalledWith(product);
  });

  it("removes a selected product from comparison", async () => {
    const removeProduct = vi.fn();
    const user = userEvent.setup();

    vi.mocked(useCompare).mockReturnValue({
      selectedProducts: [product],
      addProduct: vi.fn(),
      removeProduct,
      clearProducts: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("checkbox"));
    expect(removeProduct).toHaveBeenCalledWith(product.id);
  });
});
