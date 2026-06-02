import {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/AppError";
import { logger } from "../utils/logger";

/**
 * Middleware global de erros.
 *
 * Erros de domínio preservam status e mensagem; erros inesperados são logados
 * internamente e retornam uma resposta genérica para não expor detalhes.
 */
export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  logger.error("unhandled_request_error", {
    method: request.method,
    path: request.originalUrl,
    message: error.message,
  });

  return response.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
