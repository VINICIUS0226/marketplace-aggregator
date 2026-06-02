import { randomBytes, randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

import { recordHttpRequest } from "../config/metrics";
import { logger } from "../utils/logger";

const TRACEPARENT_PATTERN =
  /^[\da-f]{2}-([\da-f]{32})-[\da-f]{16}-[\da-f]{2}$/i;

function createHexId(bytes: number): string {
  return randomBytes(bytes).toString("hex");
}

function getCorrelationId(request: Request): string {
  const header = request.header("x-correlation-id")?.trim();

  return header ? header.slice(0, 128) : randomUUID();
}

function getTraceId(request: Request): string {
  const traceparent = request.header("traceparent");
  const match = traceparent?.match(TRACEPARENT_PATTERN);

  return match?.[1].toLowerCase() ?? createHexId(16);
}

function getMetricPath(requestPath: string, routePath: unknown): string {
  if (typeof routePath !== "string") {
    return requestPath;
  }

  const requestSegments = requestPath.split("/").filter(Boolean);
  const routeSegments = routePath.split("/").filter(Boolean);

  if (routeSegments.length === 0) {
    return requestPath;
  }

  const prefixSegments = requestSegments.slice(
    0,
    requestSegments.length - routeSegments.length,
  );

  return `/${[...prefixSegments, ...routeSegments].join("/")}`;
}

/**
 * Registra um span HTTP leve e propagavel por W3C Trace Context.
 *
 * Os logs podem ser correlacionados localmente e o endpoint Prometheus recebe
 * a duracao agregada mesmo sem exigir infraestrutura externa para rodar o case.
 */
export function observabilityMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const startedAt = process.hrtime.bigint();
  const requestPath = request.path;
  const correlationId = getCorrelationId(request);
  const traceId = getTraceId(request);
  const spanId = createHexId(8);

  response.setHeader("x-correlation-id", correlationId);
  response.setHeader("traceparent", `00-${traceId}-${spanId}-01`);

  logger.info("http_request_started", {
    correlationId,
    method: request.method,
    path: requestPath,
    spanId,
    traceId,
  });

  response.on("finish", () => {
    const durationMs =
      Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const path = getMetricPath(requestPath, request.route?.path);

    recordHttpRequest(
      request.method,
      path,
      response.statusCode,
      durationMs / 1_000,
    );

    logger.info("http_request_completed", {
      correlationId,
      durationMs,
      method: request.method,
      path,
      spanId,
      statusCode: response.statusCode,
      traceId,
    });
  });

  next();
}
