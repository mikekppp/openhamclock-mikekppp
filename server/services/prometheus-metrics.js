/**
 * Prometheus metrics service.
 *
 * Collects Node.js default metrics and defines custom business metrics.
 * Uses the global default registry — all metrics are exposed by a single
 * /metrics endpoint.
 *
 * Usage in other modules:
 *   const { upstreamFailures } = require('../services/prometheus-metrics');
 *   upstreamFailures.labels('pskreporter').inc();
 */

const client = require('prom-client');

// ── Collect Node.js default metrics ──────────────────────────────────────────
// These include process memory, GC, event loop lag, HTTP request metrics, etc.
// Collected lazily on scrape — zero overhead between scrapes.
client.collectDefaultMetrics({ prefix: 'ohc_' });

// ── Custom metrics ───────────────────────────────────────────────────────────

// Total failed upstream API calls, grouped by service name
const upstreamFailures = new client.Counter({
  name: 'ohc_upstream_failures_total',
  help: 'Total number of failed upstream API calls',
  labelNames: ['service'],
});

// Currently active user sessions (read at scrape time)
let _sessionTracker = null;
const sessionActive = new client.Gauge({
  name: 'ohc_session_active',
  help: 'Currently active user sessions',
  collect() {
    this.set(_sessionTracker?.activeSessions?.size ?? 0);
  },
});

// All-time unique visitors (read at scrape time)
let _visitorStats = null;
const visitorsTotal = new client.Gauge({
  name: 'ohc_visitors_total',
  help: 'All-time unique visitors',
  collect() {
    this.set(_visitorStats?.allTimeVisitors ?? 0);
  },
});

// Today's unique visitors (read at scrape time)
const visitorsToday = new client.Gauge({
  name: 'ohc_visitors_today',
  help: 'Unique visitors today',
  collect() {
    this.set(_visitorStats?.uniqueVisitorsToday ?? 0);
  },
});

// Total API requests (counted per-route)
const apiRequestsTotal = new client.Counter({
  name: 'ohc_api_requests_total',
  help: 'Total API requests',
  labelNames: ['route', 'method', 'status'],
});

// API response duration histogram (seconds)
const apiDuration = new client.Histogram({
  name: 'ohc_api_duration_seconds',
  help: 'API response duration in seconds',
  labelNames: ['route'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

// ── Subsystem health gauges ──────────────────────────────────────────────────
// 1 = ok/unknown, 2 = degraded, 3 = down
// Read at scrape time from ctx

let _subsystemsHealth = null;
const subsystemStatus = new client.Gauge({
  name: 'ohc_subsystem_status',
  help: 'Subsystem health status (1=ok/unknown, 2=degraded, 3=down)',
  labelNames: ['subsystem'],
  collect() {
    if (!_subsystemsHealth) return;
    const severity = { ok: 1, unknown: 1, degraded: 2, down: 3 };
    for (const [name, info] of Object.entries(_subsystemsHealth)) {
      subsystemStatus.labels(name).set(severity[info.status] ?? 1);
    }
  },
});

// ── Middleware: track API requests ───────────────────────────────────────────

function apiMetricsMiddleware() {
  return (req, res, next) => {
    // Skip metrics endpoint itself
    if (req.path === '/metrics') return next();

    const startTime = Date.now();
    const route = req.path.replace(/\/[A-Z0-9]{3,10}(-[A-Z0-9]+)?$/i, '/:param').replace(/\/\d+$/g, '/:id');

    const originalJson = res.json;
    const originalSend = res.send;

    res.json = function (body) {
      const duration = (Date.now() - startTime) / 1000;
      apiRequestsTotal.labels(route, req.method, String(res.statusCode)).inc();
      apiDuration.labels(route).observe(duration);
      return originalJson.call(this, body);
    };

    res.send = function (body) {
      const duration = (Date.now() - startTime) / 1000;
      apiRequestsTotal.labels(route, req.method, String(res.statusCode)).inc();
      apiDuration.labels(route).observe(duration);
      return originalSend.call(this, body);
    };

    next();
  };
}

// ── Inject references into collect() functions ───────────────────────────────
// collect() functions use closure variables (_sessionTracker, etc.) instead of
// ctx to avoid circular dependency issues. These are set once at boot.

function setSessionTracker(sessionTracker) {
  _sessionTracker = sessionTracker;
}

function setVisitorStats(visitorStats) {
  _visitorStats = visitorStats;
}

function setSubsystemsHealth(getSubsystems) {
  _subsystemsHealth = null; // reset
  // Snapshot is refreshed every 30s by server/health.js
  setInterval(() => {
    _subsystemsHealth = getSubsystems?.();
  }, 5000); // read every 5s, stale between scrapes is fine
}

// ── Export ───────────────────────────────────────────────────────────────────

module.exports = {
  // Metrics (exported for direct use in other modules)
  upstreamFailures,
  apiRequestsTotal,
  apiDuration,

  // Injectors (call once at boot to wire collect() functions)
  setSessionTracker,
  setVisitorStats,
  setSubsystemsHealth,

  // Middleware
  apiMetricsMiddleware,

  // Registry (for /metrics endpoint)
  registry: client.register,
};
