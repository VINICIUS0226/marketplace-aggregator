"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const axios_1 = __importStar(require("axios"));
const cache_1 = require("../../../shared/config/cache");
/**
 * URL base da API externa utilizada para obtenção dos produtos.
 */
const PRODUCTS_API_URL = "https://dummyjson.com/products?limit=100";
/**
 * Chave utilizada para armazenamento dos produtos em cache.
 */
const PRODUCTS_CACHE_KEY = "products";
/**
 * Repository responsável pela integração com a fonte externa de produtos.
 *
 * Atualmente utiliza a DummyJSON API como marketplace mockado.
 */
class ProductRepository {
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
    async getAllProducts() {
        const cachedProducts = cache_1.cache.get(PRODUCTS_CACHE_KEY);
        if (cachedProducts) {
            return cachedProducts;
        }
        try {
            const response = await axios_1.default.get(PRODUCTS_API_URL, {
                timeout: 15000,
            });
            const products = response.data.products;
            cache_1.cache.set(PRODUCTS_CACHE_KEY, products);
            return products;
        }
        catch (error) {
            const errorMessage = error instanceof axios_1.AxiosError
                ? `${error.code}: ${error.message}`
                : String(error);
            console.error(`[ProductRepository] Failed to fetch products: ${errorMessage}`);
            throw new Error("Failed to retrieve products from external provider.");
        }
    }
}
exports.ProductRepository = ProductRepository;
