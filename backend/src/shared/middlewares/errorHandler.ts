import {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/AppError";

/**
 * Middleware global responsável pelo tratamento
 * de erros da aplicação.
 *
 * Fluxo:
 * - Erros de negócio (AppError)
 * - Erros inesperados (500)
 */
export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
): Response {
  /**
   * Erros controlados da aplicação.
   */
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  /**
   * Log para análise e troubleshooting.
   */
  console.error(
    `[${new Date().toISOString()}]`,
    request.method,
    request.originalUrl,
    error,
  );

  /**
   * Erro interno não tratado.
   */
  return response.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}