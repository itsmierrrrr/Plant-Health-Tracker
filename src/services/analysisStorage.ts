import type { PlantAnalysisRecord } from '../types/analysis';

const LATEST_ANALYSIS_KEY = 'plant-health-tracker:latest-analysis';

export function saveLatestAnalysis(analysis: PlantAnalysisRecord) {
  sessionStorage.setItem(LATEST_ANALYSIS_KEY, JSON.stringify(analysis));
}

export function loadLatestAnalysis() {
  const serializedAnalysis = sessionStorage.getItem(LATEST_ANALYSIS_KEY);

  if (!serializedAnalysis) {
    return null;
  }

  try {
    return JSON.parse(serializedAnalysis) as PlantAnalysisRecord;
  } catch {
    sessionStorage.removeItem(LATEST_ANALYSIS_KEY);
    return null;
  }
}

export function clearLatestAnalysis() {
  sessionStorage.removeItem(LATEST_ANALYSIS_KEY);
}
