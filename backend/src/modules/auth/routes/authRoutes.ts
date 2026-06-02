import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../../../shared/utils/asyncHandler";

/**
 * Rotas de autenticação.
 *
 * O escopo atual expõe apenas emissão de token para proteger operações
 * administrativas do case.
 */
const authRouter = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticação
 *     description: Obtém um token JWT para rotas protegidas.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: admin
 *               password: admin123
 *     responses:
 *       200:
 *         description: Token gerado com sucesso.
 *       400:
 *         description: Campos obrigatórios ausentes.
 *       401:
 *         description: Credenciais inválidas.
 */
authRouter.post(
  "/login",
  asyncHandler(authController.login.bind(authController)),
);

export default authRouter;
