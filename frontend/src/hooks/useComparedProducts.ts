import { useQuery } from "@tanstack/react-query";

import { api } from "../services/api";
import type { Product } from "../types/Product";

/**
 * Revalida no backend os produtos selecionados antes de exibir a comparacao.
 */
export function useComparedProducts(ids: number[]) {
  return useQuery<Product[]>({
    queryKey: ["products", "compare", ids],
    enabled: ids.length >= 2,
    queryFn: async () => {
      const { data } = await api.post<Product[]>(
        "/products/compare",
        { ids },
      );

      return data;
    },
  });
}
