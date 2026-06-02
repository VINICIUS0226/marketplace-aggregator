import type { SignOptions } from "jsonwebtoken";

/**
 * Configuração centralizada de autenticação.
 *
 * O fallback simplifica execução local; em produção AUTH_SECRET deve ser
 * injetado pelo ambiente.
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET || "marketplace-secret",
  expiresIn: "1h" as SignOptions["expiresIn"],
};
