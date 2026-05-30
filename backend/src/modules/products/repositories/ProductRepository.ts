import axios, { AxiosError } from "axios";

import { Product } from "../types/Product";
import { cache } from "../../../shared/config/cache";

/**
 * URL base da API externa utilizada para obtenção dos produtos.
 */
const PRODUCTS_API_URL =
  "https://dummyjson.com/products?limit=100";

/**
 * Chave utilizada para armazenamento dos produtos em cache.
 */
const PRODUCTS_CACHE_KEY = "products";

/**
 * Repository responsável pela integração com a fonte externa de produtos.
 *
 * Atualmente utiliza a DummyJSON API como marketplace mockado.
 */
export class ProductRepository {
  /**
   * Obtém todos os produtos da fonte externa.
   *
   * Fluxo:
   * 1. Verifica se os produtos estão em cache.
   * 2. Caso não estejam, realiza consulta na API externa.
   * 3. Armazena o resultado em cache.
   * 4. Retorna a lista de produtos.
   *
   * @returns Lista de produtos.
   * @throws Error Caso ocorra falha na integração externa.
   */
  public async getAllProducts(): Promise<Product[]> {
    const cachedProducts =
      cache.get<Product[]>(PRODUCTS_CACHE_KEY);

    if (cachedProducts) {
      return cachedProducts;
    }

    try {
      const response = await axios.get(PRODUCTS_API_URL, {
        timeout: 5000,
      });

      const products: Product[] = response.data.products;

      cache.set(PRODUCTS_CACHE_KEY, products);

      return products;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          "Failed to retrieve products from external provider."
        );
      }

      throw error;
    }
  }
}