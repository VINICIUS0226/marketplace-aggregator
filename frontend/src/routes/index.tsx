import {
  lazy,
  Suspense,
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { LinearProgress } from "@mui/material";

import { CompareButton } from "../components/CompareButton";

const Products = lazy(() =>
  import("../pages/Products").then((module) => ({
    default: module.Products,
  })),
);
const ProductDetail = lazy(() =>
  import("../pages/ProductDetail").then((module) => ({
    default: module.ProductDetail,
  })),
);
const Compare = lazy(() =>
  import("../pages/Compare").then((module) => ({
    default: module.Compare,
  })),
);
const NotFound = lazy(() =>
  import("../pages/NotFound").then((module) => ({
    default: module.NotFound,
  })),
);

/**
 * Define a navegação principal do marketplace.
 *
 * O botão de comparação fica fora das rotas para permanecer disponível durante
 * a navegação, respeitando o estado global do CompareProvider. As páginas são
 * carregadas sob demanda para manter o bundle inicial enxuto.
 */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LinearProgress />}>
        <Routes>
          <Route
            path="/"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetail />}
          />

          <Route
            path="/compare"
            element={<Compare />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </Suspense>

      <CompareButton />
    </BrowserRouter>
  );
}
