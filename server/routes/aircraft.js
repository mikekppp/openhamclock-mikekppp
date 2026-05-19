/**
 * Aircraft tracking route — OpenSky Network state vectors (#996).
 *
 * Shared server-side cache, one upstream fetch per refresh interval regardless
 * of how many users are connected. OpenSky anonymous quota is 400 req/day, so
 * per-user fetches would blow the cap instantly on a public instance — see
 * [[feedback_no_gma_integration]] for the same lesson applied to cqgma.
 */

module.exports = function (app, ctx) {
  const { fetch, logDebug, logInfo, logWarn, logErrorOnce, APP_VERSION } = ctx;

  // OpenSky's anonymous quota is ~400 req/day per source IP. On a shared-egress
  // host (Railway, Fly, etc.) that quota is exhausted within minutes by other
  // unrelated services on the same IP. Set OPENSKY_USERNAME / OPENSKY_PASSWORD
  // in .env to use HTTP Basic auth against a free OpenSky account — bumps the
  // limit to ~4000 req/day and is far more reliable. Without credentials the
  // route still works on local installs (where the home IP is unloaded) but
  // will frequently fail on hosted production deployments.
  const OPENSKY_USER = process.env.OPENSKY_USERNAME || '';
  const OPENSKY_PASS = process.env.OPENSKY_PASSWORD || '';
  const hasAuth = !!(OPENSKY_USER && OPENSKY_PASS);

  // 60 s cache — anonymous quota is 400/day, so even at one fetch/min we'd burn
  // ~1440/day. With auth the quota is 4000/day. Either way 30 s was too eager
  // on hosted egress IPs; 60 s is the sweet spot. Stale-on-error up to 5 min.
  const AIRCRAFT_CACHE_TTL = 60 * 1000;
  const AIRCRAFT_STALE_TTL = 5 * 60 * 1000;
  const AIRCRAFT_FETCH_TIMEOUT_MS = 25000; // bumped from 15 — Railway↔OpenSky has been seen >15 s
  let aircraftCache = { data: null, timestamp: 0 };
  let inFlight = null;
  let lastError = null; // surface in the 503 body so deployers can diagnose

  // OpenSky state vector array indices (per their API docs)
  const I = {
    icao24: 0,
    callsign: 1,
    country: 2,
    timePosition: 3,
    lastContact: 4,
    lon: 5,
    lat: 6,
    baroAltitude: 7,
    onGround: 8,
    velocity: 9,
    heading: 10,
    verticalRate: 11,
    geoAltitude: 13,
    squawk: 14,
    positionSource: 16,
  };

  async function fetchAircraft() {
    const url = 'https://opensky-network.org/api/states/all';
    const headers = { 'User-Agent': `OpenHamClock/${APP_VERSION}` };
    if (hasAuth) {
      headers.Authorization = 'Basic ' + Buffer.from(`${OPENSKY_USER}:${OPENSKY_PASS}`).toString('base64');
    }
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(AIRCRAFT_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`OpenSky HTTP ${res.status}${text ? ': ' + text.slice(0, 120) : ''}`);
    }
    const body = await res.json();
    if (!body || !Array.isArray(body.states)) throw new Error('OpenSky returned unexpected payload');

    // Filter + project to a compact wire format. Drop entries with no
    // position fix; clients can't plot them anyway.
    const aircraft = [];
    for (const s of body.states) {
      const lat = s[I.lat];
      const lon = s[I.lon];
      if (typeof lat !== 'number' || typeof lon !== 'number') continue;
      aircraft.push({
        id: s[I.icao24],
        call: (s[I.callsign] || '').trim(),
        country: s[I.country] || '',
        lat,
        lon,
        alt: s[I.geoAltitude] ?? s[I.baroAltitude] ?? null, // meters
        speed: s[I.velocity] ?? null, // m/s
        heading: s[I.heading] ?? null, // degrees from north
        onGround: !!s[I.onGround],
        squawk: s[I.squawk] || null,
      });
    }
    return aircraft;
  }

  app.get('/api/aircraft', async (req, res) => {
    const now = Date.now();

    // Fresh cache hit
    if (aircraftCache.data && now - aircraftCache.timestamp < AIRCRAFT_CACHE_TTL) {
      return res.json({ aircraft: aircraftCache.data, cached: true, age: now - aircraftCache.timestamp });
    }

    // Stale-but-recent + in-flight refresh: serve stale, let background refresh complete
    if (aircraftCache.data && inFlight) {
      return res.json({
        aircraft: aircraftCache.data,
        cached: true,
        stale: true,
        age: now - aircraftCache.timestamp,
      });
    }

    // Need a refresh. Dedupe so concurrent /api/aircraft requests share one upstream call.
    if (!inFlight) {
      inFlight = fetchAircraft()
        .then((aircraft) => {
          aircraftCache = { data: aircraft, timestamp: Date.now() };
          lastError = null;
          logDebug(`[Aircraft] OpenSky returned ${aircraft.length} state vectors with position`);
          return aircraft;
        })
        .catch((e) => {
          lastError = e.message;
          logErrorOnce('Aircraft', e.message);
          // Don't poison cache on failure
          return null;
        })
        .finally(() => {
          inFlight = null;
        });
    }

    try {
      const data = await inFlight;
      if (data) {
        return res.json({ aircraft: data, cached: false, age: 0, auth: hasAuth });
      }
      // Refresh failed — serve stale if we have it and it's not too old, else empty
      if (aircraftCache.data && now - aircraftCache.timestamp < AIRCRAFT_STALE_TTL) {
        res.set('X-Aircraft-Stale', 'true');
        return res.json({ aircraft: aircraftCache.data, cached: true, stale: true });
      }
      res.set('Cache-Control', 'no-store');
      return res.status(503).json({
        error: 'Aircraft feed unavailable',
        reason: lastError || 'unknown',
        hint: hasAuth
          ? 'Upstream OpenSky returned an error or timed out — try again in a minute.'
          : 'No OPENSKY_USERNAME / OPENSKY_PASSWORD configured. Anonymous OpenSky quota is 400/day per source IP and is easily exhausted on shared-egress hosting. Register a free account at https://opensky-network.org/index.php and set credentials in .env.',
        auth: hasAuth,
        aircraft: [],
      });
    } catch (e) {
      // Shouldn't really hit this — fetchAircraft catches its own errors
      logErrorOnce('Aircraft', e.message);
      return res.status(500).json({ error: 'Aircraft feed error', reason: e.message, aircraft: [] });
    }
  });
};
