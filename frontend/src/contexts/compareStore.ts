import {
  createContext,
  useContext,
} from "react";

import type { Product } from "../types/Product";

export interface CompareContextData {
  selectedProducts: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
  clearProducts: () => void;
}

/**
 * Contexto compartilhado da comparação.
 *
 * Fica separado do provider para preservar compatibilidade com Fast Refresh.
 */
export const CompareContext =
  createContext({} as CompareContextData);

export function useCompare() {
  return useContext(CompareContext);
}
