"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
/**
 * Wrapper para capturar automaticamente erros
 * em controllers assíncronos e encaminhá-los
 * para o middleware global de tratamento de erros.
 *
 * @param fn Handler assíncrono da rota.
 * @returns RequestHandler tratado.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
