import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NotFound } from ".";

describe("NotFound page", () => {
  it("renders a clear missing page message", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});
