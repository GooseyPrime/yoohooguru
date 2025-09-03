/**
 * API utility for backend communication
 */

export async function api(path, opts = {}) {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  const res = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...opts
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || 'Request failed');
  return json;
}