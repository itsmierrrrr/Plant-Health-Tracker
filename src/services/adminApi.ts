import api from './api';
import type { ApiResponse } from '../types/analysis';
import type { AdminOverview } from '../types/admin';

export async function fetchAdminOverview() {
  const response = await api.get<ApiResponse<AdminOverview>>('/api/admin/overview');
  return response.data.data;
}