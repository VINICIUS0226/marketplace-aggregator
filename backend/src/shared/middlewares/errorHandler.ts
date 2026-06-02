import {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/AppError";

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

  console.error(
    `[${new Date().toISOString()}]`,
    request.method,
    request.originalUrl,
    error,
  );

  return response.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
