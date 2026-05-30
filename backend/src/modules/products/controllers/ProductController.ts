import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

/**
 * Controller responsável pelas operações relacionadas aos produtos.
 */
export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Lista produtos com suporte a filtros, busca e paginação.
   *
   * Query Params:
   * - category: Filtra por categoria.
   * - search: Busca por nome ou descrição.
   * - minPrice: Preço mínimo.
   * - maxPrice: Preço máximo.
   * - page: Página atual.
   * - limit: Quantidade de itens por página.
   *
   * @param request Requisição HTTP
   * @param response Resposta HTTP
   * @returns Lista paginada de produtos
   */
  public async list(
    request: Request,
    response: Response
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
   *
   * @param request Requisição contendo o ID do produto na URL
   * @param response Resposta HTTP
   * @returns Dados completos do produto
   */
  public async show(
    request: Request,
    response: Response
  ): Promise<Response> {
    const id = Number(request.params.id);

    const product = await this.productService.getProductById(id);

    return response.status(200).json(product);
  }

  /**
   * Compara múltiplos produtos a partir de uma lista de IDs.
   *
   * Exemplo:
   * {
   *   "ids": [1, 2, 3]
   * }
   *
   * @param request Requisição contendo um array de IDs
   * @param response Resposta HTTP
   * @returns Lista dos produtos encontrados
   */
  public async compare(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { ids } = request.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response.status(400).json({
        message: "The ids field must be a non-empty array.",
      });
    }

    const products = await this.productService.compareProducts(ids);

    return response.status(200).json(products);
  }
}