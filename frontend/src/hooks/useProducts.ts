import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { PaginatedProducts } from "../types/Product";

interface Params {
  page?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Consulta paginada de produtos.
 *
 * Os filtros entram na queryKey para que React Query mantenha caches separados
 * por combinação de busca, categoria, preço e página.
 */
export function useProducts(params: Params) {
  return useQuery<PaginatedProducts>({
    queryKey: ["products", params],

    queryFn: async () => {
      const { data } = await api.get<PaginatedProducts>("/products", {
        params,
      });

      return data;
    },
  });
}
