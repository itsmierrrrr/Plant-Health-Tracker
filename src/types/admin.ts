export type AdminUser = {
  id: string;
  name: string;
  email: string;
  analysisCount: number;
  createdAt?: string;
};

export type AdminAnalysis = {
  id: string;
  imageUrl: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  healthScore: number;
  recommendations: string[];
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type AdminOverview = {
  users: AdminUser[];
  analyses: AdminAnalysis[];
};