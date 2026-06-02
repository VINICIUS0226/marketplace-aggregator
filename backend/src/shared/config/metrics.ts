interface MetricsSnapshot {
  externalProviderRequests: number;
  externalProviderSuccesses: number;
  externalProviderFailures: number;
  externalProviderRetries: number;
  staleCacheFallbacks: number;
}

const metrics: MetricsSnapshot = {
  externalProviderRequests: 0,
  externalProviderSuccesses: 0,
  externalProviderFailures: 0,
  externalProviderRetries: 0,
  staleCacheFallbacks: 0,
};

export function incrementMetric(metric: keyof MetricsSnapshot) {
  metrics[metric] += 1;
}

export function getMetricsSnapshot(): MetricsSnapshot {
  return { ...metrics };
}

export function resetMetrics() {
  for (const metric of Object.keys(metrics) as Array<keyof MetricsSnapshot>) {
    metrics[metric] = 0;
  }
}
