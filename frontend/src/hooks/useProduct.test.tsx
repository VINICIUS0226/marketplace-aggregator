import React, { type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  renderHook,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useProduct } from "./useProduct";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe("useProduct", () => {
  it("loads a product by id", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        id: 1,
        title: "Notebook Pro",
      },
    });

    const { result } = renderHook(
      () => useProduct("1"),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith("/products/1");
    expect(result.current.data?.title).toBe("Notebook Pro");
  });
});
