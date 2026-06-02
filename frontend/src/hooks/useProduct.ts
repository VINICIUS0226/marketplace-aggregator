import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Product } from "../types/Product";

/**
 * Consulta detalhes de um produto pelo ID da rota.
 */
export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ["product", id],

    queryFn: async () => {
      const { data } =
        await api.get<Product>(
          `/products/${id}`,
        );

      return data;
    },
  });
}
