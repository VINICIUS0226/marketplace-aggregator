import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "../types/Product";
import { CompareContext } from "./compareStore";

const SELECTED_PRODUCTS_KEY = "marketplace:selected-products";

function loadSelectedProducts(): Product[] {
  try {
    const storedProducts = sessionStorage.getItem(SELECTED_PRODUCTS_KEY);

    if (!storedProducts) return [];

    const parsedProducts: unknown = JSON.parse(storedProducts);

    return Array.isArray(parsedProducts)
      ? parsedProducts as Product[]
      : [];
  } catch {
    return [];
  }
}

/**
 * Estado global mínimo para a comparação.
 *
 * Context API é suficiente aqui porque o estado é pequeno, local ao frontend e
 * não exige uma solução mais pesada como Redux/Zustand.
 */
export function CompareProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedProducts, setSelectedProducts] =
    useState<Product[]>(loadSelectedProducts);

  useEffect(() => {
    sessionStorage.setItem(
      SELECTED_PRODUCTS_KEY,
      JSON.stringify(selectedProducts),
    );
  }, [selectedProducts]);

  function addProduct(product: Product) {
    const exists = selectedProducts.find(
      (selectedProduct) => selectedProduct.id === product.id,
    );

    if (exists) return;

    setSelectedProducts((currentProducts) => [
      ...currentProducts,
      product,
    ]);
  }

  function removeProduct(id: number) {
    setSelectedProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id),
    );
  }

  function clearProducts() {
    setSelectedProducts([]);
  }

  return (
    <CompareContext.Provider
      value={{
        selectedProducts,
        addProduct,
        removeProduct,
        clearProducts,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}
