import { useEffect, useState } from 'react';
import { fetchVehicles } from '../api/client.js';

export function useVehicles() {
  const [state, setState] = useState({ vehicles: [], meta: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    fetchVehicles()
      .then(({ data, meta }) => {
        if (!cancelled) setState({ vehicles: data, meta, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ vehicles: [], meta: null, loading: false, error });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
