/**
 * api.js — Frontend API Client
 * Thin wrapper around fetch for calling the backend.
 * Include this in any page that needs to talk to the API.
 *
 * Usage:
 *   const { tasks } = await API.tasks.list();
 *   const { meeting, tasks } = await API.ai.extract({ title, transcript });
 */

const API_BASE = window.location.origin + '/api';

function getAuthHeader() {
  const token = localStorage.getItem('ama_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(method, path, body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(API_BASE + path, opts);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

const API = {
  auth: {
    register: (body)  => request('POST', '/auth/register', body),
    login:    (body)  => request('POST', '/auth/login', body),
    me:       ()      => request('GET',  '/auth/me'),
  },

  meetings: {
    list:    (userId) => request('GET',    `/meetings${userId ? '?userId=' + userId : ''}`),
    get:     (id)     => request('GET',    `/meetings/${id}`),
    create:  (body)   => request('POST',   '/meetings', body),
    update:  (id, b)  => request('PUT',    `/meetings/${id}`, b),
    delete:  (id)     => request('DELETE', `/meetings/${id}`),
  },

  tasks: {
    list:   (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request('GET', `/tasks${qs ? '?' + qs : ''}`);
    },
    get:    (id)    => request('GET',    `/tasks/${id}`),
    create: (body)  => request('POST',   '/tasks', body),
    update: (id, b) => request('PATCH',  `/tasks/${id}`, b),
    delete: (id)    => request('DELETE', `/tasks/${id}`),
  },

  ai: {
    extract: (body) => request('POST', '/ai/extract', body),
    chat:    (body) => request('POST', '/ai/chat',    body),
    suggest: (body) => request('POST', '/ai/suggest', body),
  },

  notifications: {
    list:    (userId) => request('GET',   `/notifications${userId ? '?userId=' + userId : ''}`),
    create:  (body)   => request('POST',  '/notifications', body),
    markRead:(id)     => request('PATCH', `/notifications/${id}/read`),
  },
};

// Expose globally
window.API = API;
