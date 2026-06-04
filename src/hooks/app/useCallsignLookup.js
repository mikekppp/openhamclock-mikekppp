/**
 * useCallsignLookup — fetches station info for a callsign.
 *
 * Returns { data, loading, error }
 * data shape: { callsign, name, grid, country, state, county,
 *               lat, lon, cqZone, ituZone, geoloc, source }
 *
 * Uses an in-memory cache to avoid redundant requests.
 * Falls back gracefully to ctyLookup data if the API is unavailable.
 *
 * Usage:
 *   const { data, loading } = useCallsignLookup('K1ABC');
 *   // data is null on first load, then populated on resolve
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/apiFetch.js';
import { extractBaseCall } from '../../components/CallsignLink.jsx';

// TTL: 24 hours (matches server-side cache TTL)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// In-memory cache keyed by callsign
const cache = new Map();

export default function useCallsignLookup(call) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchInProgress = useRef(false);

  const fetchCall = useCallback(async (callsign) => {
    if (!callsign || fetchInProgress.current) return;
    fetchInProgress.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(`/api/callsign/${encodeURIComponent(callsign)}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res) {
        // Backoff — don't treat as error
        setData(null);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setData(null);
        setError(`HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      const result = await res.json();
      setData(result);
      cache.set(callsign, { data: result, timestamp: Date.now() });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    const baseCall = extractBaseCall(call);
    if (!baseCall) return;

    const cached = cache.get(baseCall);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    fetchCall(baseCall);
  }, [call, fetchCall]);

  return { data, loading, error };
}
