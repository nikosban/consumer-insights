import type { ChartData, WidgetType, CIHandoff } from '@/types';

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

function crosstableData(dimensionLabel: string): ChartData {
  const answers = SURVEY_ANSWERS.slice(0, 5)
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
];

type FakeAIScenario = {
  insight: string;
  handoff: CIHandoff;
  dataset: string;
};

const SCENARIOS: FakeAIScenario[] = [
  {
    insight:
      "Millennial shoppers aged 25–34 show significantly higher purchase intent for sustainable products compared to older cohorts — 68% vs 41% for 45–54. This segment also skews toward mobile-first discovery. I'd suggest building a focused audience segment around this group to explore brand affinity further.",
    handoff: {
      type: 'create_audience',
      payload: {
        name: 'Sustainable Millennial Shoppers',
        description: 'Ages 25–34 with high purchase intent for sustainable products',
        filters: {
          id: 'fg-ai-1',
          operator: 'AND',
          conditions: [
            { id: 'c-ai-1', attribute: 'age', operator: 'gte', value: 25 },
            { id: 'c-ai-2', attribute: 'age', operator: 'lte', value: 34 },
            { id: 'c-ai-3', attribute: 'interests', operator: 'in', value: ['sustainability', 'eco_products'] },
          ],
        },
        region: 'US',
      },
    },
    dataset: DATASETS[0],
  },
  {
    insight:
      "Gen Z mobile users show the highest ad recall rates (72%) among all demographics when exposed to short-form video content. Their brand awareness scores are rising quarter-over-quarter. Creating a chart comparing ad recall across device types would help visualise this trend.",
    handoff: {
      type: 'create_widget',
      payload: {
        type: 'bar',
        title: 'Ad Recall by Device Type — Gen Z',
        audienceId: 'aud-2',
        metric: 'ad_recall',
        breakdown: 'device_type',
      },
    },
    dataset: DATASETS[1],
  },
  {
    insight:
      "High-income homeowners (HHI $100k+) demonstrate a strong net promoter score of 61 for home improvement brands — significantly above the 43 average. This segment has a 2.4× higher category penetration rate than the general population, making it a prime target for premium positioning.",
    handoff: {
      type: 'create_audience',
      payload: {
        name: 'Premium Home Improvers',
        description: 'High-income homeowners with strong brand affinity for home improvement',
        filters: {
          id: 'fg-ai-2',
          operator: 'AND',
          conditions: [
            { id: 'c-ai-4', attribute: 'income_bracket', operator: 'in', value: ['100k-150k', '150k+'] },
            { id: 'c-ai-5', attribute: 'interests', operator: 'in', value: ['home_improvement', 'real_estate'] },
          ],
        },
        region: 'US',
      },
    },
    dataset: DATASETS[2],
  },
];

export function getFakeAIResponse(query: string): FakeAIScenario {
  const lower = query.toLowerCase();
  if (lower.includes('gen z') || lower.includes('mobile') || lower.includes('video')) {
    return SCENARIOS[1];
  }
  if (lower.includes('home') || lower.includes('income') || lower.includes('premium')) {
    return SCENARIOS[2];
  }
  return SCENARIOS[0];
}

export { DATASETS };
