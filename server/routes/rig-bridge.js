'use strict';
/**
 * Rig Bridge management routes — health check proxy, auto-launch.
 * Allows OHC to spawn and monitor rig-bridge as a child process.
 */

const { execFile, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = function (app, ctx) {
  const { ROOT_DIR, logInfo, logWarn, logDebug, requireWriteAuth } = ctx;

  let rigBridgeProcess = null;

  const RIG_BRIDGE_DIR = path.join(ROOT_DIR, 'rig-bridge');
  const RIG_BRIDGE_ENTRY = path.join(RIG_BRIDGE_DIR, 'rig-bridge.js');

  /**
   * POST /api/rig-bridge/start — Launch rig-bridge as a detached child process.
   * Only works for local installs where rig-bridge.js exists in the repo.
   */
  app.post('/api/rig-bridge/start', requireWriteAuth, (req, res) => {
    if (rigBridgeProcess && !rigBridgeProcess.killed) {
      return res.status(409).json({ error: 'Rig Bridge is already running', pid: rigBridgeProcess.pid });
    }

    if (!fs.existsSync(RIG_BRIDGE_ENTRY)) {
      return res.status(404).json({ error: 'rig-bridge.js not found — only available for local installs' });
    }

    try {
      const child = spawn('node', [RIG_BRIDGE_ENTRY], {
        cwd: RIG_BRIDGE_DIR,
        detached: true,
        stdio: 'ignore',
      });

      child.unref();
      rigBridgeProcess = child;

      child.on('exit', (code) => {
        logInfo(`[Rig Bridge] Process exited with code ${code}`);
        rigBridgeProcess = null;
      });

      logInfo(`[Rig Bridge] Launched (PID ${child.pid})`);
      res.json({ ok: true, pid: child.pid });
    } catch (err) {
      logWarn(`[Rig Bridge] Failed to launch: ${err.message}`);
      res.status(500).json({ error: `Failed to launch: ${err.message}` });
    }
  });

  /**
   * POST /api/rig-bridge/stop — Stop the rig-bridge child process (if we spawned it).
   */
  app.post('/api/rig-bridge/stop', requireWriteAuth, (req, res) => {
    if (!rigBridgeProcess || rigBridgeProcess.killed) {
      return res.status(404).json({ error: 'No managed rig-bridge process running' });
    }

    try {
      rigBridgeProcess.kill('SIGTERM');
      logInfo('[Rig Bridge] Sent SIGTERM');
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/rig-bridge/status — Check if rig-bridge is available and return its health.
   * Proxies the /health endpoint so the browser doesn't need CORS access.
   */
  app.get('/api/rig-bridge/status', async (req, res) => {
    const host = req.query.host || 'http://localhost';
    const port = req.query.port || '5555';
    const url = `${host}:${port}/health`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const response = await ctx.fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        return res.json({ reachable: false, error: `HTTP ${response.status}` });
      }

      const health = await response.json();
      res.json({
        reachable: true,
        managed: !!(rigBridgeProcess && !rigBridgeProcess.killed),
        ...health,
      });
    } catch (err) {
      res.json({
        reachable: false,
        managed: !!(rigBridgeProcess && !rigBridgeProcess.killed),
        error: err.name === 'AbortError' ? 'timeout' : err.message,
      });
    }
  });
};
