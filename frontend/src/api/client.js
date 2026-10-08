const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(body?.error?.message || `Request failed (${res.status})`);
    error.details = body?.error?.details;
    throw error;
  }
  return body;
}

export function fetchVehicles() {
  return request('/vehicles');
}

export function calculateCost(input, { signal } = {}) {
  return request('/calculate', { method: 'POST', body: JSON.stringify(input), signal });
}
