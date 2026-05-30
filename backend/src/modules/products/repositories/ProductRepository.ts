import axios from "axios";
import { Product } from "../types/Product";

export class ProductRepository {
  async getAllProducts(): Promise<Product[]> {
    const response = await axios.get(
      "https://dummyjson.com/products?limit=100"
    );

    return response.data.products;
  }
}