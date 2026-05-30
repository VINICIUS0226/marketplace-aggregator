import express, {
  Application,
  Request,
  Response,
} from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import productRoutes from "./modules/products/routes/productRoutes";

import { errorHandler } from "./shared/middlewares/errorHandler";
import { swaggerSpec } from "./shared/config/swagger";

/**
 * Instância principal da aplicação.
 */
const app: Application = express();

/**
 * Middlewares globais.
 */
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

/**
 * Health Check
 *
 * Endpoint utilizado para monitoramento da aplicação.
 */
app.get(
  "/health",
  (_request: Request, response: Response) => {
    return response.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  },
);

/**
 * Rotas da aplicação.
 */
app.use("/products", productRoutes);

/**
 * Documentação Swagger.
 */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

/**
 * Middleware global de tratamento de erros.
 */
app.use(errorHandler);

export default app;