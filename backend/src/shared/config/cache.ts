import NodeCache from "node-cache";

/**
 * Tempo padrão de vida dos itens em cache.
 *
 * 300 segundos = 5 minutos.
 */
const CACHE_TTL_SECONDS = 300;

/**
 * Intervalo de verificação para remoção
 * automática de chaves expiradas.
 *
 * 60 segundos = 1 minuto.
 */
const CACHE_CHECK_PERIOD_SECONDS = 60;

/**
 * Cache em memória utilizado para reduzir
 * chamadas à API externa de produtos.
 *
 * Pode ser facilmente substituído por Redis
 * sem impactar as regras de negócio.
 */
export const cache = new NodeCache({
  stdTTL: CACHE_TTL_SECONDS,
  checkperiod: CACHE_CHECK_PERIOD_SECONDS,
});