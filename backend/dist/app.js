"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const productRoutes_1 = __importDefault(require("./modules/products/routes/productRoutes"));
const errorHandler_1 = require("./shared/middlewares/errorHandler");
const swagger_1 = require("./shared/config/swagger");
/**
 * Instância principal da aplicação.
 */
const app = (0, express_1.default)();
/**
 * Middlewares globais.
 */
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
/**
 * Health Check
 *
 * Endpoint utilizado para monitoramento da aplicação.
 */
app.get("/health", (_request, response) => {
    return response.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
/**
 * Rotas da aplicação.
 */
app.use("/products", productRoutes_1.default);
/**
 * Documentação Swagger.
 */
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
/**
 * Middleware global de tratamento de erros.
 */
app.use(errorHandler_1.errorHandler);
exports.default = app;
