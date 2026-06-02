import "dotenv/config";
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
import {
  getMetricsSnapshot,
  getPrometheusMetrics,
} from "./shared/config/metrics";
import { logger } from "./shared/utils/logger";
import { observabilityMiddleware } from "./shared/middlewares/observability";
import { createErrorResponse } from "./shared/utils/errorResponse";

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
app.use(observabilityMiddleware);
app.use(
  morgan("combined", {
    stream: {
      write: (message) =>
        logger.info("http_request", {
          message: message.trim(),
        }),
    },
  }),
);
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
    skip: (request) =>
      request.path === "/health" ||
      request.path === "/metrics" ||
      request.path === "/metrics/prometheus",
    handler: (_request, response) =>
      response.status(429).json(
        createErrorResponse(
          "Too many requests. Please try again later.",
        ),
      ),
  }),
);

/**
 * Health check usado pelo Docker Compose e por validações manuais.
 */
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Consulta a saude da aplicacao
 *     tags: [Operations]
 *     responses:
 *       200:
 *         description: Aplicacao pronta para receber requisicoes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/HealthResponse"
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
 * @swagger
 * /metrics:
 *   get:
 *     summary: Consulta métricas operacionais
 *     description: Retorna contadores em memória da integração externa e fallback stale.
 *     tags: [Operations]
 *     responses:
 *       200:
 *         description: Métricas retornadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MetricsSnapshot"
 */
/**
 * Métricas operacionais mínimas para observar integração e fallback.
 */
app.get(
  "/metrics",
  (_request: Request, response: Response) => {
    return response.status(200).json(getMetricsSnapshot());
  },
);

/**
 * @swagger
 * /metrics/prometheus:
 *   get:
 *     summary: Exporta metricas no formato Prometheus
 *     description: Retorna contadores de integracao e metricas HTTP para coleta por scraping.
 *     tags: [Operations]
 *     responses:
 *       200:
 *         description: Metricas exportadas no formato de texto do Prometheus.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get(
  "/metrics/prometheus",
  (_request: Request, response: Response) => {
    return response
      .status(200)
      .type("text/plain")
      .send(getPrometheusMetrics());
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
