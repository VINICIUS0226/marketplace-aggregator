import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

/**
 * Carrega categorias disponíveis para popular o filtro da listagem.
 */
export function useCategories() {
  return useQuery<string[]>({
    queryKey: ["categories"],

    queryFn: async () => {
      const { data } =
        await api.get<string[]>(
          "/products/categories",
        );

      return data;
    },
  });
}
