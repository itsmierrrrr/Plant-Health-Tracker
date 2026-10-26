import { DashboardCard } from '../components/DashboardCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { PageContainer } from '../components/PageContainer';
import { fetchRecentAnalyses } from '../services/analysisApi';
import type { PlantAnalysisRecord } from '../types/analysis';
import { cn } from '../utils/cn';
import { BadgeCheck, CalendarDays, Droplets, Filter, Image as ImageIcon, Search, ShieldAlert, Sprout, SunMedium, ThermometerSun, Wind } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BotanicalImage } from '../components/BotanicalImage';
import { ResponsiveImage } from '../components/ResponsiveImage';

function getStatusLabel(healthScore: number) {
  if (healthScore >= 85) {
    return 'Healthy';
  }

  if (healthScore >= 65) {
    return 'Monitoring';
  }

  return 'Attention needed';
}

function getStatusTone(healthScore: number) {
  if (healthScore >= 85) {
    return 'text-[#347c70] bg-[#e8f3ef]';
  }

  if (healthScore >= 65) {
    return 'text-[#28685e] bg-[#eef8f5]';
  }

  return 'text-amber-200 bg-amber-400/15';
}

function getFallbackCareInsights() {
  return {
    waterNeed: 'Moderate watering',
    sunlightNeed: 'Bright indirect light',
    soilTemperature: '18-24°C',
    leafCondition: 'Condition inferred from the scan',
    soilMoisture: 'Evenly moist',
    humidity: 'Moderate humidity',
    pestRisk: 'Moderate',
    careNotes: ['This care profile is estimated from PlantNet identification and detailed analysis.'],
  };
}

export function HistoryPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [analyses, setAnalyses] = useState<PlantAnalysisRecord[]>([]);
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
        setError('Unable to load your analysis history right now.');
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

  const filteredAnalyses = useMemo(() => {
    return analyses.filter((analysis) => {
      const matchesQuery = [analysis.commonName, analysis.scientificName, ...analysis.recommendations].some((value) =>
        value.toLowerCase().includes(query.toLowerCase())
      );
      const healthLabel = analysis.healthScore >= 85 ? 'healthy' : analysis.healthScore >= 65 ? 'monitoring' : 'attention';
      const matchesFilter = filter === 'all' || healthLabel.includes(filter);
      return matchesQuery && matchesFilter;
    });
  }, [analyses, filter, query]);

  useEffect(() => {
    if (filteredAnalyses.length === 0) {
      return;
    }

    if (!filteredAnalyses.some((analysis) => analysis.id === selectedAnalysisId)) {
      setSelectedAnalysisId(filteredAnalyses[0].id);
    }
  }, [filteredAnalyses, selectedAnalysisId]);

  const selectedAnalysis = useMemo(
    () => filteredAnalyses.find((analysis) => analysis.id === selectedAnalysisId) ?? filteredAnalyses[0] ?? null,
    [filteredAnalyses, selectedAnalysisId]
  );
  const selectedCareInsights = useMemo(() => {
    if (!selectedAnalysis) {
      return null;
    }

    return selectedAnalysis.careInsights ?? getFallbackCareInsights();
  }, [selectedAnalysis]);

  const summary = useMemo(() => {
    const healthy = analyses.filter((analysis) => analysis.healthScore >= 85).length;
    const monitoring = analyses.filter((analysis) => analysis.healthScore >= 65 && analysis.healthScore < 85).length;
    const attention = analyses.filter((analysis) => analysis.healthScore < 65).length;

    return {
      total: analyses.length,
      healthy,
      monitoring,
      attention,
    };
  }, [analyses]);

  function getStatusLabel(healthScore: number) {
    if (healthScore >= 85) {
      return 'Healthy';
    }

    if (healthScore >= 65) {
      return 'Monitoring';
    }

    return 'Attention needed';
  }

  return (
    <PageContainer className="space-y-8 pb-16 pt-8">
      <div className="max-w-3xl space-y-4">
        <BotanicalImage
          alt="Green leaves layered in natural light"
          label="Your growing story"
          className="max-w-none"
          aspectClassName="aspect-[3/1]"
          src="/plant.png"
        />
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#347c70]">History</p>
        <h1 className="font-display text-4xl font-semibold text-[#20312f] sm:text-5xl">Browse your plant results history.</h1>
        <p className="max-w-2xl text-lg leading-8 text-[#526460]">
          This archive is scoped to your account, so you only see analyses that belong to the signed-in user.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total analyses', value: summary.total, icon: ImageIcon },
          { label: 'Healthy', value: summary.healthy, icon: BadgeCheck },
          { label: 'Monitoring', value: summary.monitoring, icon: ThermometerSun },
          { label: 'Attention needed', value: summary.attention, icon: CalendarDays },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-3xl border border-[#dfe5d9] bg-[#fffdf7] p-5 shadow-soft">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f3ef] text-[#347c70]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-[#708079]">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-[#20312f]">{item.value}</p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-3xl border border-[#dfe5d9] bg-[#fffdf7] px-5 py-4 shadow-soft">
          <Search className="h-5 w-5 text-[#708079]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by plant name, species, or status"
            className="w-full bg-transparent text-sm text-[#20312f] outline-none placeholder:text-[#8a9890]"
          />
        </label>
        <label className="flex items-center gap-3 rounded-3xl border border-[#dfe5d9] bg-[#fffdf7] px-5 py-4 shadow-soft">
          <Filter className="h-5 w-5 text-[#708079]" />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="w-full bg-transparent text-sm text-[#20312f] outline-none"
          >
            <option value="all">All statuses</option>
            <option value="healthy">Healthy</option>
            <option value="attention">Attention needed</option>
            <option value="monitoring">Monitoring</option>
          </select>
        </label>
      </div>

      {error ? <div className="rounded-3xl border border-amber-400/20 bg-[#fff3d4] px-5 py-4 text-sm text-[#7a5200]">{error}</div> : null}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <LoadingSkeleton className="h-72 w-full rounded-3xl" />
          <LoadingSkeleton className="h-72 w-full rounded-3xl" />
          <LoadingSkeleton className="h-72 w-full rounded-3xl" />
        </div>
      ) : analyses.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No analyses yet"
          description="Upload your first plant image to start building a private analysis history."
          actionLabel="Go to upload"
          onClick={() => navigate('/upload')}
        />
      ) : filteredAnalyses.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-2">
            {filteredAnalyses.map((analysis) => {
              const isSelected = analysis.id === selectedAnalysis?.id;

              return (
                <button
                  key={analysis.id}
                  type="button"
                  onClick={() => setSelectedAnalysisId(analysis.id)}
                  className={cn(
                    'flex h-full flex-col overflow-hidden rounded-3xl border bg-[#fffdf7] text-left shadow-soft transition duration-300 hover:-translate-y-1 hover:border-leaf-400/30',
                    isSelected ? 'border-leaf-400/50 ring-1 ring-leaf-400/30' : 'border-[#dfe5d9]'
                  )}
                >
                  <div className="relative h-48 shrink-0 overflow-hidden">
                    <ResponsiveImage src={analysis.imageUrl} alt={analysis.commonName} sizes="(min-width: 1280px) 30vw, 100vw" className="transition duration-500 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#173a36]/75 via-[#173a36]/10 to-transparent" />
                    <span className={cn('absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]', getStatusTone(analysis.healthScore))}>
                      {getStatusLabel(analysis.healthScore)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col space-y-4 p-5">
                    <div>
                      <h3 className="text-xl font-semibold text-[#20312f]">{analysis.commonName}</h3>
                      <p className="mt-1 text-sm text-[#708079]">{analysis.scientificName}</p>
                    </div>
                    <p className="line-clamp-2 min-h-[3rem] text-sm leading-6 text-[#526460]">
                      {analysis.recommendations[0] || 'Private analysis stored for your account.'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#526460]">
                      {(() => {
                        const careInsights = analysis.careInsights ?? getFallbackCareInsights();

                        return [
                          { label: 'Water', value: careInsights.waterNeed },
                          { label: 'Sun', value: careInsights.sunlightNeed },
                        ].map((item) => (
                          <div key={item.label} className="rounded-2xl border border-[#dfe5d9] bg-[#f5f1e7] px-3 py-2">
                            <p className="uppercase tracking-[0.22em] text-[#8a9890]">{item.label}</p>
                            <p className="mt-1 font-medium text-[#20312f]">{item.value}</p>
                          </div>
                        ));
                      })()}
                    </div>
                    <div className="mt-auto flex flex-wrap gap-3 text-sm text-[#526460]">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f1e7] px-3 py-1.5">{analysis.healthScore}% health</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f1e7] px-3 py-1.5">{analysis.confidence}% confidence</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f1e7] px-3 py-1.5">{new Date(analysis.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <DashboardCard title="Plant result details" className="xl:sticky xl:top-24">
            {selectedAnalysis ? (
              <div className="space-y-5">
                <div className="overflow-hidden rounded-3xl border border-[#dfe5d9] bg-[#20312f]">
                  <ResponsiveImage src={selectedAnalysis.imageUrl} alt={selectedAnalysis.commonName} sizes="(min-width: 1280px) 40vw, 100vw" />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-[#20312f]">{selectedAnalysis.commonName}</h3>
                      <p className="text-sm text-[#708079]">{selectedAnalysis.scientificName}</p>
                    </div>
                    <span className={cn('rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]', getStatusTone(selectedAnalysis.healthScore))}>
                      {getStatusLabel(selectedAnalysis.healthScore)}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#dfe5d9] bg-[#f5f1e7] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-[#8a9890]">Health score</p>
                      <p className="mt-2 text-2xl font-bold text-[#20312f]">{selectedAnalysis.healthScore}%</p>
                    </div>
                    <div className="rounded-2xl border border-[#dfe5d9] bg-[#f5f1e7] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-[#8a9890]">Confidence</p>
                      <p className="mt-2 text-2xl font-bold text-[#20312f]">{selectedAnalysis.confidence}%</p>
                    </div>
                    <div className="rounded-2xl border border-[#dfe5d9] bg-[#f5f1e7] p-4 sm:col-span-2">
                      <p className="text-xs uppercase tracking-[0.22em] text-[#8a9890]">Analyzed on</p>
                      <p className="mt-2 text-sm font-medium text-[#20312f]">{new Date(selectedAnalysis.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-[#dfe5d9] bg-[#f5f1e7] p-4">
                    <p className="text-sm font-semibold text-[#20312f]">Recommendations</p>
                    <div className="space-y-2">
                      {selectedAnalysis.recommendations.length > 0 ? (
                        selectedAnalysis.recommendations.map((recommendation) => (
                          <div key={recommendation} className="rounded-2xl border border-[#dfe5d9] bg-[#f5f1e7] px-4 py-3 text-sm leading-6 text-[#526460]">
                            {recommendation}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#708079]">No recommendations available.</p>
                      )}
                    </div>
                  </div>

                  {selectedCareInsights ? (
                    <div className="space-y-3 rounded-3xl border border-[#dfe5d9] bg-[#f5f1e7] p-4">
                      <p className="text-sm font-semibold text-[#20312f]">Care insights</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#8a9890]">Water, sunlight, soil, and leaf guidance</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { label: 'Water', value: selectedCareInsights.waterNeed, icon: Droplets },
                          { label: 'Sunlight', value: selectedCareInsights.sunlightNeed, icon: SunMedium },
                          { label: 'Soil temp', value: selectedCareInsights.soilTemperature, icon: ThermometerSun },
                          { label: 'Leaf condition', value: selectedCareInsights.leafCondition, icon: Sprout },
                          { label: 'Soil moisture', value: selectedCareInsights.soilMoisture, icon: Wind },
                          { label: 'Humidity', value: selectedCareInsights.humidity, icon: BadgeCheck },
                          { label: 'Pest risk', value: selectedCareInsights.pestRisk, icon: ShieldAlert },
                        ].map((item) => {
                          const Icon = item.icon;

                          return (
                            <div key={item.label} className="rounded-2xl border border-[#dfe5d9] bg-[#f5f1e7] p-4">
                              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f3ef] text-[#347c70]">
                                <Icon className="h-5 w-5" />
                              </div>
                              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[#8a9890]">{item.label}</p>
                              <p className="mt-2 text-sm font-semibold text-[#20312f]">{item.value}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="space-y-2 text-sm leading-6 text-[#526460]">
                        {selectedCareInsights.careNotes.map((note) => (
                          <div key={note} className="rounded-2xl border border-[#dfe5d9] bg-[#f5f1e7] px-4 py-3">
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
                icon={ImageIcon}
                title="Select an analysis"
                description="Click any history card to inspect the full plant result details here."
              />
            )}
          </DashboardCard>
        </div>
      ) : (
        <EmptyState
          icon={Sprout}
          title="No matches found"
          description="Try a different search term or clear the selected filter to reveal your saved analyses."
          actionLabel="Reset filters"
          onClick={() => {
            setQuery('');
            setFilter('all');
          }}
        />
      )}
    </PageContainer>
  );
}