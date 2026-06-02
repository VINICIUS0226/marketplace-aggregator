import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

/**
 * Controller HTTP de produtos.
 *
 * Mantém a responsabilidade limitada a entrada/saída HTTP. Regras como
 * filtragem, comparação e refresh de cache ficam em ProductService.
 */
export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Lista produtos com suporte a filtros combináveis e paginação.
   */
  public async list(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const products = await this.productService.listProducts({
      category: request.query.category as string,
      search: request.query.search as string,
      minPrice: Number(request.query.minPrice),
      maxPrice: Number(request.query.maxPrice),
      page: Number(request.query.page),
      limit: Number(request.query.limit),
    });

    return response.status(200).json(products);
  }

  /**
   * Retorna os detalhes de um produto específico.
   */
  public async show(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const id = Number(request.params.id);

    const product = await this.productService.getProductById(id);

    return response.status(200).json(product);
  }

  /**
   * Compara múltiplos produtos a partir de uma lista de IDs.
   *
   * A validação mínima fica aqui por estar ligada ao contrato HTTP do body.
   */
  public async compare(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { ids } = request.body;

    if (!Array.isArray(ids) || ids.length < 2) {
      return response.status(400).json({
        message: "The ids field must contain at least two products.",
      });
    }

    if (ids.some((id) => typeof id !== "number" || Number.isNaN(id))) {
      return response.status(400).json({
        message: "All ids must be valid numbers.",
      });
    }

    const products = await this.productService.compareProducts(ids);

    return response.status(200).json(products);
  }

  /**
   * Retorna a lista de categorias disponíveis.
   */
  public async categories(
    _request: Request,
    response: Response,
  ): Promise<Response> {
    const categories =
      await this.productService.getCategories();

    return response.status(200).json(categories);
  }

  /**
   * Recarrega o cache de produtos.
   *
   * A autenticação é aplicada na rota; aqui apenas executamos a ação de domínio.
   */
  public async refresh(
    _request: Request,
    response: Response,
  ): Promise<Response> {
    const products = await this.productService.refreshProducts();

    return response.status(200).json({
      message: "Product cache refreshed successfully.",
      totalItems: products.length,
    });
  }
}
