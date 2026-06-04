const API_ERRORS = {
  unauthorized: 'Please sign in again.',
  forbidden: 'You do not have permission for this action.',
  not_found: 'Item not found.',
  email_and_password_required: 'Email and password are required.',
  title_and_url_required: 'Title and URL are required.',
  title_excerpt_tag_required: 'Title, excerpt, and tag are required.',
  name_required: 'Category name is required.',
  cannot_change_own_role: 'You cannot remove your own administrator access.',
  email_already_exists: 'This email is already registered.',
  category_has_bookmarks: 'Move or remove bookmarks in this category before deleting it.',
  cannot_change_own_role: 'You cannot change your own admin role.',
  request_failed: 'Something went wrong. Please try again.',
};

export function humanizeApiError(code) {
  return API_ERRORS[code] || code || API_ERRORS.request_failed;
}

export async function hubRequest(path, options = {}) {
  const res = await fetch(path, { credentials: 'include', ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(humanizeApiError(data?.error));
  }
  return data;
}

export const hubApi = {
  me: () => hubRequest('/api/auth/me'),
  logout: () => hubRequest('/api/auth/logout', { method: 'POST' }),
  bookmarks: (query, sort) => {
    const params = new URLSearchParams({ sort });
    if (query?.trim()) params.set('q', query.trim());
    return hubRequest(`/api/bookmarks?${params}`);
  },
  announcements: (limit = 12) => hubRequest(`/api/announcements?limit=${limit}`),
};

export const adminApi = {
  bookmarks: {
    list: () => hubRequest('/api/admin/bookmarks'),
    create: (body) => hubRequest('/api/admin/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    update: (id, body) => hubRequest(`/api/admin/bookmarks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    hide: (id) => hubRequest(`/api/admin/bookmarks/${id}`, { method: 'DELETE' }),
  },
  announcements: {
    list: () => hubRequest('/api/admin/announcements'),
    create: (body) => hubRequest('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    update: (id, body) => hubRequest(`/api/admin/announcements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    hide: (id) => hubRequest(`/api/admin/announcements/${id}`, { method: 'DELETE' }),
  },
  categories: {
    list: () => hubRequest('/api/categories'),
    create: (body) => hubRequest('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    update: (id, body) => hubRequest(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    remove: (id) => hubRequest(`/api/admin/categories/${id}`, { method: 'DELETE' }),
  },
  users: {
    list: () => hubRequest('/api/admin/users'),
    create: (body) => hubRequest('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    update: (id, body) => hubRequest(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  },
  logs: (limit = 80) => hubRequest(`/api/admin/logs?limit=${limit}`),
};
