"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
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
exports.cache = new node_cache_1.default({
    stdTTL: CACHE_TTL_SECONDS,
    checkperiod: CACHE_CHECK_PERIOD_SECONDS,
});
