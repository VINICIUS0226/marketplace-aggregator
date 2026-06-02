import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";

import { CompareProvider } from "./contexts/CompareContext";
import { AppRoutes } from "./routes";
import { theme } from "./theme";

/**
 * QueryClient único da aplicação.
 *
 * React Query centraliza cache, loading e revalidação das chamadas HTTP, o que
 * evita duplicar estado assíncrono nas páginas.
 */
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CompareProvider>
          <AppRoutes />
        </CompareProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
