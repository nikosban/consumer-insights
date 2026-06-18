import type { AudienceCardData, DataWidgetCardData, ProcessingStep, BenchmarkPanelData, AudienceDraftData } from '@/types';

// ─── EV Demo scenario ─────────────────────────────────────────────────────────

export function isEVTrigger(text: string): boolean {
  return /\bev\b|electric.?vehicle|electric.?car|ev.*intent|compare.*ev|ev.*germany|ev.*france|ev.*us\b/i.test(text)
}

export const EV_PROCESSING_STEPS: Omit<ProcessingStep, 'status'>[] = [
  { label: 'Parsing intent',       value: '"Compare EV purchase intent across Germany, France, and the US"' },
  { label: 'Topic',                value: 'Automotive · Electric Vehicles' },
  { label: 'Regions',              value: 'Germany (DE) · France (FR) · United States (US)' },
  { label: 'Location scope',       value: 'National · cross-market comparison' },
  { label: 'Survey waves',         value: 'Jan 2025 · Apr 2025 · Jul 2025 · Oct 2025 · Jan 2026' },
  { label: 'Respondents',          value: 'n = 12,840 (DE: 4,187 · FR: 3,921 · US: 4,732 · internet users 18–64)' },
  { label: 'Demographics',         value: 'Age · Gender · Income · Education · Urban/rural' },
  { label: 'Metric',               value: 'Purchase intent — "plan to buy an EV in next 12 months"' },
  { label: 'Normalising',          value: 'PPP-adjusted income brackets across markets…' },
  { label: 'Identifying segments', value: 'Scanning 40+ demographic cuts per market…' },
  { label: 'Segments found',       value: '3 high-intent audience groups, consistent across all 3 markets' },
  { label: 'Benchmarking',         value: 'Scoring segments on intent × reach × ability to pay…' },
  { label: 'Best match selected',  value: 'Urban Tech Professionals — strongest signal in DE & FR (score: 91/100)' },
]

export const EV_AI_TEXT =
  'Across Germany, France, and the US, **EV purchase intent is highest in Germany at 22%**, followed by France at 17% and the US at 14% (Consumer Insights, Jan 2026, n = 12,840). Germany leads on both intent and adoption infrastructure; France benefits from strong government incentives; the US shows wide regional variance with coastal markets tracking closer to European levels.\n\nIn all three markets the **Urban Tech Professionals** segment (age 25–40, high income, urban) shows the strongest combined signal on intent and ability to pay — making it the most actionable starting point for a cross-market campaign.'

export const EV_BENCHMARK_PANEL: BenchmarkPanelData = {
  nudge: 'Want to activate this audience? I can pre-fill it across all three markets.',
  segments: [
    {
      name: 'Urban Tech Professionals',
      ageRange: '25–40',
      descriptor: 'High-income urban, early adopter mindset · strongest in DE & FR',
      intentScore: 62,
      universe: '7.4M',
      isBestMatch: true,
    },
    {
      name: 'Eco-Conscious Families',
      ageRange: '35–52',
      descriptor: 'Suburban, sustainability-driven, mid-high income · dominant in US',
      intentScore: 38,
      universe: '11.2M',
      isBestMatch: false,
    },
    {
      name: 'Green Premium Buyers',
      ageRange: '45–60',
      descriptor: 'High income, sustainability & status motivated · consistent across markets',
      intentScore: 34,
      universe: '4.1M',
      isBestMatch: false,
    },
  ],
}

export const EV_WIDGET_CLUSTER: DataWidgetCardData[] = [
  {
    title: 'EV Purchase Intent by Country',
    subtitle: 'Overall market intent · Jan 2026',
    chartType: 'bar',
    chartData: {
      labels: ['Germany', 'France', 'United States'],
      series: [
        { name: 'Purchase intent %', values: [22, 17, 14] },
        { name: 'Global avg', values: [16, 16, 16] },
      ],
    },
    metric: 'Purchase intent',
    source: 'Consumer Insights Global 2026 · DE/FR/US · n=12,840',
  },
  {
    title: 'EV Intent Trend — Germany, France, US',
    subtitle: 'Jan 2025 → Jan 2026 · 5 survey waves',
    chartType: 'line',
    chartData: {
      labels: ['Jan 2025', 'Apr 2025', 'Jul 2025', 'Oct 2025', 'Jan 2026'],
      series: [
        { name: 'Germany',        values: [16, 17, 19, 21, 22] },
        { name: 'France',         values: [12, 13, 14, 16, 17] },
        { name: 'United States',  values: [11, 11, 12, 13, 14] },
      ],
    },
    metric: 'Intent trend',
    source: 'Consumer Insights Global 2026 · DE/FR/US · n=12,840',
  },
  {
    title: 'Combined Addressable Audience',
    subtitle: 'Urban Tech Professionals · DE + FR + US',
    chartType: 'scorecard',
    chartData: {
      labels: ['Addressable audience', 'Urban Tech Professionals · High intent · 3 markets'],
      series: [{ name: 'Addressable universe', values: [7400000] }],
    },
    metric: 'Addressable universe',
    source: 'Consumer Insights Global 2026 · DE/FR/US',
  },
]

export const EV_AUDIENCE_DRAFT: AudienceDraftData = {
  name: 'EV Intent Audience — DE, FR, US',
  inheritedFrom: 'Urban Tech Professionals',
  filters: [
    { label: 'Countries',       value: 'Germany · France · United States' },
    { label: 'Age range',       value: '25–40' },
    { label: 'Income',          value: 'High (top 30% per market)' },
    { label: 'Interest',        value: 'Automotive / Electric Vehicles' },
    { label: 'Intent signal',   value: 'EV purchase intent > 50%' },
    { label: 'Universe',        value: '~7.4M' },
  ],
  prefill: {
    name: 'EV Intent Audience — DE, FR, US',
    description: 'Urban tech professionals across Germany, France and the US with high EV purchase intent',
    region: 'de-fr-us',
    isShared: false,
    filters: {
      id: 'fg-ev-multi',
      operator: 'AND',
      conditions: [
        { id: 'c1', attribute: 'Country',        operator: 'in',  value: ['DE', 'FR', 'US'] },
        { id: 'c2', attribute: 'Age (basic)',     operator: 'in',  value: ['25-34', '35-44'] },
        { id: 'c3', attribute: 'Income bracket',  operator: 'in',  value: ['$75k–$100k', '$100k–$150k', '$150k+'] },
      ],
    },
  },
}

export const EV_FOLLOW_UPS = [
  'Which US regions show intent closest to German levels?',
  'How does EV intent vary by income bracket across all three markets?',
  'Show me the same comparison for hybrid vehicles',
]

// ─── Fake AI responses ────────────────────────────────────────────────────────

export const DATASETS = [
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
