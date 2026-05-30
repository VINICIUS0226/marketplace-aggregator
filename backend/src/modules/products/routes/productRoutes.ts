import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { asyncHandler } from "../../../shared/utils/asyncHandler";

const router = Router();

const controller = new ProductController();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista produtos
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get(
  "/",
  asyncHandler(controller.list)
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Detalhe de produto
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get(
  "/:id",
  asyncHandler(controller.show)
);
export default router;