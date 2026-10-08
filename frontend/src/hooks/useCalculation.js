import { useEffect, useState } from 'react';
import { calculateCost } from '../api/client.js';

const DEBOUNCE_MS = 250;

/** Recalculates on the server whenever inputs change (debounced, stale requests aborted). */
export function useCalculation({ vehicleId, bidThousands, exchangeRate }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const ready = Boolean(vehicleId) && bidThousands > 0 && exchangeRate > 0;

  useEffect(() => {
    if (!ready) {
      setResult(null);
      setError(null);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      calculateCost({ vehicleId, bidThousands, exchangeRate }, { signal: controller.signal })
        .then(({ data }) => {
          setResult(data);
          setError(null);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setError(err);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [ready, vehicleId, bidThousands, exchangeRate]);

  return { result, error, loading };
}
