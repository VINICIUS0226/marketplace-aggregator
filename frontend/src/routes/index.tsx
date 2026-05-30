import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { Products } from "../pages/Products";
import { ProductDetail } from "../pages/ProductDetail";
import { Compare } from "../pages/Compare";

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
      </Routes>
    </BrowserRouter>
  );
}