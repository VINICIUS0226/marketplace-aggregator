import NodeCache from "node-cache";

/**
 * Cache em memória para reduzir chamadas à fonte externa.
 *
 * Para produção, esta fronteira poderia ser substituída por Redis sem mudar as
 * regras de negócio, pois o repository depende apenas da interface simples do
 * cache.
 */
export const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
});
