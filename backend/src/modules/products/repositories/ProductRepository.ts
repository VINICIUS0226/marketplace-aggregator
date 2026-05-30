import axios, { AxiosError } from "axios";
import { Product } from "../types/Product";
import { cache } from "../../../shared/config/cache";

export class ProductRepository {
  async getAllProducts(): Promise<Product[]> {
    try {
      const cachedProducts = cache.get<Product[]>("products");

      if (cachedProducts) {
        return cachedProducts;
      }

      const response = await axios.get(
        "https://dummyjson.com/products?limit=100",
        {
          timeout: 5000,
        },
      );

      const products = response.data.products;

      cache.set("products", products);

      return products;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error("Failed to fetch external products source");
      }

      throw error;
    }
  }
}
