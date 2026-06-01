import { Router } from "express";

import { ProductController } from "../controllers/ProductController";
import { asyncHandler } from "../../../shared/utils/asyncHandler";

/**
 * Router responsável pelas operações relacionadas aos produtos.
 */
const productsRouter = Router();

/**
 * Controller de produtos.
 */
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
 *         description: Busca por nome ou descrição
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 */
productsRouter.get(
  "/",
  asyncHandler(productController.list.bind(productController))
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
 *                 items:
 *                   type: integer
 *             example:
 *               ids: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Produtos comparados com sucesso.
 *       400:
 *         description: Lista de IDs inválida.
 */
productsRouter.post(
  "/compare",
  asyncHandler(productController.compare.bind(productController))
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
 *       404:
 *         description: Produto não encontrado.
 */
productsRouter.get(
  "/:id",
  asyncHandler(productController.show.bind(productController))
);

export default productsRouter;