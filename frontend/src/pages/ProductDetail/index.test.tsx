import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ProductDetail } from ".";
import { useProduct } from "../../hooks/useProduct";
import { useCompare } from "../../contexts/compareStore";

vi.mock("../../hooks/useProduct");
vi.mock("../../contexts/compareStore");

describe("ProductDetail page", () => {
  it("renders a skeleton while the product is loading", () => {
    vi.mocked(useProduct).mockReturnValue({
      isLoading: true,
      error: null,
    } as ReturnType<typeof useProduct>);

    vi.mocked(useCompare).mockReturnValue({
      selectedProducts: [],
      addProduct: vi.fn(),
      removeProduct: vi.fn(),
      clearProducts: vi.fn(),
    });

    const { container } = render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
  });

  it("renders an error message when the product cannot be loaded", () => {
    vi.mocked(useProduct).mockReturnValue({
      isLoading: false,
      error: new Error("Request failed"),
    } as ReturnType<typeof useProduct>);

    vi.mocked(useCompare).mockReturnValue({
      selectedProducts: [],
      addProduct: vi.fn(),
      removeProduct: vi.fn(),
      clearProducts: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Unable to load the product. Please try again."),
    ).toBeInTheDocument();
  });

  it("renders product data, price history and comparison action", async () => {
    const addProduct = vi.fn();
    const user = userEvent.setup();

    vi.mocked(useProduct).mockReturnValue({
      data: {
        id: 1,
        title: "Notebook Pro",
        description: "High performance notebook",
        category: "notebooks",
        price: 4999,
        rating: 4.8,
        stock: 7,
        thumbnail: "notebook.png",
        images: ["notebook.png"],
        priceHistory: [{ date: "2026-06-01", price: 4899 }],
      },
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProduct>);

    vi.mocked(useCompare).mockReturnValue({
      selectedProducts: [],
      addProduct,
      removeProduct: vi.fn(),
      clearProducts: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    expect(screen.getByText("Notebook Pro")).toBeInTheDocument();
    expect(screen.getByText("Price history")).toBeInTheDocument();
    expect(screen.getByText("2026-06-01")).toBeInTheDocument();
    expect(screen.getByText("R$ 4.899,00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Purchase unavailable" }),
    ).toBeDisabled();

    await user.click(
      screen.getByRole("button", { name: "Add to comparison" }),
    );
    expect(addProduct).toHaveBeenCalledTimes(1);
  });

  it("removes a product already selected for comparison", async () => {
    const removeProduct = vi.fn();
    const user = userEvent.setup();
    const product = {
      id: 1,
      title: "Notebook Pro",
      description: "High performance notebook",
      category: "notebooks",
      price: 4999,
      rating: 4.8,
      stock: 7,
      thumbnail: "notebook.png",
      images: ["notebook.png"],
      priceHistory: [],
    };

    vi.mocked(useProduct).mockReturnValue({
      data: product,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProduct>);

    vi.mocked(useCompare).mockReturnValue({
      selectedProducts: [product],
      addProduct: vi.fn(),
      removeProduct,
      clearProducts: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: "Remove from comparison" }),
    );

    expect(removeProduct).toHaveBeenCalledWith(product.id);
  });

  it("opens and closes the product image dialog", async () => {
    const user = userEvent.setup();
    const product = {
      id: 1,
      title: "Notebook Pro",
      description: "High performance notebook",
      category: "notebooks",
      price: 4999,
      rating: 4.8,
      stock: 7,
      thumbnail: "notebook.png",
      images: ["notebook.png"],
      priceHistory: [],
    };

    vi.mocked(useProduct).mockReturnValue({
      data: product,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProduct>);

    vi.mocked(useCompare).mockReturnValue({
      selectedProducts: [],
      addProduct: vi.fn(),
      removeProduct: vi.fn(),
      clearProducts: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("img", { name: product.title }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button"));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
