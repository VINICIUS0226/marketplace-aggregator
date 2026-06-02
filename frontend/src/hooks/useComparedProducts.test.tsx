import React, { type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  renderHook,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useComparedProducts } from "./useComparedProducts";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    post: vi.fn(),
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

describe("useComparedProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads products selected for comparison", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: [
        { id: 1, title: "Notebook Pro" },
        { id: 2, title: "Notebook Air" },
      ],
    });

    const { result } = renderHook(
      () => useComparedProducts([1, 2]),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith(
      "/products/compare",
      { ids: [1, 2] },
    );
    expect(result.current.data).toHaveLength(2);
  });

  it("does not request a comparison with fewer than two products", () => {
    renderHook(
      () => useComparedProducts([1]),
      { wrapper: createWrapper() },
    );

    expect(api.post).not.toHaveBeenCalled();
  });
});
