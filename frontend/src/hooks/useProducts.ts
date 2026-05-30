import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

interface Params {
  page?: number;
  search?: string;
  category?: string;
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