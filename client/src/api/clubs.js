import { apiFetch } from './apiClient';

export const getClubs = () => apiFetch('/api/clubs');
export const getClub = (id) => apiFetch(`/api/clubs/${id}`);
export const createClub = (data) => apiFetch('/api/clubs', { method: 'POST', body: JSON.stringify(data) });
export const approveClub = (id) => apiFetch(`/api/clubs/${id}/approve`, { method: 'POST' });
export const rejectClub = (id) => apiFetch(`/api/clubs/${id}/reject`, { method: 'POST' });
export const deleteClub = (id) => apiFetch(`/api/clubs/${id}`, { method: 'DELETE' });
export const joinClub = (id) => apiFetch(`/api/clubs/${id}/join`, { method: 'POST' });
export const getClubMembers = (id) => apiFetch(`/api/clubs/${id}/members`);
export const approveMember = (clubId, memberId) => apiFetch(`/api/clubs/${clubId}/members/${memberId}/approve`, { method: 'POST' });
export const rejectMember = (clubId, memberId) => apiFetch(`/api/clubs/${clubId}/members/${memberId}/reject`, { method: 'POST' });
export const removeMember = (clubId, memberId) => apiFetch(`/api/clubs/${clubId}/members/${memberId}`, { method: 'DELETE' });
export const getClubPosts = (id) => apiFetch(`/api/clubs/${id}/posts`);
export const createClubPost = (id, data) => apiFetch(`/api/clubs/${id}/posts`, { method: 'POST', body: JSON.stringify(data) });
