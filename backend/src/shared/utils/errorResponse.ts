export interface ValidationIssue {
  path: string;
  message: string;
}

/**
 * Mantem o contrato de erro consistente entre middlewares e controllers.
 */
export function createErrorResponse(
  message: string,
  issues?: ValidationIssue[],
) {
  return {
    success: false,
    message,
    ...(issues ? { issues } : {}),
  };
}
