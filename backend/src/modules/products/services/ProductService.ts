import { ProductRepository } from "../repositories/ProductRepository";
import { AppError } from "../../../shared/errors/AppError";
import { Product } from "../types/Product";

/**
 * Filtros disponíveis para consulta de produtos.
 */
interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

/**
 * Estrutura de resposta paginada.
 */
interface PaginatedProducts {
  data: Product[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

/**
 * Serviço responsável pelas regras de negócio
 * relacionadas aos produtos.
 */
export class ProductService {
  constructor(
    private readonly productRepository = new ProductRepository(),
  ) {}

  /**
   * Lista produtos com suporte a filtros,
   * busca textual e paginação.
   *
   * @param filters Filtros aplicados à consulta.
   * @returns Resultado paginado.
   */
  public async listProducts(
    filters: ProductFilters,
  ): Promise<PaginatedProducts> {
    const products = await this.productRepository.getAllProducts();

    const {
      category,
      search,
      minPrice,
      maxPrice,
      page,
      limit,
    } = filters;

    let filteredProducts = [...products];

    /**
     * Filtra por categoria.
     */
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() ===
          category.toLowerCase(),
      );
    }

    /**
     * Busca por título.
     */
    if (search) {
      const searchTerm = search.toLowerCase();

      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm),
      );
    }

    /**
     * Filtra por preço mínimo.
     */
    if (
      typeof minPrice === "number" &&
      !Number.isNaN(minPrice)
    ) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice,
      );
    }

    /**
     * Filtra por preço máximo.
     */
    if (
      typeof maxPrice === "number" &&
      !Number.isNaN(maxPrice)
    ) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= maxPrice,
      );
    }

    const currentPage =
      page && page > 0 ? page : 1;

    const currentLimit =
      limit && limit > 0 ? limit : 10;

    const startIndex =
      (currentPage - 1) * currentLimit;

    const endIndex =
      startIndex + currentLimit;

    const paginatedProducts = filteredProducts.slice(
      startIndex,
      endIndex,
    );

    return {
      data: paginatedProducts,
      totalItems: filteredProducts.length,
      totalPages: Math.ceil(
        filteredProducts.length / currentLimit,
      ),
      page: currentPage,
      limit: currentLimit,
    };
  }

  /**
   * Busca um produto pelo ID.
   *
   * @param id Identificador do produto.
   * @returns Produto encontrado.
   * @throws AppError Caso o produto não exista.
   */
  public async getProductById(
    id: number,
  ): Promise<Product> {
    const products =
      await this.productRepository.getAllProducts();

    const product = products.find(
      (product) => product.id === id,
    );

    if (!product) {
      throw new AppError(
        "Product not found",
        404,
      );
    }

    return product;
  }

  /**
   * Compara múltiplos produtos
   * utilizando uma lista de IDs.
   *
   * @param ids Lista de IDs dos produtos.
   * @returns Produtos encontrados.
   */
  public async compareProducts(
    ids: number[],
  ): Promise<Product[]> {
    const products =
      await this.productRepository.getAllProducts();

    return products.filter((product) =>
      ids.includes(product.id),
    );
  }
}