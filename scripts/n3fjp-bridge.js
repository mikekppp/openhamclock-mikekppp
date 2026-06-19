const net = require('net');
const http = require('http');

const N3FJP_PORT = 1100;
const OHC_HOST = '127.0.0.1';
const OHC_PORT = 3001;

const client = new net.Socket();
client.setNoDelay(true); // Kills network buffering lag

client.connect(N3FJP_PORT, '127.0.0.1', () => {
  console.log('✅ Bridge Connected to N3FJP (Low-Latency Mode)');
});

let dataBuffer = '';

client.on('data', (data) => {
  dataBuffer += data.toString();
  while (dataBuffer.includes('</CMD>')) {
    const endIdx = dataBuffer.indexOf('</CMD>') + 6;
    const currentRecord = dataBuffer.substring(0, endIdx);
    dataBuffer = dataBuffer.substring(endIdx);
    processN3FJPRecord(currentRecord);
  }
});

// Utility to convert ADIF format (e.g., N044 38.5 or W070 12.3) to Decimal Degrees
function parseAdifCoords(rawStr, isLongitude) {
  if (!rawStr) return 0;
  const clean = rawStr.toUpperCase().trim();
  if (!clean) return 0;

  const match = clean.match(/^([NSEW])\s*(\d+)(?:\s+([\d.]+))?/);
  if (!match) {
    const val = parseFloat(clean);
    return Number.isFinite(val) ? val : 0;
  }

  const dir = match[1];
  const degrees = parseInt(match[2], 10);
  const minutes = match[3] ? parseFloat(match[3]) : 0;

  let decimal = degrees + minutes / 60;

  if (dir === 'S' || dir === 'W') {
    decimal = -decimal;
  }

  return decimal;
}

// Quick helper to fetch true callsign coordinates from your existing server database
function fetchTrueCallCoords(callsign) {
  return new Promise((resolve) => {
    const call = (callsign || '').toUpperCase().trim();
    if (!call || call === 'CLEAR') return resolve(null);

    const req = http.get(`http://${OHC_HOST}:${OHC_PORT}/api/callsign/${encodeURIComponent(call)}`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data && typeof data.lat === 'number' && typeof data.lon === 'number') {
            return resolve({ lat: data.lat, lon: data.lon });
          }
        } catch (e) {}
        resolve(null);
      });
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}

async function processN3FJPRecord(raw) {
  const getTag = (tag) => {
    const m = raw.match(new RegExp(`<${tag}>(.*?)</${tag}>`, 'i'));
    return m && m[1] ? m[1].trim() : '';
  };

  const call = getTag('CALL');
  const isClearSignal = raw.includes('CLEARTAB') || raw.includes('<CLEAR>') || (raw.includes('CALLTAB') && call === '');

  let eventType = isClearSignal ? 'clear' : raw.includes('CALLTAB') ? 'preview' : 'log';

  if (!call && eventType !== 'clear') return;

  // Parse the raw incoming coordinates out of N3FJP
  const rawLat = getTag('LAT');
  const rawLon = getTag('LON');
  let lat = parseAdifCoords(rawLat, false);
  let lon = parseAdifCoords(rawLon, true);

  // 🚨 THE CRITICAL INTERCEPTION:
  // If N3FJP outputs its rigid 1st District placeholder, intercept it and find the real location!
  if (lat === 42.4 && lon === -71.7 && call && !isClearSignal) {
    const trueCoords = await fetchTrueCallCoords(call);
    if (trueCoords) {
      lat = trueCoords.lat;
      lon = trueCoords.lon;
    } else {
      // If the database lookup hasn't found them yet, flag as 0,0 so the server handles it cleanly
      lat = 0.0;
      lon = 0.0;
    }
  }

  const qso = {
    dx_call: isClearSignal ? 'CLEAR' : call,
    dx_grid: getTag('GRIDSQUARE') || getTag('GRID'),
    lat: lat,
    lon: lon,
    status: isClearSignal ? 'clear' : eventType,
    source: 'n3fjp',
    ts_utc: new Date().toISOString(),
  };

  const payload = JSON.stringify(qso);
  const req = http.request(
    {
      hostname: OHC_HOST,
      port: OHC_PORT,
      path: '/api/n3fjp/qso',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Connection: 'close',
      },
    },
    (res) => {
      res.on('data', () => {});
    },
  );

  req.on('error', (e) => console.error('❌ Bridge Error:', e.message));
  req.write(payload);
  req.end();

  console.log(
    `⚡ ${eventType === 'clear' ? '🗑️  CLEARED' : '📡 SENT'}: ${call || 'N/A'} (Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)})`,
  );
}

client.on('error', (err) => console.error('❌ Socket Error:', err.message));
client.on('close', () => {
  console.log('📡 Connection to N3FJP closed. Retrying in 5s...');
  setTimeout(() => client.connect(N3FJP_PORT, '127.0.0.1'), 5000);
});
