import { apiFetch } from './apiClient';

export const getFlags = () => apiFetch('/api/flags');
export const resolveFlag = (id) => apiFetch(`/api/flags/${id}/resolve`, { method: 'PUT' });
