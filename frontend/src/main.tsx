import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

import { AppRoutes } from "./routes";
import { CompareProvider } from "./contexts/CompareContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CompareProvider>
        <AppRoutes />
      </CompareProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
