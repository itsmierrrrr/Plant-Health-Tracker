import api from './api';
import type { ApiResponse, PlantAnalysisRecord, UploadProgressCallback } from '../types/analysis';

export async function analyzePlantImage(file: File, onUploadProgress?: UploadProgressCallback) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post<ApiResponse<PlantAnalysisRecord>>('/api/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      if (!event.total) {
        return;
      }

      const progress = Math.min(100, Math.round((event.loaded * 100) / event.total));
      onUploadProgress?.(progress);
    },
  });

  return response.data.data;
}

export async function fetchAnalysisById(id: string) {
  const response = await api.get<ApiResponse<PlantAnalysisRecord>>(`/api/analysis/${id}`);
  return response.data.data;
}

export async function fetchRecentAnalyses() {
  const response = await api.get<ApiResponse<PlantAnalysisRecord[]>>('/api/analysis');
  return response.data.data;
}
