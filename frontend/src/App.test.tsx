import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import App from "./App";
import { api } from "./services/api";

vi.mock("./services/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("App component", () => {
  it("renders the marketplace products page", async () => {
    vi.mocked(api.get).mockImplementation(async (url) => {
      if (url === "/products/categories") {
        return { data: ["notebooks"] };
      }

      return {
        data: {
          data: [
            {
              id: 1,
              title: "Notebook Pro",
              description: "High performance notebook",
              price: 4999,
              category: "notebooks",
              thumbnail: "https://example.com/notebook.png",
            },
          ],
          totalItems: 1,
          totalPages: 1,
          page: 1,
          limit: 10,
        },
      };
    });

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: /Marketplace Aggregator/i,
      }),
    ).toBeInTheDocument();

    expect(await screen.findByText("Notebook Pro")).toBeInTheDocument();
  });
});
