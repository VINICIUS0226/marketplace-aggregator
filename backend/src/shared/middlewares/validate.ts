import {
  Request,
  Response,
  NextFunction,
} from "express";
import {
  ZodType,
  ZodError,
} from "zod";
import { createErrorResponse } from "../utils/errorResponse";

interface RequestSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export function validateRequest(schemas: RequestSchemas) {
  return (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Response | void => {
    try {
      if (schemas.body) {
        request.body = schemas.body.parse(request.body);
      }

      if (schemas.params) {
        schemas.params.parse(request.params);
      }

      if (schemas.query) {
        schemas.query.parse(request.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json(
          createErrorResponse(
            "Invalid request payload.",
            error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          ),
        );
      }

      next(error);
    }
  };
}
