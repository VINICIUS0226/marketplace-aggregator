"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const ProductRepository_1 = require("../repositories/ProductRepository");
const AppError_1 = require("../../../shared/errors/AppError");
/**
 * Serviço responsável pelas regras de negócio
 * relacionadas aos produtos.
 */
class ProductService {
    productRepository;
    constructor(productRepository = new ProductRepository_1.ProductRepository()) {
        this.productRepository = productRepository;
    }
    /**
     * Lista produtos com suporte a filtros,
     * busca textual e paginação.
     *
     * @param filters Filtros aplicados à consulta.
     * @returns Resultado paginado.
     */
    async listProducts(filters) {
        const products = await this.productRepository.getAllProducts();
        const { category, search, minPrice, maxPrice, page, limit, } = filters;
        let filteredProducts = [...products];
        /**
         * Filtra por categoria.
         */
        if (category) {
            filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() ===
                category.toLowerCase());
        }
        /**
         * Busca por título.
         */
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredProducts = filteredProducts.filter((product) => product.title.toLowerCase().includes(searchTerm));
        }
        /**
         * Filtra por preço mínimo.
         */
        if (typeof minPrice === "number" &&
            !Number.isNaN(minPrice)) {
            filteredProducts = filteredProducts.filter((product) => product.price >= minPrice);
        }
        /**
         * Filtra por preço máximo.
         */
        if (typeof maxPrice === "number" &&
            !Number.isNaN(maxPrice)) {
            filteredProducts = filteredProducts.filter((product) => product.price <= maxPrice);
        }
        const currentPage = page && page > 0 ? page : 1;
        const currentLimit = limit && limit > 0 ? limit : 10;
        const startIndex = (currentPage - 1) * currentLimit;
        const endIndex = startIndex + currentLimit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        return {
            data: paginatedProducts,
            totalItems: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / currentLimit),
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
    async getProductById(id) {
        const products = await this.productRepository.getAllProducts();
        const product = products.find((product) => product.id === id);
        if (!product) {
            throw new AppError_1.AppError("Product not found", 404);
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
    async compareProducts(ids) {
        const products = await this.productRepository.getAllProducts();
        return products.filter((product) => ids.includes(product.id));
    }
    /**
     * Retorna todas as categorias disponíveis
     * a partir da lista de produtos.
     */
    async getCategories() {
        const products = await this.productRepository.getAllProducts();
        return [
            ...new Set(products.map((product) => product.category)),
        ];
    }
}
exports.ProductService = ProductService;
