import type { ChartData, WidgetType, AudienceCardData, DataWidgetCardData, ProcessingStep, BenchmarkPanelData, AudienceDraftData } from '@/types';

// ─── Audience size ────────────────────────────────────────────────────────────

export function fakeAudienceSize(): number {
  return Math.floor(Math.random() * (5_000_000 - 1_000) + 1_000);
}

export function formatAudienceSize(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

// ─── Chart data ───────────────────────────────────────────────────────────────

// Seeded PRNG so the same widget shows the same numbers across navigations.
// generateChartData(seed) re-seeds before generating; refresh actions pass a
// different salt to get new data on purpose.

function hashString(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function mulberry32(a: number): () => number {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let rng: () => number = Math.random

function seedRng(seed?: string) {
  rng = seed ? mulberry32(hashString(seed)) : Math.random
}

const rand = (min: number, max: number) =>
  Math.floor(rng() * (max - min + 1)) + min;

// Maps Widget.breakdown IDs to DIMENSION_VALUES keys
const BREAKDOWN_LABELS: Record<string, string[]> = {
  age_group:      ['18-24', '25-34', '35-44', '45-54', '55+'],
  gender:         ['Male', 'Female', 'Non-binary'],
  income_bracket: ['<$25k', '$25–50k', '$50–100k', '$100k+'],
  country:        ['US', 'Germany', 'UK', 'France', 'Australia'],
  device_type:    ['Mobile', 'Desktop', 'Tablet', 'Smart TV'],
}

function barData(withBenchmark: boolean, breakdown?: string): ChartData {
  const labels: string[] = (breakdown ? BREAKDOWN_LABELS[breakdown] : undefined) ?? ['18-24', '25-34', '35-44', '45-54', '55+'];
  const series = [{ name: 'Audience', values: labels.map(() => rand(20, 85)) }];
  if (withBenchmark) series.push({ name: 'Benchmark', values: labels.map(() => rand(20, 85)) });
  return { labels, series };
}

function lineData(): ChartData {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return {
    labels,
    series: [{ name: 'Trend', values: labels.map((_, i) => rand(30, 40) + i * rand(1, 5)) }],
  };
}

function pieData(): ChartData {
  const labels = ['Mobile', 'Desktop', 'Tablet', 'Other'];
  return { labels, series: [{ name: 'Share', values: labels.map(() => rand(5, 50)) }] };
}

function scorecardData(withBenchmark: boolean): ChartData {
  const value = rand(30, 90);
  const series = [{ name: 'Score', values: [value] }];
  if (withBenchmark) series.push({ name: 'Benchmark', values: [rand(30, 90)] });
  return { labels: ['NPS'], series };
}

// Topic-specific statement batteries — keyed by survey category (primary lookup)
const CATEGORY_LABELS: Record<string, string[]> = {
  'Insurance': [
    'I could imagine managing my insurance exclusively online',
    'I trust my insurance provider to handle my claims fairly',
    "I'm willing to share behavioral data for lower premiums",
    "I'm concerned I may lack adequate coverage",
    'I regularly compare providers before renewing',
    'None of the above',
  ],
  'Health': [
    'I actively monitor my physical health metrics',
    'I prefer preventive care over reactive treatment',
    'I would share health data with my provider for better care',
    'I trust my healthcare provider\'s recommendations fully',
    "I feel well-informed about my health insurance options",
    'None of the above',
  ],
  'Finance': [
    'I actively track my monthly spending and budget',
    'I prefer digital banking over visiting a branch',
    'I feel confident making investment decisions independently',
    "I'm concerned about having enough savings for emergencies",
    'I would use AI-based financial advice tools',
    'None of the above',
  ],
  'Fashion': [
    "I'm willing to pay more for sustainable fashion brands",
    'I regularly buy clothing from online-only retailers',
    'Brand reputation significantly influences my clothing choices',
    'I tend to follow current fashion trends closely',
    'I prioritize quality over quantity when buying clothes',
    'None of the above',
  ],
  'Food & consumption': [
    'I actively look for organic or natural food products',
    "I'm willing to pay a premium for ethically sourced food",
    'I plan my meals in advance to reduce waste',
    'I frequently try new cuisines or food experiences',
    'Convenience is my main priority when buying food',
    'None of the above',
  ],
  'Travel': [
    'I prioritize sustainable travel options when possible',
    'I typically book travel arrangements 2+ months in advance',
    'I rely heavily on reviews before choosing accommodation',
    'I prefer independent travel over package tours',
    'I track travel costs closely to stay within budget',
    'None of the above',
  ],
  'AI & smart technology': [
    'I regularly use AI assistants in my daily routine',
    'I trust AI recommendations for product purchases',
    "I'm concerned about data privacy with smart devices",
    'Smart home devices have improved my quality of life',
    "I'd pay more for AI-enhanced products or services",
    'None of the above',
  ],
  'Consumer electronics': [
    'I typically upgrade my devices every 2–3 years',
    'Brand loyalty influences my electronics purchase decisions',
    'I research extensively before buying new electronics',
    'Repairability is an important factor when buying devices',
    'I own at least 3 connected devices for personal use',
    'None of the above',
  ],
  'Online shopping': [
    'I prefer buying online over visiting physical stores',
    'Free returns are essential when I shop online',
    'I rely on customer reviews before making online purchases',
    "I'm comfortable saving payment details on shopping platforms",
    'Same-day or next-day delivery influences my retailer choice',
    'None of the above',
  ],
  'Media & news': [
    'I consume most of my news through social media',
    'I pay for at least one premium news subscription',
    'I actively verify sources before sharing news content',
    'Traditional TV or radio is still my primary news source',
    'I feel overwhelmed by the volume of news available',
    'None of the above',
  ],
  'Social media & marketing': [
    'I follow brands or companies on social media',
    'Influencer recommendations have influenced my purchases',
    'I actively engage with ads by clicking or saving content',
    "I'm comfortable sharing personal interests with advertisers",
    "I've made a purchase directly through a social media platform",
    'None of the above',
  ],
  'Mobility': [
    'I would consider switching to an electric vehicle in 3 years',
    'Public transport is a reliable option in my area',
    'I prefer owning a car over car-sharing or rental services',
    'Fuel or charging cost is the main factor in my transport choice',
    'I actively try to reduce my transportation carbon footprint',
    'None of the above',
  ],
  'Internet & smartphone': [
    'I rely on my smartphone for most daily tasks',
    'I would struggle significantly without mobile internet access',
    "I'm concerned about screen time and digital wellbeing",
    'I regularly use my phone for banking or mobile payments',
    'My phone is my primary entertainment device',
    'None of the above',
  ],
  'Housing & household equipment': [
    "I'm satisfied with my current housing situation",
    'I would consider smart home technology for my household',
    'Energy efficiency is a key factor in my appliance choices',
    'I prefer renting over buying a home at this stage',
    'Home ownership is an important long-term financial goal',
    'None of the above',
  ],
  'Personal care': [
    'I research ingredients before buying personal care products',
    "I'm willing to pay more for cruelty-free or vegan products",
    'Brand trust matters more than price for personal care',
    "I've switched personal care brands in the past 12 months",
    'I prefer subscription boxes over buying products individually',
    'None of the above',
  ],
  'Retail shopping': [
    'I prefer shopping in physical stores over online',
    'Loyalty programmes significantly influence where I shop',
    'I actively look for promotions or discounts before purchasing',
    "I'm more likely to visit stores that offer click-and-collect",
    'Store atmosphere influences my in-store purchase decisions',
    'None of the above',
  ],
  'Video games': [
    'I play video games at least once a week',
    'I spend money on in-game purchases or subscriptions',
    'I follow gaming content creators or streamers regularly',
    'Multiplayer experiences matter more to me than single-player',
    'I consider myself part of a gaming community',
    'None of the above',
  ],
  'Print media & ePublishing': [
    'I regularly read printed newspapers or magazines',
    'I prefer eBooks over printed books for convenience',
    'I pay for at least one digital publication subscription',
    'I believe print media offers higher editorial quality than digital',
    "I've reduced my print media consumption in the past year",
    'None of the above',
  ],
  'Services & eServices': [
    'I currently subscribe to 3 or more digital services',
    'I regularly review and cancel unused subscriptions',
    'I prefer bundled services over individual subscriptions',
    "I'm comfortable paying monthly fees for software tools",
    'Free tiers are sufficient for most of my digital needs',
    'None of the above',
  ],
}

// Metric-level fallback when no category is known
const METRIC_LABELS: Record<string, string[]> = {
  ad_recall: [
    "I've seen this brand's ads in the past 4 weeks",
    'The ad made me think differently about the brand',
    'I remembered the key message of the ad',
    'I clicked on or engaged with the ad',
    'None of the above',
  ],
  brand_awareness: [
    'Yes, I currently use this brand',
    "I've purchased from this brand before",
    "I've considered it but not purchased",
    "I've only heard the name",
    "I've never heard of this brand",
  ],
  brand_affinity: [
    'This brand reflects my personal values',
    'I would actively recommend this brand to others',
    'I prefer this brand over its main competitors',
    'I trust this brand to consistently deliver quality',
    'I feel neutral about this brand',
  ],
  purchase_intent: [
    'Very likely to purchase in the next 3 months',
    'Likely to purchase in the next 6 months',
    'Might purchase if the price was right',
    "I'm still comparing options",
    'Not interested in purchasing',
  ],
  net_promoter_score: [
    'Promoters (score 9–10)',
    'Passives (score 7–8)',
    'Detractors (score 0–6)',
  ],
  category_penetration: [
    'Yes, I currently use this category',
    'I used to but no longer use it',
    "I'm actively considering trying it",
    "I'm aware but not interested",
    "I wasn't aware this existed",
  ],
}

const SURVEY_ANSWERS = ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never', "Don't know"]

// Ultimate fallback — frequency scale
const DEFAULT_SURVEY_LABELS = [
  'Daily',
  'Several times a week',
  'Once a week',
  'A few times a month',
  'Rarely or never',
  "Don't know / N/A",
]

function surveyTableData(metric?: string, category?: string): ChartData {
  const labels: string[] =
    (category ? CATEGORY_LABELS[category] : undefined) ??
    (metric ? METRIC_LABELS[metric] : undefined) ??
    DEFAULT_SURVEY_LABELS
  const raw = labels.map(() => rand(5, 40))
  const total = raw.reduce((a: number, b: number) => a + b, 0)
  const percents = raw.map((v: number) => Math.round((v * 100) / total))
  return { labels, series: [{ name: 'Percent', values: percents }] }
}

export const DIMENSION_VALUES: Record<string, string[]> = {
  'Gender': ['Male', 'Female', 'Non-binary'],
  'Age distribution': ['18-24', '25-34', '35-44', '45-54', '55+'],
  'Country of residence': ['US', 'Germany', 'UK', 'France'],
  'Income bracket': ['<$25k', '$25-50k', '$50-100k', '$100k+'],
  'Smartphone type & OS': ['Android', 'iOS', 'Other'],
  'Housing type': ['House', 'Apartment', 'Condo', 'Other'],
  'Car ownership status': ['Own', 'Lease', 'No car'],
  'Gaming platform': ['PC', 'Console', 'Mobile'],
  'Social media platforms used': ['Facebook', 'Instagram', 'TikTok', 'YouTube'],
  'Primary transport mode': ['Car', 'Public transit', 'Bicycle', 'Other'],
  'Health consciousness': ['Very', 'Somewhat', 'Neutral', 'Not very'],
  'Education level': ['Primary', 'Secondary', 'Tertiary', 'Postgraduate'],
}

const POP_SCALE = 22500 // respondents-to-population multiplier (fake)

function crosstableData(dimensionLabel: string, rowLabels?: string[], metric?: string, category?: string): ChartData {
  const answers: string[] = rowLabels ?? (category ? CATEGORY_LABELS[category] : undefined) ?? (metric ? METRIC_LABELS[metric] : undefined) ?? DEFAULT_SURVEY_LABELS.slice(0, 5)
  const dimensions = DIMENSION_VALUES[dimensionLabel] ?? ['Group A', 'Group B', 'Group C']

  const TOTAL_N = 8599
  const basePerGroup = Math.floor(TOTAL_N / dimensions.length)
  const groupNs = dimensions.map((_, i) =>
    i === dimensions.length - 1 ? TOTAL_N - basePerGroup * (dimensions.length - 1) : basePerGroup
  )

  const groupPercents = dimensions.map(() => answers.map(() => rand(5, 45)))

  const totalPercents = answers.map((_: string, ai: number) => {
    const weightedSum = groupPercents.reduce((sum: number, gp: number[], gi: number) => sum + gp[ai] * groupNs[gi], 0)
    return Math.round(weightedSum / TOTAL_N)
  })

  const series = dimensions.map((dim, gi) => {
    const groupN = groupNs[gi]
    const percents = groupPercents[gi]
    return {
      name: dim,
      values: percents,
      absolutes: percents.map((p: number) => Math.round((p * groupN) / 100)),
      populations: percents.map((p: number) => Math.round((p * groupN * POP_SCALE) / 1e8) / 10), // millions, 1dp
      indexValues: percents.map((p: number, ai: number) =>
        totalPercents[ai] > 0 ? Math.round((p / totalPercents[ai]) * 100) : 100
      ),
      baseN: groupN,
    }
  })

  return {
    labels: answers,
    series,
    totalSeries: {
      values: totalPercents,
      absolutes: totalPercents.map((p: number) => Math.round((p * TOTAL_N) / 100)),
      populations: totalPercents.map((p: number) => Math.round((p * TOTAL_N * POP_SCALE) / 1e8) / 10),
      baseN: TOTAL_N,
    },
  }
}

/** Generate a cross-tab section for an extra row attribute (uses its dimension values as row labels) */
export function generateCrosstabRowData(rowAttr: string, colAttr: string, seed?: string, metric?: string, category?: string): ChartData {
  seedRng(seed ? `${seed}:${rowAttr}:${colAttr}` : undefined)
  const rowLabels = DIMENSION_VALUES[rowAttr] ?? (category && CATEGORY_LABELS[category]) ?? (metric && METRIC_LABELS[metric]) ?? DEFAULT_SURVEY_LABELS.slice(0, 5)
  return crosstableData(colAttr, rowLabels, metric, category)
}

/** Generate a simple (non-cross-tab) table for an extra row attribute */
export function generateTableRowData(rowAttr: string, seed?: string): ChartData {
  seedRng(seed ? `${seed}:${rowAttr}` : undefined)
  const labels: string[] = DIMENSION_VALUES[rowAttr] ?? SURVEY_ANSWERS.slice(0, 5)
  const raw = labels.map(() => rand(5, 40))
  const total = raw.reduce((s: number, v: number) => s + v, 0)
  const percents = raw.map((v: number) => Math.round((v / total) * 100))
  return { labels, series: [{ name: 'Percent', values: percents }] }
}

export function generateChartData(
  type: WidgetType,
  hasBenchmark: boolean,
  crossDimensionLabel?: string,
  seed?: string,
  metric?: string,
  breakdown?: string,
  category?: string,
): ChartData {
  seedRng(seed ? `${seed}:${type}:${crossDimensionLabel ?? ''}` : undefined)
  if (type === 'table' && crossDimensionLabel) return crosstableData(crossDimensionLabel, undefined, metric, category)
  switch (type) {
    case 'bar':       return barData(hasBenchmark, breakdown)
    case 'line':      return lineData()
    case 'pie':       return pieData()
    case 'scorecard': return scorecardData(hasBenchmark)
    case 'table':     return surveyTableData(metric, category)
    default:          return surveyTableData(metric, category)
  }
}

// ─── EV Demo scenario ─────────────────────────────────────────────────────────

export function isEVTrigger(text: string): boolean {
  return /\bev\b|electric.?vehicle|electric.?car|who.*buy.*germany|ev.*germany|germany.*ev/i.test(text)
}

export const EV_PROCESSING_STEPS: Omit<ProcessingStep, 'status'>[] = [
  { label: 'Parsing intent',       value: '"Who intends to buy EVs in Germany?"' },
  { label: 'Topic',                value: 'Automotive · Electric Vehicles' },
  { label: 'Region',               value: 'Germany (DE)' },
  { label: 'Location scope',       value: 'National' },
  { label: 'Survey waves',         value: 'Jan 2025 · Apr 2025 · Jul 2025 · Oct 2025 · Jan 2026' },
  { label: 'Respondents',          value: 'n = 4,187 (internet users 18–64)' },
  { label: 'Demographics',         value: 'Age · Gender · Income · Education · HH size' },
  { label: 'Metric',               value: 'Purchase intent — "plan to buy an EV in next 12 months"' },
  { label: 'Intent threshold',     value: '> 20% to qualify segment' },
  { label: 'Identifying segments', value: 'Scanning 40+ demographic cuts…' },
  { label: 'Segments found',       value: '3 audience groups above threshold' },
  { label: 'Benchmarking',         value: 'Scoring segments on intent × reach × ability to pay…' },
  { label: 'Best match selected',  value: 'Urban Tech Professionals (score: 91/100)' },
]

export const EV_AI_TEXT =
  'Based on Consumer Insights data for Germany (2025–2026, n = 4,187), three audience segments show meaningful EV purchase intent. The strongest signal comes from **Urban Tech Professionals** — they index highest on both intent and ability to pay, making them the most actionable starting point.'

export const EV_BENCHMARK_PANEL: BenchmarkPanelData = {
  nudge: 'Want to activate this audience? I can pre-fill it from the benchmark data.',
  segments: [
    {
      name: 'Urban Tech Professionals',
      ageRange: '25–40',
      descriptor: 'High-income urban, early adopter mindset',
      intentScore: 64,
      universe: '2.1M',
      isBestMatch: true,
    },
    {
      name: 'Eco-Conscious Families',
      ageRange: '35–52',
      descriptor: 'Suburban, sustainability-driven, mid-high income',
      intentScore: 41,
      universe: '3.8M',
      isBestMatch: false,
    },
    {
      name: 'Green Premium Buyers',
      ageRange: '45–60',
      descriptor: 'High income, sustainability & status motivated',
      intentScore: 38,
      universe: '1.4M',
      isBestMatch: false,
    },
  ],
}

export const EV_WIDGET_CLUSTER: DataWidgetCardData[] = [
  {
    title: 'EV Purchase Intent by Segment',
    subtitle: 'Germany · Consumer Insights 2025–2026',
    chartType: 'bar',
    chartData: {
      labels: ['Urban Tech Pros', 'Eco-Conscious Families', 'Green Premium Buyers'],
      series: [
        { name: 'Purchase intent %', values: [64, 41, 38] },
        { name: 'DE Market avg', values: [18, 18, 18] },
      ],
    },
    metric: 'Purchase intent',
    source: 'Consumer Insights Global 2026 · Germany · n=4,187',
  },
  {
    title: 'EV Intent Trend — Urban Tech Professionals',
    subtitle: 'Jan 2025 → Jan 2026 · 5 survey waves',
    chartType: 'line',
    chartData: {
      labels: ['Jan 2025', 'Apr 2025', 'Jul 2025', 'Oct 2025', 'Jan 2026'],
      series: [{ name: 'Purchase intent %', values: [48, 52, 57, 61, 64] }],
    },
    metric: 'Intent trend',
    source: 'Consumer Insights Global 2026 · Germany · n=4,187',
  },
  {
    title: 'Addressable Audience',
    subtitle: 'Urban Tech Professionals · Germany',
    chartType: 'scorecard',
    chartData: {
      labels: ['Addressable audience', 'Urban Tech Professionals · High intent'],
      series: [{ name: 'Addressable universe', values: [2100000] }],
    },
    metric: 'Addressable universe',
    source: 'Consumer Insights Global 2026 · Germany',
  },
]

export const EV_AUDIENCE_DRAFT: AudienceDraftData = {
  name: 'EV Intent Audience — Germany',
  inheritedFrom: 'Urban Tech Professionals',
  filters: [
    { label: 'Country',         value: 'Germany' },
    { label: 'Age range',       value: '25–40' },
    { label: 'Income',          value: 'High (top 30%)' },
    { label: 'Interest',        value: 'Automotive / Electric Vehicles' },
    { label: 'Intent signal',   value: 'EV purchase intent > 50%' },
    { label: 'Universe',        value: '~2.1M' },
  ],
  prefill: {
    name: 'EV Intent Audience — Germany',
    description: 'Urban tech professionals in Germany with high EV purchase intent',
    region: 'Germany',
    isShared: false,
    filters: {
      id: 'fg-ev-germany',
      operator: 'AND',
      conditions: [
        { id: 'c1', attribute: 'Country',        operator: 'eq',  value: 'Germany' },
        { id: 'c2', attribute: 'Age (basic)',     operator: 'in',  value: ['25-34', '35-44'] },
        { id: 'c3', attribute: 'Income bracket',  operator: 'in',  value: ['$75k–$100k', '$100k–$150k', '$150k+'] },
      ],
    },
  },
}

export const EV_FOLLOW_UPS = [
  'How does EV intent vary by income bracket?',
  'What motivates Urban Tech Professionals to consider an EV?',
  'Show me the same analysis for the United Kingdom',
]

// ─── Fake AI responses ────────────────────────────────────────────────────────

const DATASETS = [
  'Global Consumer Survey 2024',
  'Digital Audience Report Q4 2024',
  'Brand Health Tracker 2025',
  'E-commerce Behaviour Study 2024',
  'Mobile Usage Insights 2025',
  'Consumer Insights Survey DE 2025',
];


// ─── Pre-scripted data widget cards ──────────────────────────────────────────

export const GEN_Z_AD_RECALL_WIDGET: DataWidgetCardData = {
  title: 'Ad Recall by Device Type',
  subtitle: 'Gen Z vs. all-demographics benchmark',
  chartType: 'bar',
  chartData: {
    labels: ['Mobile', 'Desktop', 'Tablet', 'Smart TV'],
    series: [
      { name: 'Gen Z',      values: [72, 58, 31, 55] },
      { name: 'Benchmark',  values: [54, 51, 28, 42] },
    ],
  },
  metric: 'Ad recall (%)',
  source: 'Digital Audience Report Q4 2024',
}

export const PURCHASE_INTENT_WIDGET: DataWidgetCardData = {
  title: 'Purchase Intent — Premium Footwear',
  subtitle: 'By age group, Germany 2025',
  chartType: 'bar',
  chartData: {
    labels: ['18–24', '25–34', '35–44', '45–54', '55+'],
    series: [
      { name: 'Premium Footwear', values: [61, 74, 52, 38, 24] },
      { name: 'Market avg.',      values: [44, 55, 48, 36, 28] },
    ],
  },
  metric: 'Purchase intent (%)',
  source: 'Consumer Insights Survey DE 2025',
}

// ─── Audience cards for all scenarios ────────────────────────────────────────

export const SUSTAINABLE_MILLENNIAL_CARD: AudienceCardData = {
  name: 'Sustainable Millennial Shoppers',
  subtitle: 'Ages 25–34 with high purchase intent for eco-friendly products',
  sampleSize: 14_800,
  region: 'Global',
  confidence: 79,
  demographics: [
    { label: 'Age range',  value: '25–34 years' },
    { label: 'Gender',     value: 'Mixed (52% F)' },
    { label: 'Country',    value: 'Global' },
    { label: 'Device',     value: 'Mobile-first' },
  ],
  behaviors: [
    { label: 'Purchase intent',  value: '68% (vs 41% avg)' },
    { label: 'Discovery',        value: 'Social / mobile' },
    { label: 'Top values',       value: 'Sustainability' },
    { label: 'Preferred retail', value: 'Online (71%)' },
  ],
  prefill: {
    name: 'Sustainable Millennial Shoppers',
    filters: {
      id: 'fg-sust-1',
      operator: 'AND',
      conditions: [
        { id: 'c-sust-1', attribute: 'Age (basic)',          operator: 'in', value: ['18 - 29 years', '30 - 39 years'] },
        { id: 'c-sust-2', attribute: 'Health consciousness', operator: 'in', value: ['Very health-conscious', 'Somewhat'] },
        { id: 'c-sust-3', attribute: 'Purchase frequency',  operator: 'in', value: ['Weekly', 'Bi-weekly', 'Monthly'] },
      ],
    },
  },
}

export const PREMIUM_HOME_IMPROVERS_CARD: AudienceCardData = {
  name: 'Premium Home Improvers — US',
  subtitle: 'High-income homeowners with strong NPS for home improvement brands',
  sampleSize: 8_200,
  region: 'United States',
  confidence: 82,
  demographics: [
    { label: 'Income',    value: '$100k+' },
    { label: 'Housing',   value: 'Homeowner' },
    { label: 'Age range', value: '35–55 years' },
    { label: 'Country',   value: 'United States' },
  ],
  behaviors: [
    { label: 'NPS',              value: '61 (vs 43 avg)' },
    { label: 'Category pen.',    value: '2.4× market avg' },
    { label: 'Spend level',      value: 'High' },
    { label: 'Purchase freq.',   value: 'Quarterly+' },
  ],
  prefill: {
    name: 'Premium Home Improvers — US',
    filters: {
      id: 'fg-home-1',
      operator: 'AND',
      conditions: [
        { id: 'c-home-1', attribute: 'Income bracket',  operator: 'in', value: ['$100k–$150k', '$150k+'] },
        { id: 'c-home-2', attribute: 'Home ownership',  operator: 'in', value: ['Owner'] },
        { id: 'c-home-3', attribute: 'Age (basic)',     operator: 'in', value: ['30 - 39 years', '40 - 49 years', '50 - 64 years'] },
      ],
    },
    region: 'United States',
  },
}

// ─── Nike Germany audience card ──────────────────────────────────────────────

export const NIKE_GERMANY_CARD: AudienceCardData = {
  name: 'Nike Premium Buyers — Germany',
  subtitle: 'Urban males 25–40 purchasing premium athletic footwear online',
  sampleSize: 12_400,
  region: 'Germany',
  confidence: 87,
  demographics: [
    { label: 'Gender',     value: 'Male (74%)' },
    { label: 'Age range',  value: '25–40 years' },
    { label: 'Country',    value: 'Germany' },
    { label: 'Income',     value: '€50k–€100k+' },
  ],
  behaviors: [
    { label: 'Purchase freq.', value: 'Monthly+' },
    { label: 'Avg. spend',     value: '€150+ per item' },
    { label: 'Channel',        value: 'Online-first (63%)' },
    { label: 'Top brands',     value: 'Nike, Adidas' },
  ],
  prefill: {
    name: 'Nike Premium Buyers — Germany',
    filters: {
      id: 'fg-nike-1',
      operator: 'AND',
      conditions: [
        { id: 'c-nike-1', attribute: 'Country',      operator: 'in', value: ['Germany']                         },
        { id: 'c-nike-2', attribute: 'Gender',        operator: 'in', value: ['Male']                            },
        { id: 'c-nike-3', attribute: 'Age (basic)',   operator: 'in', value: ['18 - 29 years', '30 - 39 years'] },
        { id: 'c-nike-4', attribute: 'Online spend',  operator: 'in', value: ['High']                            },
      ],
    },
    region: 'Germany',
  },
}

// ─── New unified response type ────────────────────────────────────────────────

export type FakeAIResponse = {
  type: 'text' | 'audience_card' | 'clarify' | 'data_widget' | 'ev_demo';
  content: string;
  audienceCard?: AudienceCardData;
  dataWidget?: DataWidgetCardData;
  dataset?: string;
  suggestedFollowUps?: string[];
}

function isAudienceQuery(q: string): boolean {
  return /buyer|shopper|audience|customer|consumer|segment|sneaker|footwear|nike|brand/i.test(q)
}

function hasRegion(q: string): boolean {
  return /germany|german|berlin|munich|münchen|united states|\bus\b|\buk\b|france|japan/i.test(q)
}

const NIKE_FOLLOW_UPS = [
  "What's their purchase intent for premium footwear?",
  "How do they respond to mobile ads?",
]

const HOME_FOLLOW_UPS = [
  "What's their NPS trend over the last year?",
  "Which channels drive the most conversions?",
]

const MILLENNIAL_FOLLOW_UPS = [
  "What's their brand affinity for eco labels?",
  "Which social platforms do they engage with most?",
]

export function getFakeAIResponse(
  query: string,
  ctx: { lastWasClarify?: boolean; lastHadAudienceCard?: boolean } = {}
): FakeAIResponse {
  const q = query.toLowerCase()

  // EV demo scenario — handled with multi-phase flow in the page component
  if (isEVTrigger(q)) {
    return { type: 'ev_demo', content: '' }
  }

  // Follow-up after a clarifying question → audience card + follow-up chips
  if (ctx.lastWasClarify) {
    return {
      type: 'audience_card',
      content: "Got it. Based on your context, here's an audience profile built from Consumer Insights data:",
      audienceCard: NIKE_GERMANY_CARD,
      dataset: DATASETS[5],
      suggestedFollowUps: NIKE_FOLLOW_UPS,
    }
  }

  // ── Context-aware follow-ups: user already has an audience, now asking for insights ──

  if (ctx.lastHadAudienceCard) {
    // Purchase intent follow-up → scoped widget
    if (/purchase.?intent|buying.?intent|intent.?data|intent/i.test(q)) {
      return {
        type: 'data_widget',
        content: "Here's the purchase intent breakdown for this segment:",
        dataWidget: {
          ...PURCHASE_INTENT_WIDGET,
          subtitle: 'Nike Premium Buyers — Germany • 2025',
        },
        dataset: DATASETS[5],
      }
    }

    // Ad recall / mobile ads follow-up → scoped widget
    if (/ad.?recall|mobile.?ad|respond.*ad|ads|advertising/i.test(q)) {
      return {
        type: 'data_widget',
        content: "Here's how this segment responds to ads across devices:",
        dataWidget: {
          ...GEN_Z_AD_RECALL_WIDGET,
          subtitle: 'Nike Premium Buyers — Germany vs. all-demographics benchmark',
        },
        dataset: DATASETS[1],
      }
    }
  }

  // ── Data widget checks — more specific than broad audience queries ──

  // Gen Z / ad recall / short-form video → inline widget
  if (/gen.?z|genz|ad.?recall|short.?form|video.*(recall|performance|engagement)/i.test(q)) {
    return {
      type: 'data_widget',
      content: "Here's the data based on Consumer Insights:",
      dataWidget: GEN_Z_AD_RECALL_WIDGET,
      dataset: DATASETS[1],
    }
  }

  // Purchase intent / intent data → inline widget
  if (/purchase.?intent|buying.?intent|intent.?data/i.test(q)) {
    return {
      type: 'data_widget',
      content: "Here's the purchase intent breakdown:",
      dataWidget: PURCHASE_INTENT_WIDGET,
      dataset: DATASETS[5],
    }
  }

  // ── Audience queries ──

  // Audience queries with a named region → show card immediately
  if (isAudienceQuery(q) && hasRegion(q)) {
    return {
      type: 'audience_card',
      content: "Here's an audience profile matching your brief, drawn from Consumer Insights data:",
      audienceCard: NIKE_GERMANY_CARD,
      dataset: DATASETS[5],
      suggestedFollowUps: NIKE_FOLLOW_UPS,
    }
  }

  // Audience queries without region → ask one clarifying question
  if (isAudienceQuery(q)) {
    return {
      type: 'clarify',
      content: 'To build the most accurate segment, I need a bit more context. Which market are you targeting — for example, Germany, the US, or globally? And is there a specific product category or brand in mind?',
    }
  }

  // Home / income → audience card
  if (/home|homeown|income|renovati/i.test(q)) {
    return {
      type: 'audience_card',
      content: "Here's an audience profile based on Consumer Insights data:",
      audienceCard: PREMIUM_HOME_IMPROVERS_CARD,
      dataset: DATASETS[2],
      suggestedFollowUps: HOME_FOLLOW_UPS,
    }
  }

  // Default → audience card (sustainable millennial shoppers)
  return {
    type: 'audience_card',
    content: "Here's an audience profile matching your brief:",
    audienceCard: SUSTAINABLE_MILLENNIAL_CARD,
    dataset: DATASETS[0],
    suggestedFollowUps: MILLENNIAL_FOLLOW_UPS,
  }
}

export { DATASETS };
