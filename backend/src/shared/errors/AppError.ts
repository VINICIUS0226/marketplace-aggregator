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
export class AppError extends Error {
  /**
   * Código HTTP associado ao erro.
   */
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode = 400,
  ) {
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