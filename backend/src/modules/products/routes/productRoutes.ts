import { Router } from "express";

import { ProductController } from "../controllers/ProductController";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import { authenticateToken } from "../../../shared/middlewares/auth";
import { validateRequest } from "../../../shared/middlewares/validate";
import {
  compareProductsBodySchema,
  listProductsQuerySchema,
  productIdParamsSchema,
} from "../schemas/productSchemas";

/**
 * Rotas HTTP do domínio de produtos.
 *
 * asyncHandler encaminha rejeições assíncronas ao middleware global de erros.
 */
const productsRouter = Router();
const productController = new ProductController();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Operações relacionadas a produtos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista produtos
 *     description: Retorna uma lista paginada de produtos com suporte a filtros.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoria do produto
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por nome, descrição ou categoria
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Valor mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Valor máximo
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PaginatedProducts"
 *       400:
 *         description: Parâmetros de paginação ou filtros inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
productsRouter.get(
  "/",
  validateRequest({ query: listProductsQuerySchema }),
  asyncHandler(productController.list.bind(productController)),
);

/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: Lista categorias
 *     description: Retorna a lista de categorias disponíveis.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
productsRouter.get(
  "/categories",
  asyncHandler(productController.categories.bind(productController)),
);

/**
 * @swagger
 * /products/compare:
 *   post:
 *     summary: Compara produtos
 *     description: Retorna informações de múltiplos produtos para comparação.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 minItems: 2
 *                 uniqueItems: true
 *                 items:
 *                   type: integer
 *             example:
 *               ids: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Produtos comparados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 *       400:
 *         description: Lista de IDs inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Um ou mais produtos solicitados não existem.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
productsRouter.post(
  "/compare",
  validateRequest({ body: compareProductsBodySchema }),
  asyncHandler(productController.compare.bind(productController)),
);

/**
 * @swagger
 * /products/refresh-cache:
 *   post:
 *     summary: Atualiza o cache de produtos
 *     description: Recarrega os dados a partir da fonte externa e atualiza o cache.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cache atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RefreshCacheResponse"
 *       401:
 *         description: Token inválido ou ausente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
productsRouter.post(
  "/refresh-cache",
  authenticateToken,
  asyncHandler(productController.refresh.bind(productController)),
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtém um produto por ID
 *     description: Retorna os detalhes completos de um produto.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador único do produto
 *     responses:
 *       200:
 *         description: Produto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       400:
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
productsRouter.get(
  "/:id",
  validateRequest({ params: productIdParamsSchema }),
  asyncHandler(productController.show.bind(productController)),
);

export default productsRouter;
