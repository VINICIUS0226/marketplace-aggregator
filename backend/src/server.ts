import app from "./app";

/**
 * Porta utilizada pela aplicação.
 *
 * Prioriza variável de ambiente e utiliza
 * 3000 como fallback para ambiente local.
 */
const PORT: number = Number(process.env.PORT) || 3000;

/**
 * Inicialização do servidor HTTP.
 */
app.listen(PORT, () => {
  console.log(`
=================================================
🚀 Marketplace Aggregator API
=================================================
✅ Environment: ${process.env.NODE_ENV || "development"}
🌐 Server: http://localhost:${PORT}
📚 Swagger: http://localhost:${PORT}/api-docs
❤️ Health: http://localhost:${PORT}/health
=================================================
`);
});