import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { PageContainer } from '../components/PageContainer';
import { fetchRecentAnalyses } from '../services/analysisApi';
import type { PlantAnalysisRecord } from '../types/analysis';
import { Filter, Search, Sprout } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function HistoryPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [analyses, setAnalyses] = useState<PlantAnalysisRecord[]>([]);
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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-200">History</p>
        <h1 className="font-display text-4xl font-semibold text-cream sm:text-5xl">Browse prior analyses with a clean searchable archive.</h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-300">
          This archive is scoped to your account, so you only see analyses that belong to the signed-in user.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 shadow-soft">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by plant name, species, or status"
            className="w-full bg-transparent text-sm text-cream outline-none placeholder:text-slate-500"
          />
        </label>
        <label className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 shadow-soft">
          <Filter className="h-5 w-5 text-slate-400" />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="w-full bg-transparent text-sm text-cream outline-none"
          >
            <option value="all">All statuses</option>
            <option value="healthy">Healthy</option>
            <option value="attention">Attention needed</option>
            <option value="monitoring">Monitoring</option>
          </select>
        </label>
      </div>

      {error ? <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">{error}</div> : null}

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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAnalyses.map((analysis) => (
            <article key={analysis.id} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-leaf-400/30">
              <div className="relative h-48 overflow-hidden">
                <img src={analysis.imageUrl} alt={analysis.commonName} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cream">
                  {getStatusLabel(analysis.healthScore)}
                </span>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-xl font-semibold text-cream">{analysis.commonName}</h3>
                  <p className="mt-1 text-sm text-slate-400">{analysis.scientificName}</p>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-slate-300">{analysis.recommendations[0] || 'Private analysis stored for your account.'}</p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5">{analysis.healthScore}% health</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5">{analysis.confidence}% confidence</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5">{new Date(analysis.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </article>
          ))}
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