import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useProduct(
  id: string
) {
  return useQuery({
    queryKey: ["product", id],

    queryFn: async () => {
      const { data } =
        await api.get(
          `/products/${id}`
        );

      return data;
    },
  });
}
