interface MetricsSnapshot {
  externalProviderRequests: number;
  externalProviderSuccesses: number;
  externalProviderFailures: number;
  externalProviderRetries: number;
  staleCacheFallbacks: number;
}

interface HttpRequestMetric {
  durationSeconds: number;
  method: string;
  path: string;
  requests: number;
  statusCode: number;
}

const metrics: MetricsSnapshot = {
  externalProviderRequests: 0,
  externalProviderSuccesses: 0,
  externalProviderFailures: 0,
  externalProviderRetries: 0,
  staleCacheFallbacks: 0,
};

const httpRequestMetrics = new Map<string, HttpRequestMetric>();

export function incrementMetric(metric: keyof MetricsSnapshot) {
  metrics[metric] += 1;
}

export function recordHttpRequest(
  method: string,
  path: string,
  statusCode: number,
  durationSeconds: number,
) {
  const key = `${method}:${path}:${statusCode}`;
  const current = httpRequestMetrics.get(key);

  httpRequestMetrics.set(key, {
    durationSeconds: (current?.durationSeconds ?? 0) + durationSeconds,
    method,
    path,
    requests: (current?.requests ?? 0) + 1,
    statusCode,
  });
}

export function getMetricsSnapshot(): MetricsSnapshot {
  return { ...metrics };
}

function escapeLabel(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

/**
 * Expoe o formato texto aceito pelo Prometheus sem acoplar a aplicacao a um
 * coletor especifico. O endpoint pode ser raspado diretamente em producao.
 */
export function getPrometheusMetrics(): string {
  const lines = [
    "# HELP marketplace_external_provider_requests_total Requests sent to DummyJSON.",
    "# TYPE marketplace_external_provider_requests_total counter",
    `marketplace_external_provider_requests_total ${metrics.externalProviderRequests}`,
    "# HELP marketplace_external_provider_successes_total Successful DummyJSON requests.",
    "# TYPE marketplace_external_provider_successes_total counter",
    `marketplace_external_provider_successes_total ${metrics.externalProviderSuccesses}`,
    "# HELP marketplace_external_provider_failures_total Failed DummyJSON requests.",
    "# TYPE marketplace_external_provider_failures_total counter",
    `marketplace_external_provider_failures_total ${metrics.externalProviderFailures}`,
    "# HELP marketplace_external_provider_retries_total DummyJSON retry attempts.",
    "# TYPE marketplace_external_provider_retries_total counter",
    `marketplace_external_provider_retries_total ${metrics.externalProviderRetries}`,
    "# HELP marketplace_stale_cache_fallbacks_total Stale cache responses used after provider failures.",
    "# TYPE marketplace_stale_cache_fallbacks_total counter",
    `marketplace_stale_cache_fallbacks_total ${metrics.staleCacheFallbacks}`,
    "# HELP marketplace_http_requests_total HTTP requests completed by method, path and status code.",
    "# TYPE marketplace_http_requests_total counter",
    "# HELP marketplace_http_request_duration_seconds_sum Accumulated HTTP request duration in seconds.",
    "# TYPE marketplace_http_request_duration_seconds_sum counter",
  ];

  for (const metric of httpRequestMetrics.values()) {
    const labels = `method="${escapeLabel(metric.method)}",path="${escapeLabel(
      metric.path,
    )}",status_code="${metric.statusCode}"`;

    lines.push(`marketplace_http_requests_total{${labels}} ${metric.requests}`);
    lines.push(
      `marketplace_http_request_duration_seconds_sum{${labels}} ${metric.durationSeconds}`,
    );
  }

  return `${lines.join("\n")}\n`;
}

export function resetMetrics() {
  for (const metric of Object.keys(metrics) as Array<keyof MetricsSnapshot>) {
    metrics[metric] = 0;
  }

  httpRequestMetrics.clear();
}
