import { FeatureCard } from '../components/FeatureCard';
import { BotanicalImage } from '../components/BotanicalImage';
import { PageContainer } from '../components/PageContainer';
import { StatisticCard } from '../components/StatisticCard';
import { featuredPlantCards, features, statistics } from '../data/mockData';
import { ArrowRight, PlayCircle, Sparkles, SunMedium } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="space-y-16 overflow-hidden pb-16 pt-6 sm:space-y-20 sm:pt-10">
      <section>
        <PageContainer className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="reveal-up space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-leaf-300/20 bg-leaf-400/10 px-4 py-2 text-sm font-medium text-leaf-200">
              {/* <Sparkles className="h-4 w-4" /> */}
              AI-powered plant monitoring dashboard
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl font-display text-5xl font-semibold leading-tight text-cream sm:text-6xl lg:text-7xl">
                A little more life in every leaf.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                See what your plants are telling you. Plant Pulse turns one simple photo into a calmer, clearer care routine.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/upload"
                className="meadow-button inline-flex items-center gap-2 rounded-full bg-[#347c70] px-6 py-3.5 text-sm font-semibold text-white"
              >
                Start scanning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="meadow-button-secondary inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold"
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

          <div className="reveal-up relative pt-4 lg:pt-12">
            <div className="absolute -inset-8 rounded-[3rem] bg-hero-glow blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#dfe5d9] bg-[#fffdf7] p-3 shadow-soft">
              <div className="relative h-[28rem] overflow-hidden rounded-[2rem] sm:h-[34rem]">
                <img
                  src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=90"
                  alt="Lush green leaves glowing in soft natural light"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = '/plant.png';
                  }}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#173a36]/80 via-transparent to-transparent" />
                <div className="float-gently absolute right-5 top-5 rounded-full bg-[#fffdf7]/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#347c70] shadow-lg">
                  In tune with nature
                </div>
                <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/30 bg-[#fffdf7]/90 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#708079]">Plant Pulse method</p>
                      <h2 className="mt-2 font-display text-2xl font-semibold text-[#20312f]">Notice. Nurture. Flourish.</h2>
                    </div>
                    <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#e9b949]/20 text-[#a16f08] sm:flex">
                      <SunMedium className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 p-3 sm:grid-cols-3">
                {featuredPlantCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.title} className="meadow-card rounded-2xl p-4">
                      <Icon className="h-5 w-5 text-[#347c70]" />
                      <h3 className="mt-3 font-semibold text-cream">{card.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{card.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section>
        <PageContainer>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-200">A closer look</p>
              <h2 className="text-3xl font-semibold text-cream sm:text-4xl">Small observations lead to healthier plants.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Spot the details, understand the signals, and make every corner of your home feel a little greener.
            </p>
          </div>
          <div className="rounded-[2.5rem] border border-[#dfe5d9] bg-[#fffdf7] p-3 shadow-soft sm:p-4">
            <div className="grid gap-4 md:grid-cols-3">
            <BotanicalImage
              alt="Fiddle leaf fig standing in a sunlit room"
              aspectClassName="aspect-[4/5]"
              label="Observe"
              src="https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            />
            <BotanicalImage
              alt="Monstera plant with dramatic split leaves"
              aspectClassName="aspect-[4/5]"
              label="Understand"
              src="https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            />
            <BotanicalImage
              alt="Trailing plant cascading from a ceramic planter"
              aspectClassName="aspect-[4/5]"
              label="Flourish"
              src="https://plus.unsplash.com/premium_photo-1674237276501-595398f90f87?q=80&w=723&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            />
            </div>
          </div>
        </PageContainer>
      </section>

      <section>
        <PageContainer>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-200">Bring nature home</p>
              <h2 className="text-3xl font-semibold text-cream sm:text-4xl">A calmer space starts with a little green.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Build a care ritual that feels as good as your plants look, from the first sprout to every new leaf.
            </p>
          </div>
          <div className="overflow-hidden rounded-[2.75rem] bg-[#20312f] p-3 shadow-[0_24px_70px_rgba(32,49,47,0.18)] sm:p-4">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
            <BotanicalImage
              alt="Tropical leaves catching warm sunlight"
              aspectClassName="aspect-[4/5] lg:aspect-auto"
              className="rounded-[2rem] border-[#e9b949]/30 bg-[#284842] p-1 shadow-none lg:col-span-5"
              draggable
              fill
              label="Breathe"
              src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              <BotanicalImage
                alt="Small houseplant in a bright minimalist interior"
                aspectClassName="aspect-[4/5]"
                className="rounded-[2rem] border-[#e9b949]/30 bg-[#284842] p-1 shadow-none"
                draggable
                label="Ground"
                src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85"
              />
              <BotanicalImage
                alt="Calathea leaves with soft patterned details"
                aspectClassName="aspect-[4/5]"
                className="rounded-[2rem] border-[#e9b949]/30 bg-[#284842] p-1 shadow-none"
                draggable
                label="Notice"
                src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=85"
              />
              <BotanicalImage
                alt="Lush plant leaves beside a sunlit window"
                aspectClassName="aspect-[10/4]"
                className="rounded-[2rem] border-[#e9b949]/30 bg-[#284842] p-1 shadow-none sm:col-span-2"
                draggable
                label="Grow"
                src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1200&q=85"
              />
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