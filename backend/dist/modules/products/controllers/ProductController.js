"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const ProductService_1 = require("../services/ProductService");
/**
 * Controller responsável pelas operações relacionadas aos produtos.
 */
class ProductController {
    productService;
    constructor() {
        this.productService = new ProductService_1.ProductService();
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
    async list(request, response) {
        const products = await this.productService.listProducts({
            category: request.query.category,
            search: request.query.search,
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
    async show(request, response) {
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
    async compare(request, response) {
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
exports.ProductController = ProductController;
