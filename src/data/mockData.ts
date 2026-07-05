import {
  BarChart3,
  Bell,
  ClipboardList,
  Leaf,
  ScanSearch,
  ShieldCheck,
  Sprout,
  SunMedium,
  TrendingUp,
  TreePine,
  Wind,
} from 'lucide-react';

export type FeatureItem = {
  title: string;
  description: string;
  icon: typeof Sprout;
};

export type StatisticItem = {
  label: string;
  value: string;
  detail: string;
  icon: typeof TrendingUp;
};

export type AnalysisItem = {
  id: string;
  plantName: string;
  species: string;
  status: string;
  healthScore: number;
  confidence: number;
  date: string;
  image: string;
  notes: string;
  recommendation: string;
};

export type TrendPoint = {
  label: string;
  value: number;
};

export const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Upload', to: '/upload' },
  { label: 'Results', to: '/results' },
  { label: 'History', to: '/history' },
];

export const features: FeatureItem[] = [
  {
    title: 'Instant plant insights',
    description: 'Polished upload flow with clear status cards, progress states, and a premium analysis experience.',
    icon: ScanSearch,
  },
  {
    title: 'Health-focused scoring',
    description: 'Circular health summaries, confidence indicators, and actionable recommendations at a glance.',
    icon: ShieldCheck,
  },
  {
    title: 'Beautiful analytics',
    description: 'A dashboard-first design with trend cards, summaries, and recent activity built for presentation.',
    icon: BarChart3,
  },
  {
    title: 'Nature-inspired UI',
    description: 'Dark SaaS styling balanced with soft greens, organic gradients, and calm motion throughout.',
    icon: Leaf,
  },
];

export const statistics: StatisticItem[] = [
  {
    label: 'Total plants scanned',
    value: '12.4k',
    detail: '+18% this month',
    icon: TrendingUp,
  },
  {
    label: 'Total healthy plants',
    value: '91%',
    detail: 'Across recent scans',
    icon: SunMedium,
  },
  {
    label: 'Alerts resolved',
    value: '483',
    detail: 'Issues tracked end-to-end',
    icon: Bell,
  },
  {
    label: 'Total care streak',
    value: '27 days',
    detail: 'Consistent monitoring',
    icon: Wind,
  },
];

export const dashboardMetrics = [
  { label: 'Scans this week', value: '246', delta: '+12%' },
  { label: 'Healthy plants', value: '87%', delta: '+4%' },
  { label: 'Needs attention', value: '18', delta: '-6%' },
  { label: 'Avg confidence', value: '94%', delta: '+2%' },
];

export const trendData: TrendPoint[] = [
  { label: 'Mon', value: 48 },
  { label: 'Tue', value: 56 },
  { label: 'Wed', value: 44 },
  { label: 'Thu', value: 72 },
  { label: 'Fri', value: 68 },
  { label: 'Sat', value: 82 },
  { label: 'Sun', value: 76 },
];

export const recentAnalyses: AnalysisItem[] = [
  {
    id: '1',
    plantName: 'Monstera Delilah',
    species: 'Monstera deliciosa',
    status: 'Healthy',
    healthScore: 92,
    confidence: 97,
    date: 'Today · 10:42 AM',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    notes: 'Strong color, fresh leaf growth, and no visible spotting.',
    recommendation: 'Maintain weekly rotation and moderate indirect light.',
  },
  {
    id: '2',
    plantName: 'Golden Pothos',
    species: 'Epipremnum aureum',
    status: 'Attention needed',
    healthScore: 74,
    confidence: 93,
    date: 'Yesterday · 4:18 PM',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80',
    notes: 'Slight leaf curl and reduced sheen indicate mild stress.',
    recommendation: 'Reduce watering frequency and inspect drainage holes.',
  },
  {
    id: '3',
    plantName: 'Bird of Paradise',
    species: 'Strelitzia reginae',
    status: 'Healthy',
    healthScore: 88,
    confidence: 95,
    date: 'Yesterday · 9:07 AM',
    image: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1200&q=80',
    notes: 'Leaf posture is strong and new growth is visible.',
    recommendation: 'Continue bright-light placement and balanced feeding.',
  },
  {
    id: '4',
    plantName: 'Fiddle Leaf Fig',
    species: 'Ficus lyrata',
    status: 'Monitoring',
    healthScore: 81,
    confidence: 91,
    date: 'Mon · 2:15 PM',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    notes: 'Small edge browning suggests inconsistent moisture levels.',
    recommendation: 'Stabilize the watering cadence and increase airflow.',
  },
];

export const featuredPlantCards = [
  {
    title: 'Health trends',
    description: 'Track the overall condition of your plant collection over time.',
    icon: TreePine,
  },
  {
    title: 'Care reminders',
    description: 'Keep watering, rotation, and light checks on a dependable schedule.',
    icon: ClipboardList,
  },
  {
    title: 'Early alerts',
    description: 'Spot stress indicators before they become visible to the casual eye.',
    icon: Bell,
  },
];