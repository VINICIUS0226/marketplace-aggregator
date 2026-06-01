"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
/**
* Classe base para erros controlados da aplicação.
*
* Utilizada para retornar erros de negócio
* com status HTTP apropriado.
*
* Exemplo:
*
* throw new AppError("Product not found", 404);
*/
class AppError extends Error {
    /**
     * Código HTTP associado ao erro.
     */
    statusCode;
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        /**
         * Mantém a cadeia de protótipos correta.
         */
        Object.setPrototypeOf(this, AppError.prototype);
        /**
         * Melhora o stack trace para debug.
         */
        Error.captureStackTrace?.(this, this.constructor);
    }
}
exports.AppError = AppError;
