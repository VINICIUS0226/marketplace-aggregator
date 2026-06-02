import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Products } from ".";
import { useCategories } from "../../hooks/useCategories";
import { useProducts } from "../../hooks/useProducts";
import { useCompare } from "../../contexts/compareStore";

vi.mock("../../hooks/useCategories");
vi.mock("../../hooks/useProducts");
vi.mock("../../contexts/compareStore");

describe("Products page", () => {
  beforeEach(() => {
    vi.mocked(useCategories).mockReturnValue({
      data: ["notebooks"],
    } as ReturnType<typeof useCategories>);

    vi.mocked(useCompare).mockReturnValue({
      selectedProducts: [],
      addProduct: vi.fn(),
      removeProduct: vi.fn(),
      clearProducts: vi.fn(),
    });
  });

  it("shows a retry action when products cannot be loaded", async () => {
    const refetch = vi.fn();
    const user = userEvent.setup();

    vi.mocked(useProducts).mockReturnValue({
      isLoading: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof useProducts>);

    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/Não foi possível carregar os produtos/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Tentar novamente" }),
    );

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sends search and price filters to the products query", async () => {
    const user = userEvent.setup();

    vi.mocked(useProducts).mockReturnValue({
      data: {
        data: [],
        totalItems: 0,
        totalPages: 0,
        page: 1,
        limit: 10,
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useProducts>);

    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Buscar produto" }),
      "notebook",
    );
    await user.type(
      screen.getByRole("spinbutton", { name: "Preço mínimo" }),
      "1000",
    );

    expect(useProducts).toHaveBeenLastCalledWith(
      expect.objectContaining({
        search: "notebook",
        minPrice: 1000,
      }),
    );
  });
});
