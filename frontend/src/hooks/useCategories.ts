import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],

    queryFn: async () => {
      const { data } =
        await api.get(
          "/products/categories"
        );

      return data;
    },
  });
}
