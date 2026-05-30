import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

/**
 * Wrapper para capturar automaticamente erros
 * em controllers assíncronos e encaminhá-los
 * para o middleware global de tratamento de erros.
 *
 * @param fn Handler assíncrono da rota.
 * @returns RequestHandler tratado.
 */
export const asyncHandler =
  (
    fn: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<unknown>,
  ): RequestHandler =>
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    Promise.resolve(
      fn(req, res, next),
    ).catch(next);
  };