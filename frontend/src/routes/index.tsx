import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { Products } from "../pages/Products";
import { ProductDetail } from "../pages/ProductDetail";
import { Compare } from "../pages/Compare";
import { NotFound } from "../pages/NotFound";
import { CompareButton } from "../components/CompareButton";

export function AppRoutes() {
  return (
    <BrowserRouter>
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

      <CompareButton />
    </BrowserRouter>
  );
}