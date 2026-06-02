import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "../config/auth";

/**
 * Middleware de autenticação para rotas operacionais.
 *
 * O case não exige um sistema completo de usuários; o objetivo aqui é
 * demonstrar proteção de rotas de escrita com JWT.
 */
export function authenticateToken(
  request: Request,
  response: Response,
  next: NextFunction,
): Response | void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Authorization header is missing.",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({
      message: "Authorization header must use the Bearer scheme.",
    });
  }

  try {
    jwt.verify(token, authConfig.secret);

    return next();
  } catch {
    return response.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}
