import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

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
      <span>Selected: {selectedProducts.length}</span>
      <button onClick={() => addProduct(product)}>Add</button>
      <button onClick={() => removeProduct(product.id)}>Remove</button>
      <button onClick={clearProducts}>Clear</button>
    </>
  );
}

describe("CompareProvider", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("adds products without duplicates and supports remove and clear", async () => {
    const user = userEvent.setup();

    render(
      <CompareProvider>
        <CompareProbe />
      </CompareProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByText("Selected: 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.getByText("Selected: 0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByText("Selected: 0")).toBeInTheDocument();
  });

  it("restores selected products during the browser session", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <CompareProvider>
        <CompareProbe />
      </CompareProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Add" }));
    await waitFor(() =>
      expect(sessionStorage.getItem("marketplace:selected-products"))
        .toContain("Notebook Pro"),
    );

    unmount();

    render(
      <CompareProvider>
        <CompareProbe />
      </CompareProvider>,
    );

    expect(screen.getByText("Selected: 1")).toBeInTheDocument();
  });

  it("ignores invalid products stored in the browser session", () => {
    sessionStorage.setItem(
      "marketplace:selected-products",
      "invalid-json",
    );

    render(
      <CompareProvider>
        <CompareProbe />
      </CompareProvider>,
    );

    expect(screen.getByText("Selected: 0")).toBeInTheDocument();
  });
});
