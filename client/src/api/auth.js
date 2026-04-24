import { apiFetch } from './apiClient';

export const login = (email, password) =>
  apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (data) =>
  apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
