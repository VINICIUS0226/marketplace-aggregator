import app from "./app";
import { logger } from "./shared/utils/logger";

/**
 * Porta utilizada pela aplicação.
 *
 * Prioriza variável de ambiente e utiliza 3000 como fallback para ambiente
 * local, mantendo compatibilidade com Docker e documentação.
 */
const PORT: number = Number(process.env.PORT) || 3000;

/**
 * Único ponto de inicialização do processo HTTP.
 *
 * Manter o listen fora de app.ts evita efeitos colaterais durante os testes.
 */
app.listen(PORT, () => {
  logger.info("server_started", {
    environment: process.env.NODE_ENV || "development",
    port: PORT,
    swaggerUrl: `http://localhost:${PORT}/api-docs`,
    healthUrl: `http://localhost:${PORT}/health`,
    metricsUrl: `http://localhost:${PORT}/metrics`,
    prometheusMetricsUrl: `http://localhost:${PORT}/metrics/prometheus`,
  });
});
