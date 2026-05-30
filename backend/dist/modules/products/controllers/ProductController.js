"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const ProductService_1 = require("../services/ProductService");
const service = new ProductService_1.ProductService();
class ProductController {
    async list(request, response) {
        const result = await service.listProducts({
            category: request.query.category,
            search: request.query.search,
            minPrice: Number(request.query.minPrice),
            maxPrice: Number(request.query.maxPrice),
            page: Number(request.query.page),
            limit: Number(request.query.limit),
        });
        return response.json(result);
    }
    async show(request, response) {
        try {
            const id = Number(request.params.id);
            const product = await service.getProductById(id);
            return response.json(product);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ProductController = ProductController;
