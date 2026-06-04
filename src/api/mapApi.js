const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error('Veri alınamadı');
  }

  return response.json();
}

export function getCategories() {
  return request('/api/categories');
}

export function getPlaces({ category, query } = {}) {
  const params = new URLSearchParams();

  if (category && category !== 'all') {
    params.set('category', category);
  }

  if (query) {
    params.set('q', query);
  }

  const suffix = params.toString() ? `?${params.toString()}` : '';
  return request(`/api/places${suffix}`);
}

export function getStats() {
  return request('/api/stats');
}
