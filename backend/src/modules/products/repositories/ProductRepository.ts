import axios, { AxiosError } from "axios";

import { Product } from "../types/Product";
import { cache } from "../../../shared/config/cache";

/**
 * URL da fonte externa escolhida para o case.
 *
 * O limite evita chamadas paginadas para um escopo que roda inteiramente em
 * memória e deixa a camada de serviço responsável pela paginação da API local.
 */
const PRODUCTS_API_URL =
  "https://dummyjson.com/products?limit=100";

/**
 * Chave única do cache em memória.
 */
const PRODUCTS_CACHE_KEY = "products";

function isExternalProduct(product: unknown): product is Product {
  if (!product || typeof product !== "object") {
    return false;
  }

  const candidate = product as Partial<Product>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.category === "string" &&
    typeof candidate.price === "number" &&
    typeof candidate.rating === "number" &&
    typeof candidate.stock === "number" &&
    typeof candidate.thumbnail === "string" &&
    Array.isArray(candidate.images)
  );
}

/**
 * Repository responsável pela integração com a fonte externa de produtos.
 *
 * Esta é a única camada que conhece a DummyJSON. Se a fonte mudar para CSV,
 * banco ou outra API, service/controller continuam preservados.
 */
export class ProductRepository {
  private staleProducts: Product[] | null = null;

  /**
   * Cria um histórico sintético de preço para demonstrar o diferencial pedido
   * no case sem introduzir persistência fora do escopo obrigatório.
   */
  private buildPriceHistory(product: Product) {
    const historyDays = 5;
    const today = new Date();

    return Array.from({ length: historyDays }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (historyDays - 1 - index));

      const variation = (index - (historyDays - 1) / 2) * 0.03;
      const price = Math.max(
        1,
        Math.round(product.price * (1 + variation)),
      );

      return {
        date: date.toISOString().split("T")[0],
        price,
      };
    });
  }

  /**
   * Limpa o cache e recarrega os produtos da fonte externa.
   */
  public async refreshProducts(): Promise<Product[]> {
    cache.del(PRODUCTS_CACHE_KEY);
    return this.getAllProducts();
  }

  /**
   * Obtém todos os produtos da fonte externa.
   *
   * Fluxo:
   * 1. Verifica se os produtos estão em cache.
   * 2. Caso não estejam, realiza consulta na API externa.
   * 3. Normaliza o payload externo para o contrato interno.
   * 4. Armazena o resultado em cache.
   */
  public async getAllProducts(): Promise<Product[]> {
    const cachedProducts =
      cache.get<Product[]>(PRODUCTS_CACHE_KEY);

    if (cachedProducts) {
      this.staleProducts = cachedProducts;
      return cachedProducts;
    }

    try {
      const response = await axios.get(PRODUCTS_API_URL, {
        timeout: 15000,
      });

      if (
        !Array.isArray(response.data?.products) ||
        !response.data.products.every(isExternalProduct)
      ) {
        throw new Error("External provider returned an invalid payload.");
      }

      const products: Product[] = response.data.products.map(
        (product: Product) => ({
          ...product,
          priceHistory: this.buildPriceHistory(product),
        }),
      );

      cache.set(PRODUCTS_CACHE_KEY, products);
      this.staleProducts = products;

      return products;
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? `${error.code}: ${error.message}`
        : String(error);

      console.error(
        `[ProductRepository] Failed to fetch products: ${errorMessage}`,
      );

      // Em caso de indisponibilidade temporária, prioriza continuidade de
      // leitura com o último snapshot válido conhecido por esta instância.
      if (this.staleProducts) {
        return this.staleProducts;
      }

      throw new Error(
        "Failed to retrieve products from external provider.",
      );
    }
  }
}
