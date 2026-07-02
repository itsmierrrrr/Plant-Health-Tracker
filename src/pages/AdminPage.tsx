import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { PageContainer } from '../components/PageContainer';
import { fetchAdminOverview } from '../services/adminApi';
import type { AdminAnalysis, AdminUser } from '../types/admin';
import { cn } from '../utils/cn';
import { ImageIcon, Shield, Sparkles, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

function getHealthLabel(healthScore: number) {
  if (healthScore >= 85) {
    return 'Healthy';
  }

  if (healthScore >= 65) {
    return 'Monitoring';
  }

  return 'Attention';
}

function summarizeUsers(users: AdminUser[]) {
  return {
    totalUsers: users.length,
    totalAnalyses: users.reduce((total, user) => total + user.analysisCount, 0),
    activeUsers: users.filter((user) => user.analysisCount > 0).length,
  };
}

export function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [analyses, setAnalyses] = useState<AdminAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadOverview() {
      try {
        const overview = await fetchAdminOverview();
        if (!mounted) {
          return;
        }

        setUsers(overview.users);
        setAnalyses(overview.analyses);
        setError(null);
      } catch {
        if (!mounted) {
          return;
        }

        setError('Unable to load admin data right now.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      mounted = false;
    };
  }, []);

  const summary = useMemo(() => summarizeUsers(users), [users]);

  return (
    <PageContainer className="space-y-8 pb-16 pt-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-200">Admin Panel</p>
        <h1 className="font-display text-4xl font-semibold text-cream sm:text-5xl">Plant Results</h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-300">
          View every registered user and their uploaded plant images in one private admin workspace.
        </p>
      </div>

      {error ? <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">{error}</div> : null}

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { label: 'Users', value: summary.totalUsers, icon: Users },
          { label: 'Analyses', value: summary.totalAnalyses, icon: ImageIcon },
          { label: 'Active users', value: summary.activeUsers, icon: Shield },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-soft">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-cream">{item.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-cream">Users</h2>
              <p className="mt-1 text-sm text-slate-400">All registered accounts with analysis counts.</p>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <>
                <LoadingSkeleton className="h-20 w-full rounded-2xl" />
                <LoadingSkeleton className="h-20 w-full rounded-2xl" />
                <LoadingSkeleton className="h-20 w-full rounded-2xl" />
              </>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-cream">{user.name}</p>
                      <p className="text-slate-400">{user.email}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-cream">{user.analysisCount} results</span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No users found"
                description="User accounts will appear here after registration."
              />
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-cream">Plant results</h2>
              <p className="mt-1 text-sm text-slate-400">Uploaded images and normalized analysis details.</p>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <>
                <LoadingSkeleton className="h-40 w-full rounded-3xl" />
                <LoadingSkeleton className="h-40 w-full rounded-3xl" />
              </>
            ) : analyses.length > 0 ? (
              analyses.map((analysis) => (
                <article key={analysis.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <div className="grid gap-4 p-4 md:grid-cols-[160px_1fr]">
                    <div className="h-40 overflow-hidden rounded-2xl bg-slate-900">
                      <img src={analysis.imageUrl} alt={analysis.commonName} className="h-full w-full object-cover" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-cream">{analysis.commonName}</p>
                          <p className="text-sm text-slate-400">{analysis.scientificName}</p>
                        </div>
                        <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', analysis.healthScore >= 85 ? 'bg-leaf-400/15 text-leaf-200' : analysis.healthScore >= 65 ? 'bg-brand-400/15 text-brand-200' : 'bg-amber-400/15 text-amber-200')}>
                          {getHealthLabel(analysis.healthScore)}
                        </span>
                      </div>

                      <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                        <p><span className="text-slate-500">Owner:</span> {analysis.user?.name || 'Unknown'}</p>
                        <p><span className="text-slate-500">Email:</span> {analysis.user?.email || 'Unknown'}</p>
                        <p><span className="text-slate-500">Confidence:</span> {analysis.confidence}%</p>
                        <p><span className="text-slate-500">Health:</span> {analysis.healthScore}%</p>
                      </div>

                      <div className="text-sm text-slate-400">
                        <p className="font-medium text-cream">Recommendations</p>
                        <p className="mt-1 leading-6">{analysis.recommendations[0] || 'No recommendations available.'}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState
                icon={ImageIcon}
                title="No plant results found"
                description="Plant analyses will appear here after users upload images."
              />
            )}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}