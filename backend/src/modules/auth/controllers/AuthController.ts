import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { authConfig } from "../../../shared/config/auth";

/**
 * Usuário fixo para manter o escopo do case controlado.
 *
 * Em produção, esta responsabilidade migraria para uma tabela de usuários,
 * hash de senha e rotação de credenciais.
 */
const VALID_USER = {
  username: "admin",
  password: "admin123",
};

export class AuthController {
  /**
   * Emite JWT para proteger rotas operacionais, como refresh de cache.
   */
  public async login(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { username, password } = request.body;

    if (!username || !password) {
      return response.status(400).json({
        message: "Username and password are required.",
      });
    }

    if (
      username !== VALID_USER.username ||
      password !== VALID_USER.password
    ) {
      return response.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const token = sign(
      { sub: username },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn },
    );

    return response.status(200).json({
      token,
      expiresIn: authConfig.expiresIn,
    });
  }
}
