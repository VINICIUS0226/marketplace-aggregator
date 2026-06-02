import { ProductRepository } from "../repositories/ProductRepository";
import { AppError } from "../../../shared/errors/AppError";
import { Product } from "../types/Product";

/**
 * Filtros aceitos pela camada de serviço.
 *
 * O controller converte os valores recebidos por query string e esta camada
 * concentra a regra de negócio aplicada sobre a coleção em memória.
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
 * Contrato de resposta usado pela API para paginação.
 */
interface PaginatedProducts {
  data: Product[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

/**
 * Serviço de domínio de produtos.
 *
 * Mantém filtros, paginação e comparação fora do controller para que as regras
 * sejam testáveis e independentes de HTTP.
 */
export class ProductService {
  constructor(
    private readonly productRepository = new ProductRepository(),
  ) {}

  /**
   * Lista produtos com filtros combináveis e paginação.
   *
   * A paginação é feita após os filtros para que totalItems e totalPages
   * reflitam o resultado filtrado, não a coleção completa.
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

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase();

      filteredProducts = filteredProducts.filter((product) =>
        [
          product.title,
          product.description,
          product.category,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm),
      );
    }

    if (
      typeof minPrice === "number" &&
      !Number.isNaN(minPrice)
    ) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice,
      );
    }

    if (
      typeof maxPrice === "number" &&
      !Number.isNaN(maxPrice)
    ) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= maxPrice,
      );
    }

    const currentPage = page && page > 0 ? page : 1;
    const currentLimit = limit && limit > 0 ? limit : 10;

    const startIndex = (currentPage - 1) * currentLimit;
    const endIndex = startIndex + currentLimit;

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
   * Atualiza o cache e força uma nova leitura da fonte externa.
   *
   * A rota que chama este método é protegida por JWT porque altera o estado
   * operacional da aplicação.
   */
  public async refreshProducts(): Promise<Product[]> {
    return this.productRepository.refreshProducts();
  }

  /**
   * Busca um produto pelo ID e transforma ausência em erro de domínio.
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
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  /**
   * Retorna os produtos selecionados para comparação.
   *
   * IDs duplicados ou inexistentes não geram duplicidade na resposta, pois a
   * comparação é baseada na coleção canônica carregada pelo repository.
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

  /**
   * Retorna as categorias disponíveis a partir dos produtos carregados.
   */
  public async getCategories(): Promise<string[]> {
    const products =
      await this.productRepository.getAllProducts();

    return [
      ...new Set(
        products.map((product) => product.category),
      ),
    ];
  }
}
