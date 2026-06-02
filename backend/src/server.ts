import app from "./app";

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
  console.log(`
=================================================
Marketplace Aggregator API
=================================================
Environment: ${process.env.NODE_ENV || "development"}
Server: http://localhost:${PORT}
Swagger: http://localhost:${PORT}/api-docs
Health: http://localhost:${PORT}/health
=================================================
`);
});
