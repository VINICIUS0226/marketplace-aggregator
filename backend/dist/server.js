"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
/**
 * Porta utilizada pela aplicação.
 *
 * Prioriza variável de ambiente e utiliza
 * 3000 como fallback para ambiente local.
 */
const PORT = Number(process.env.PORT) || 3000;
/**
 * Inicialização do servidor HTTP.
 */
app_1.default.listen(PORT, () => {
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
