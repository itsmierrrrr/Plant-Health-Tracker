import { DashboardCard } from '../components/DashboardCard';
import { EmptyState } from '../components/EmptyState';
import { HealthScoreGauge } from '../components/HealthScoreGauge';
import { PageContainer } from '../components/PageContainer';
import { clearLatestAnalysis, loadLatestAnalysis, saveLatestAnalysis } from '../services/analysisStorage';
import type { PlantAnalysisRecord } from '../types/analysis';
import { ArrowLeft, BadgeCheck, CalendarDays, Droplets, Leaf, ShieldAlert, Sparkles, SunMedium, ThermometerSun, TriangleAlert, Wind } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type ResultsLocationState = {
  analysis?: PlantAnalysisRecord;
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Just now' : date.toLocaleString();
}

function getPlantStatus(healthScore: number) {
  if (healthScore >= 85) {
    return 'Healthy';
  }

  if (healthScore >= 65) {
    return 'Monitor';
  }

  return 'Needs attention';
}

function getCareInsights(analysis: PlantAnalysisRecord) {
  return analysis.careInsights ?? {
    waterNeed: 'Moderate watering',
    sunlightNeed: 'Bright indirect light',
    soilTemperature: '18-24°C',
    leafCondition: 'Condition inferred from the latest scan',
    soilMoisture: 'Evenly moist',
    humidity: 'Moderate humidity',
    pestRisk: 'Moderate',
    careNotes: ['This result is estimated from the PlantNet match and the computed health score.'],
  };
}

export function AnalysisResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysis, setAnalysis] = useState<PlantAnalysisRecord | null>(() => {
    const stateAnalysis = (location.state as ResultsLocationState | null | undefined)?.analysis;
    return stateAnalysis ?? loadLatestAnalysis();
  });

  useEffect(() => {
    const stateAnalysis = (location.state as ResultsLocationState | null | undefined)?.analysis;

    if (stateAnalysis) {
      saveLatestAnalysis(stateAnalysis);
      setAnalysis(stateAnalysis);
      return;
    }

    setAnalysis(loadLatestAnalysis());
  }, [location.state]);

  const statusLabel = useMemo(() => (analysis ? getPlantStatus(analysis.healthScore) : 'No analysis available'), [analysis]);
  const careInsights = useMemo(() => (analysis ? getCareInsights(analysis) : null), [analysis]);

  if (!analysis) {
    return (
      <PageContainer className="py-12">
        <EmptyState
          icon={Leaf}
          title="No analysis found"
          description="Upload a plant image to run the backend workflow and generate a results summary."
          actionLabel="Go to upload"
          onClick={() => navigate('/upload')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-8 pb-16 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-200">Analysis results</p>
          <h1 className="font-display text-4xl font-semibold text-cream sm:text-5xl">Backend analysis completed successfully.</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            The upload was analyzed by the backend, normalized, stored in MongoDB, and redirected here with the returned result.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-cream transition hover:border-leaf-400/30 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Analyze another plant
          </button>
          <button
            type="button"
            onClick={() => {
              clearLatestAnalysis();
              navigate('/history');
            }}
            className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-semibold text-brand-900 transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            View history
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard title="Plant image" className="overflow-hidden p-0">
          <div className="relative aspect-[4/3]">
            <img src={analysis.imageUrl} alt={analysis.commonName} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-full bg-slate-950/80 px-4 py-2 text-sm font-medium text-cream">
              {analysis.commonName}
            </div>
          </div>
        </DashboardCard>

        <div className="space-y-6">
          <DashboardCard title="Plant information">
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-slate-400">Common name</span>
                <span className="font-medium text-cream">{analysis.commonName}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-slate-400">Scientific name</span>
                <span className="font-medium text-cream">{analysis.scientificName}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-slate-400">Status</span>
                <span className="font-medium text-leaf-200">{statusLabel}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-slate-400">Analyzed</span>
                <span className="font-medium text-cream">{formatTimestamp(analysis.createdAt)}</span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Confidence and health">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Confidence score</p>
                    <p className="text-3xl font-bold text-cream">{analysis.confidence}%</p>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-leaf-400 to-brand-300" style={{ width: `${analysis.confidence}%` }} />
                </div>
              </div>
              <HealthScoreGauge score={analysis.healthScore} />
            </div>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard title="Care insights" action={<span className="text-sm text-slate-400">Estimated from analysis</span>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {careInsights
            ? [
                { label: 'Water', value: careInsights.waterNeed, icon: Droplets },
                { label: 'Sunlight', value: careInsights.sunlightNeed, icon: SunMedium },
                { label: 'Soil temp', value: careInsights.soilTemperature, icon: ThermometerSun },
                { label: 'Leaf condition', value: careInsights.leafCondition, icon: Leaf },
                { label: 'Soil moisture', value: careInsights.soilMoisture, icon: Wind },
                { label: 'Humidity', value: careInsights.humidity, icon: Sparkles },
                { label: 'Pest risk', value: careInsights.pestRisk, icon: ShieldAlert },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-cream">{item.value}</p>
                  </div>
                );
              })
            : null}
        </div>
      </DashboardCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardCard title="Analysis summary">
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>
              The backend returned a normalized analysis payload with the top PlantNet match, confidence score, a health
              estimate, and estimated care guidance that is now stored in MongoDB.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold text-cream">
                  <Sparkles className="h-4 w-4 text-leaf-300" />
                  Normalized data
                </div>
                <p>Clean frontend-ready fields for common and scientific names.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold text-cream">
                  <ThermometerSun className="h-4 w-4 text-leaf-300" />
                  Health context
                </div>
                <p>Score and recommendations are derived from the PlantNet confidence level.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold text-cream">
                <Droplets className="h-4 w-4 text-leaf-300" />
                Care profile
              </div>
              <p>Water, sunlight, soil temperature, humidity, and leaf condition are estimated from the scan result.</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Recommendations">
          <div className="space-y-3">
            {analysis.recommendations.map((recommendation) => (
              <div key={recommendation} className="flex gap-3 rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-leaf-300" />
                <p className="leading-6">{recommendation}</p>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {careInsights ? (
        <DashboardCard title="Quick care notes" action={<span className="text-sm text-slate-400">Actionable</span>}>
          <div className="space-y-3 text-sm leading-6 text-slate-300">
            {careInsights.careNotes.map((note) => (
              <div key={note} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                {note}
              </div>
            ))}
          </div>
        </DashboardCard>
      ) : null}
    </PageContainer>
  );
}
