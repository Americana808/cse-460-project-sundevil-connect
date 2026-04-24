import { apiFetch } from './apiClient';

export const getEvents = () => apiFetch('/api/events');
export const getEvent = (id) => apiFetch(`/api/events/${id}`);
export const createEvent = (data) => apiFetch('/api/events', { method: 'POST', body: JSON.stringify(data) });
export const registerForEvent = (id) => apiFetch(`/api/events/${id}/register`, { method: 'POST' });
export const unregisterFromEvent = (id) => apiFetch(`/api/events/${id}/unregister`, { method: 'POST' });
export const getEventAttendees = (id) => apiFetch(`/api/events/${id}/attendees`);
