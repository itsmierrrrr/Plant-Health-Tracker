export type PlantAnalysisRecord = {
  id: string;
  imageUrl: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  healthScore: number;
  recommendations: string[];
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UploadProgressCallback = (progress: number) => void;
