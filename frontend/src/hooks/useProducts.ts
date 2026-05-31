import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

interface Params {
  page?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function useProducts(params: Params) {
  return useQuery({
    queryKey: ["products", params],

    queryFn: async () => {
      const { data } = await api.get("/products", {
        params,
      });

      return data;
    },
  });
}