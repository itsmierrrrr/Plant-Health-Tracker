import api from './api';
import type { ApiResponse } from '../types/analysis';
import type { AuthCredentials, AuthSession, AuthUser, RegisterCredentials } from '../types/auth';

function normalizeAuthSession(payload: { token: string; user: AuthUser }) {
  return {
    token: payload.token,
    user: payload.user,
  } satisfies AuthSession;
}

export async function registerUser(credentials: RegisterCredentials) {
  const response = await api.post<ApiResponse<AuthSession>>('/api/auth/register', credentials);
  return normalizeAuthSession(response.data.data);
}

export async function loginUser(credentials: AuthCredentials) {
  const response = await api.post<ApiResponse<AuthSession>>('/api/auth/login', credentials);
  return normalizeAuthSession(response.data.data);
}

export async function fetchCurrentUser() {
  const response = await api.get<ApiResponse<{ user: AuthUser }>>('/api/auth/me');
  return response.data.data.user;
}

export async function logoutUser() {
  const response = await api.post<ApiResponse<{ loggedOut: boolean }>>('/api/auth/logout');
  return response.data.data;
}
