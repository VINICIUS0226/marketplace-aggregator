import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@mui/material";

import { AppRoutes } from "./routes";
import { CompareProvider } from "./contexts/CompareContext";
import { theme } from "./theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CompareProvider>
          <AppRoutes />
        </CompareProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
