import dotenv from "dotenv";
import express, {
  Application,
  Request,
  Response,
} from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./modules/auth/routes/authRoutes";
import productRoutes from "./modules/products/routes/productRoutes";

import { errorHandler } from "./shared/middlewares/errorHandler";
import { swaggerSpec } from "./shared/config/swagger";

dotenv.config();

/**
 * App Express isolado do listener HTTP.
 *
 * Essa separação facilita testes de integração com Supertest e permite que
 * server.ts cuide apenas do bootstrap do processo.
 */
const app: Application = express();

/**
 * Origens conhecidas do frontend em desenvolvimento, preview e E2E.
 *
 * O CORS fica explícito para evitar liberar qualquer origem por conveniência.
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
  ...(process.env.CORS_ORIGINS?.split(",") ?? []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Requisições sem origin, como health checks e testes server-side,
      // devem continuar válidas.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

/**
 * Limita rajadas por IP sem bloquear o uso normal da interface.
 *
 * Em produção, os valores deveriam ser calibrados com métricas de tráfego e,
 * em múltiplas instâncias, apoiados por um store compartilhado como Redis.
 */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

/**
 * Health check usado pelo Docker Compose e por validações manuais.
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
 * Rotas de domínio.
 */
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

/**
 * Documentação interativa da API.
 */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

/**
 * Deve ser registrado por último para capturar erros das rotas anteriores.
 */
app.use(errorHandler);

export default app;
