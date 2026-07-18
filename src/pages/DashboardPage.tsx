import { DashboardCard } from '../components/DashboardCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';
import { fetchRecentAnalyses } from '../services/analysisApi';
import type { PlantAnalysisRecord } from '../types/analysis';
import { cn } from '../utils/cn';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Activity, BarChart3, BadgeCheck, CalendarDays, Droplets, Leaf, ShieldAlert, Sparkles, Sprout, SunMedium, ThermometerSun, TrendingUp, Wind } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

type DashboardAnalysis = PlantAnalysisRecord;

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function getWeeklyLabels() {
  const labels: string[] = [];
  const formatter = new Intl.DateTimeFormat('en', { weekday: 'short' });

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    labels.push(formatter.format(date));
  }

  return labels;
}

function getMonthlyLabels() {
  const labels: string[] = [];
  const formatter = new Intl.DateTimeFormat('en', { month: 'short' });

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - index);
    labels.push(formatter.format(date));
  }

  return labels;
}

function aggregateWeeklyActivity(analyses: DashboardAnalysis[]) {
  const labels = getWeeklyLabels();
  const counts = new Array(labels.length).fill(0);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  analyses.forEach((analysis) => {
    const date = new Date(analysis.createdAt);
    if (Number.isNaN(date.getTime()) || date < startDate) {
      return;
    }

    const dayIndex = Math.floor((date.getTime() - startDate.getTime()) / 86400000);
    if (dayIndex >= 0 && dayIndex < counts.length) {
      counts[dayIndex] += 1;
    }
  });

  return { labels, counts };
}

function aggregateMonthlyActivity(analyses: DashboardAnalysis[]) {
  const labels = getMonthlyLabels();
  const counts = new Array(labels.length).fill(0);
  const monthKeys = labels.map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (labels.length - 1 - index));
    return `${date.getFullYear()}-${date.getMonth()}`;
  });

  analyses.forEach((analysis) => {
    const date = new Date(analysis.createdAt);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthIndex = monthKeys.indexOf(monthKey);
    if (monthIndex >= 0) {
      counts[monthIndex] += 1;
    }
  });

  return { labels, counts };
}

function normalizeScannedPlants(analyses: DashboardAnalysis[]) {
  const counts = new Map<string, number>();

  analyses.forEach((analysis) => {
    const label = analysis.commonName || 'Unknown plant';
    counts.set(label, (counts.get(label) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label, count }));
}

function buildDoughnutData(analyses: DashboardAnalysis[]) {
  const healthy = analyses.filter((analysis) => analysis.healthScore >= 85).length;
  const monitor = analyses.filter((analysis) => analysis.healthScore >= 65 && analysis.healthScore < 85).length;
  const attention = analyses.filter((analysis) => analysis.healthScore < 65).length;

  return {
    labels: ['Healthy', 'Monitor', 'Attention'],
    datasets: [
      {
        data: [healthy, monitor, attention],
        backgroundColor: ['#5db06a', '#5b88b2', '#f5b942'],
        borderWidth: 0,
      },
    ],
  };
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<DashboardAnalysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadAnalyses() {
      try {
        const fetchedAnalyses = await fetchRecentAnalyses();
        if (!mounted) {
          return;
        }

        setAnalyses(fetchedAnalyses);
        setSelectedAnalysisId((currentSelected) => currentSelected || fetchedAnalyses[0]?.id || null);
        setError(null);
      } catch {
        if (!mounted) {
          return;
        }

        setAnalyses([]);
        setError('Unable to load your analytics right now.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAnalyses();

    return () => {
      mounted = false;
    };
  }, []);

  const totalAnalyses = analyses.length;
  const averageHealthScore = analyses.length > 0 ? analyses.reduce((total, analysis) => total + analysis.healthScore, 0) / analyses.length : 0;
  const scannedPlants = useMemo(() => normalizeScannedPlants(analyses), [analyses]);
  const weeklyActivity = useMemo(() => aggregateWeeklyActivity(analyses), [analyses]);
  const monthlyActivity = useMemo(() => aggregateMonthlyActivity(analyses), [analyses]);
  const doughnutData = useMemo(() => buildDoughnutData(analyses), [analyses]);
  const selectedAnalysis = useMemo(
    () => analyses.find((analysis) => analysis.id === selectedAnalysisId) ?? analyses[0] ?? null,
    [analyses, selectedAnalysisId]
  );
  const selectedCareInsights = useMemo(() => {
    if (!selectedAnalysis) {
      return null;
    }

    return selectedAnalysis.careInsights ?? {
      waterNeed: 'Moderate watering',
      sunlightNeed: 'Bright indirect light',
      soilTemperature: '18-24°C',
      leafCondition: 'Condition inferred from the scan',
      soilMoisture: 'Evenly moist',
      humidity: 'Moderate humidity',
      pestRisk: 'Moderate',
      careNotes: ['This care profile is estimated from PlantNet identification and OpenRouter detailed analysis.'],
    };
  }, [selectedAnalysis]);

  const weeklyBarData = {
    labels: weeklyActivity.labels,
    datasets: [
      {
        label: 'Analyses',
        data: weeklyActivity.counts,
        backgroundColor: '#5db06a',
        borderRadius: 14,
      },
    ],
  };

  const monthlyLineData = {
    labels: monthlyActivity.labels,
    datasets: [
      {
        label: 'Monthly activity',
        data: monthlyActivity.counts,
        borderColor: '#5b88b2',
        backgroundColor: 'rgba(91, 136, 178, 0.24)',
        tension: 0.45,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          pointStyle: 'circle' as const,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
      y: {
        ticks: { color: '#94a3b8', precision: 0 },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          pointStyle: 'circle' as const,
        },
      },
    },
  };

  const hasAnalyses = analyses.length > 0;

  return (
    <PageContainer className="space-y-8 pb-16 pt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-200">Dashboard</p>
          <h1 className="font-display text-4xl font-semibold text-cream sm:text-5xl">Professional plant analytics dashboard.</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Track total analyses, average plant health, weekly and monthly activity, and your most scanned plants in a responsive SaaS-style analytics view.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-leaf-300/20 bg-leaf-400/10 px-4 py-2 text-sm font-medium text-leaf-100">
          <Activity className="h-4 w-4" />
          Live backend analytics
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">{error}</div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total analyses',
            value: String(totalAnalyses),
            detail: loading ? 'Loading data...' : 'Records from the backend',
            icon: BarChart3,
          },
          {
            label: 'Average health score',
            value: formatPercent(averageHealthScore),
            detail: loading ? 'Loading data...' : 'Collection-wide average',
            icon: TrendingUp,
          },
          {
            label: 'Healthy plants',
            value: String(analyses.filter((analysis) => analysis.healthScore >= 85).length),
            detail: loading ? 'Loading data...' : 'Scores above 85%',
            icon: Leaf,
          },
          {
            label: 'Needs attention',
            value: String(analyses.filter((analysis) => analysis.healthScore < 65).length),
            detail: loading ? 'Loading data...' : 'Scores below 65%',
            icon: Sparkles,
          },
        ].map((metric) => {
          const Icon = metric.icon;

          return (
            <div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                  <p className="mt-3 text-3xl font-bold text-cream">{metric.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{metric.detail}</p>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard title="Weekly activity" action={<span className="text-sm text-slate-400">Bar Chart</span>}>
          <div className="h-[22rem] rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            {loading ? (
              <LoadingSkeleton className="h-full w-full rounded-[1.25rem]" />
            ) : hasAnalyses ? (
              <Bar data={weeklyBarData} options={chartOptions} />
            ) : (
              <EmptyState icon={Sprout} title="No analyses yet" description="Upload your first plant image to populate dashboard charts and metrics." actionLabel="Go to upload" onClick={() => navigate('/upload')} />
            )}
          </div>
        </DashboardCard>

        <DashboardCard title="Health distribution" action={<span className="text-sm text-slate-400">Doughnut Chart</span>}>
          <div className="flex h-[22rem] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            {loading ? <LoadingSkeleton className="h-full w-full rounded-[1.25rem]" /> : hasAnalyses ? <Doughnut data={doughnutData} options={doughnutOptions} /> : <EmptyState icon={Sprout} title="No health data yet" description="Run an analysis to see healthy, monitor, and attention segments here." actionLabel="Upload plant" onClick={() => navigate('/upload')} />}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardCard title="Most scanned plants" action={<span className="text-sm text-slate-400">Top 5</span>}>
          <div className="space-y-4">
            {scannedPlants.length > 0 ? (
              scannedPlants.map((plant, index) => (
                <div key={plant.label} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                      <Leaf className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-cream">{plant.label}</p>
                      <p className="text-xs text-slate-500">Rank #{index + 1}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-leaf-400/10 px-3 py-1 text-xs font-semibold text-leaf-200">{plant.count} scans</span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">No scans yet.</div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard title="Monthly activity" action={<span className="text-sm text-slate-400">Line Chart</span>}>
          <div className="h-[22rem] rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            {loading ? <LoadingSkeleton className="h-full w-full rounded-[1.25rem]" /> : hasAnalyses ? <Line data={monthlyLineData} options={chartOptions} /> : <EmptyState icon={Sprout} title="No monthly activity yet" description="Once analyses exist, this chart will track your scan volume by month." actionLabel="Upload plant" onClick={() => navigate('/upload')} />}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardCard title="Recent analyses" action={<span className="text-sm text-slate-400">Live feed</span>}>
          <div className="space-y-4">
            {loading ? (
              <>
                <LoadingSkeleton className="h-28 w-full rounded-2xl" />
                <LoadingSkeleton className="h-28 w-full rounded-2xl" />
              </>
            ) : analyses.length === 0 ? (
              <EmptyState icon={Sprout} title="No private analyses yet" description="Upload a plant image to create your first authenticated record." actionLabel="Go to upload" onClick={() => navigate('/upload')} />
            ) : (
              analyses.slice(0, 3).map((analysis) => (
                <button
                  key={analysis.id}
                  type="button"
                  onClick={() => setSelectedAnalysisId(analysis.id)}
                  className={cn(
                    'w-full rounded-2xl border bg-white/5 p-4 text-left text-sm text-slate-300 transition hover:-translate-y-0.5 hover:border-leaf-400/30',
                    selectedAnalysis?.id === analysis.id ? 'border-leaf-400/50 ring-1 ring-leaf-400/20' : 'border-white/10'
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-cream">{analysis.commonName}</p>
                      <p className="text-slate-400">{analysis.scientificName}</p>
                    </div>
                    <span className="rounded-full bg-leaf-400/10 px-3 py-1 text-xs font-semibold text-leaf-200">{analysis.healthScore}%</span>
                  </div>
                  <p className="mt-3 leading-6 text-slate-400">
                    Confidence {analysis.confidence}% · {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </DashboardCard>

        <DashboardCard title="Full result details" action={<span className="text-sm text-slate-400">Selected analysis</span>}>
          {selectedAnalysis ? (
            <div className="space-y-5">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
                <img src={selectedAnalysis.imageUrl} alt={selectedAnalysis.commonName} className="h-64 w-full object-cover" />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-cream">{selectedAnalysis.commonName}</h3>
                    <p className="text-sm text-slate-400">{selectedAnalysis.scientificName}</p>
                  </div>
                  <span className="rounded-full bg-leaf-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-leaf-200">
                    {selectedAnalysis.healthScore >= 85 ? 'Healthy' : selectedAnalysis.healthScore >= 65 ? 'Monitoring' : 'Attention needed'}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Confidence</p>
                    <p className="mt-2 text-2xl font-bold text-cream">{selectedAnalysis.confidence}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Health score</p>
                    <p className="mt-2 text-2xl font-bold text-cream">{selectedAnalysis.healthScore}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Analyzed on</p>
                    <p className="mt-2 text-sm font-medium text-cream">{new Date(selectedAnalysis.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-cream">Recommendations</p>
                  <div className="space-y-2">
                    {selectedAnalysis.recommendations.length > 0 ? (
                      selectedAnalysis.recommendations.map((recommendation) => (
                        <div key={recommendation} className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-300">
                          {recommendation}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No recommendations available.</p>
                    )}
                  </div>
                </div>

                {selectedCareInsights ? (
                  <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-cream">Care insights</p>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {[
                        { label: 'Water', value: selectedCareInsights.waterNeed, icon: Droplets },
                        { label: 'Sunlight', value: selectedCareInsights.sunlightNeed, icon: SunMedium },
                        { label: 'Soil temp', value: selectedCareInsights.soilTemperature, icon: ThermometerSun },
                        { label: 'Leaf condition', value: selectedCareInsights.leafCondition, icon: Leaf },
                        { label: 'Soil moisture', value: selectedCareInsights.soilMoisture, icon: Wind },
                        { label: 'Humidity', value: selectedCareInsights.humidity, icon: Sparkles },
                        { label: 'Pest risk', value: selectedCareInsights.pestRisk, icon: ShieldAlert },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                              <Icon className="h-5 w-5" />
                            </div>
                            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                            <p className="mt-2 text-sm font-semibold text-cream">{item.value}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-2 text-sm leading-6 text-slate-300">
                      {selectedCareInsights.careNotes.map((note) => (
                        <div key={note} className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Sprout}
              title="No result selected"
              description="Choose a recent analysis to inspect the complete plant result here."
              actionLabel="Go to upload"
              onClick={() => navigate('/upload')}
            />
          )}
        </DashboardCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardCard title="Monthly comparison" action={<span className="text-sm text-slate-400">Overview</span>}>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Healthy', value: analyses.filter((analysis) => analysis.healthScore >= 85).length, tone: 'text-leaf-200' },
              { label: 'Monitor', value: analyses.filter((analysis) => analysis.healthScore >= 65 && analysis.healthScore < 85).length, tone: 'text-brand-200' },
              { label: 'Attention', value: analyses.filter((analysis) => analysis.healthScore < 65).length, tone: 'text-amber-200' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className={cn('text-sm font-medium uppercase tracking-[0.22em]', item.tone)}>{item.label}</p>
                <p className="mt-3 text-3xl font-bold text-cream">{item.value}</p>
                <p className="mt-2 text-sm text-slate-400">Across the current analytics dataset</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Result checklist" action={<span className="text-sm text-slate-400">Seen in dashboard</span>}>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Image preview', copy: 'View the exact uploaded plant image.', icon: Sprout },
              { label: 'Confidence', copy: 'Check the PlantNet match strength.', icon: BadgeCheck },
              { label: 'Health score', copy: 'See the derived plant health score.', icon: ThermometerSun },
              { label: 'Date analyzed', copy: 'Confirm when the scan was saved.', icon: CalendarDays },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-cream">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </section>
    </PageContainer>
  );
}