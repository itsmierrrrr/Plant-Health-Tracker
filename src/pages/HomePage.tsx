import { FeatureCard } from '../components/FeatureCard';
import { PageContainer } from '../components/PageContainer';
import { StatisticCard } from '../components/StatisticCard';
import { featuredPlantCards, features, statistics } from '../data/mockData';
import { ArrowRight, BarChart3, PlayCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="space-y-16 pb-16 pt-6 sm:space-y-20 sm:pt-10">
      <section>
        <PageContainer className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-leaf-300/20 bg-leaf-400/10 px-4 py-2 text-sm font-medium text-leaf-200">
              <Sparkles className="h-4 w-4" />
              AI-powered plant monitoring dashboard
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl lg:text-7xl">
                A modern way to track plant health with clarity and style.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Plant Lens simplifies plant care with accurate health assessments, growth tracking, and an elegant, and a seamless user experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-brand-900 transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                Start scanning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-cream transition hover:border-leaf-400/30 hover:bg-white/10"
              >
                <PlayCircle className="h-4 w-4 text-leaf-300" />
                View dashboard
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              {statistics.map((item) => (
                <StatisticCard key={item.label} {...item} />
              ))}
            </div>
          </div>

          <div className="relative pt-0" >
            <div className="absolute -inset-6 rounded-[2.5rem] bg-hero-glow blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] h-400 border top-0 border-white/10 bg-slate-950/80 p-6 shadow-soft ">
              <div className="flex items-center justify-between ">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400"></p>
                  <h6 className="mt-2 text-2xl font-bold text-cream">What's Inside</h6>
                </div>
                <div className="rounded-2xl bg-leaf-400/15 p-3 text-leaf-200">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-10 h-96 grid gap-100 sm:grid-cols-1">
                 
                <div className="space-y-4 rounded-3xl h-96 border border-white/10 bg-white/5 p-4">
                  {featuredPlantCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div key={card.title} className="flex gap-3 rounded-2xl bg-slate-950/60 p-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-cream">{card.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-400">{card.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section>
        <PageContainer>
          <div className="mb-8 flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-200">Features</p>
            <h2 className="text-3xl font-semibold text-cream sm:text-4xl">Everything feels polished from the first click.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </PageContainer>
      </section>
    </div>
  );
}