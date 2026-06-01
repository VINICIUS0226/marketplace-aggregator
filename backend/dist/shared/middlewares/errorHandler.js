"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../errors/AppError");
/**
 * Middleware global responsável pelo tratamento
 * de erros da aplicação.
 *
 * Fluxo:
 * - Erros de negócio (AppError)
 * - Erros inesperados (500)
 */
function errorHandler(error, request, response, _next) {
    /**
     * Erros controlados da aplicação.
     */
    if (error instanceof AppError_1.AppError) {
        return response.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
    /**
     * Log para análise e troubleshooting.
     */
    console.error(`[${new Date().toISOString()}]`, request.method, request.originalUrl, error);
    /**
     * Erro interno não tratado.
     */
    return response.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
