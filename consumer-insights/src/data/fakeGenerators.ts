import type { ChartData, WidgetType, AudienceCardData, DataWidgetCardData } from '@/types';

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

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function barData(withBenchmark: boolean): ChartData {
  const labels = ['18-24', '25-34', '35-44', '45-54', '55+'];
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

const SURVEY_ANSWERS = [
  'Strongly agree',
  'Somewhat agree',
  'Neither agree nor disagree',
  'Somewhat disagree',
  'Strongly disagree',
  "Don't know / No answer",
]

function surveyTableData(): ChartData {
  const raw = SURVEY_ANSWERS.map(() => rand(5, 40))
  const total = raw.reduce((a, b) => a + b, 0)
  const percents = raw.map((v) => Math.round((v * 100) / total))
  return { labels: SURVEY_ANSWERS, series: [{ name: 'Percent', values: percents }] }
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

function crosstableData(dimensionLabel: string, rowLabels?: string[]): ChartData {
  const answers = rowLabels ?? SURVEY_ANSWERS.slice(0, 5)
  const dimensions = DIMENSION_VALUES[dimensionLabel] ?? ['Group A', 'Group B', 'Group C']

  const TOTAL_N = 8599
  const basePerGroup = Math.floor(TOTAL_N / dimensions.length)
  const groupNs = dimensions.map((_, i) =>
    i === dimensions.length - 1 ? TOTAL_N - basePerGroup * (dimensions.length - 1) : basePerGroup
  )

  const groupPercents = dimensions.map(() => answers.map(() => rand(5, 45)))

  const totalPercents = answers.map((_, ai) => {
    const weightedSum = groupPercents.reduce((sum, gp, gi) => sum + gp[ai] * groupNs[gi], 0)
    return Math.round(weightedSum / TOTAL_N)
  })

  const series = dimensions.map((dim, gi) => {
    const groupN = groupNs[gi]
    const percents = groupPercents[gi]
    return {
      name: dim,
      values: percents,
      absolutes: percents.map((p) => Math.round((p * groupN) / 100)),
      populations: percents.map((p) => Math.round((p * groupN * POP_SCALE) / 1e8) / 10), // millions, 1dp
      indexValues: percents.map((p, ai) =>
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
      absolutes: totalPercents.map((p) => Math.round((p * TOTAL_N) / 100)),
      populations: totalPercents.map((p) => Math.round((p * TOTAL_N * POP_SCALE) / 1e8) / 10),
      baseN: TOTAL_N,
    },
  }
}

/** Generate a cross-tab section for an extra row attribute (uses its dimension values as row labels) */
export function generateCrosstabRowData(rowAttr: string, colAttr: string): ChartData {
  const rowLabels = DIMENSION_VALUES[rowAttr] ?? SURVEY_ANSWERS.slice(0, 5)
  return crosstableData(colAttr, rowLabels)
}

/** Generate a simple (non-cross-tab) table for an extra row attribute */
export function generateTableRowData(rowAttr: string): ChartData {
  const labels = DIMENSION_VALUES[rowAttr] ?? SURVEY_ANSWERS.slice(0, 5)
  const raw = labels.map(() => rand(5, 40))
  const total = raw.reduce((s, v) => s + v, 0)
  const percents = raw.map(v => Math.round((v / total) * 100))
  return { labels, series: [{ name: 'Percent', values: percents }] }
}

export function generateChartData(type: WidgetType, hasBenchmark: boolean, crossDimensionLabel?: string): ChartData {
  if (type === 'table' && crossDimensionLabel) return crosstableData(crossDimensionLabel)
  switch (type) {
    case 'bar': return barData(hasBenchmark);
    case 'line': return lineData();
    case 'pie': return pieData();
    case 'scorecard': return scorecardData(hasBenchmark);
    case 'table': return surveyTableData();
  }
}

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
  type: 'text' | 'audience_card' | 'clarify' | 'data_widget';
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
