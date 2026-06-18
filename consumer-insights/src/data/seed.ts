import type { Audience, Widget, Dashboard, Project } from '@/types';

export const seedAudiences: Audience[] = [
  {
    id: 'aud-1',
    name: 'Millennial Shoppers',
    description: 'Adults 25–40 who shop online at least twice a month',
    filters: {
      id: 'fg-1',
      operator: 'AND',
      conditions: [
        { id: 'c-1', attribute: 'Age (basic)', operator: 'gte', value: 25 },
        { id: 'c-2', attribute: 'Age (basic)', operator: 'lte', value: 40 },
        { id: 'c-3', attribute: 'Purchase frequency', operator: 'in', value: ['weekly', 'bi-weekly'] },
      ],
    },
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-03-01T09:00:00Z',
    isShared: true,
    region: 'US',
  },
  {
    id: 'aud-2',
    name: 'Gen Z Mobile Users',
    description: 'Users 18–24 who primarily access content via mobile',
    filters: {
      id: 'fg-2',
      operator: 'AND',
      conditions: [
        { id: 'c-4', attribute: 'Age (basic)', operator: 'gte', value: 18 },
        { id: 'c-5', attribute: 'Age (basic)', operator: 'lte', value: 24 },
        { id: 'c-6', attribute: 'Device type', operator: 'eq', value: 'mobile' },
      ],
    },
    createdAt: '2025-03-05T10:00:00Z',
    updatedAt: '2025-03-05T10:00:00Z',
    isShared: false,
    region: 'EU',
  },
  {
    id: 'aud-3',
    name: 'High-Income Homeowners',
    description: 'Households with $100k+ income who own their home',
    filters: {
      id: 'fg-3',
      operator: 'AND',
      conditions: [
        { id: 'c-7', attribute: 'Income bracket', operator: 'in', value: ['100k-150k', '150k+'] },
        { id: 'c-8', attribute: 'Home ownership', operator: 'in', value: ['owner'] },
      ],
    },
    createdAt: '2025-03-10T08:00:00Z',
    updatedAt: '2025-03-10T08:00:00Z',
    isShared: true,
    region: 'US',
  },
  {
    id: 'aud-ev',
    name: 'EV Intent Audience — DE, FR, US',
    description: 'Urban tech professionals across Germany, France and the US with high EV purchase intent',
    filters: {
      id: 'fg-ev-multi',
      operator: 'AND',
      conditions: [
        { id: 'ev-c1', attribute: 'Country',       operator: 'in', value: ['DE', 'FR', 'US'] },
        { id: 'ev-c2', attribute: 'Age (basic)',    operator: 'in', value: ['25-34', '35-44'] },
        { id: 'ev-c3', attribute: 'Income bracket', operator: 'in', value: ['$75k–$100k', '$100k–$150k', '$150k+'] },
      ],
    },
    createdAt: '2026-06-08T09:00:00Z',
    updatedAt: '2026-06-08T09:00:00Z',
    isShared: false,
    region: 'de-fr-us',
  },
  {
    id: 'aud-rural',
    name: 'Rural Consumers — DE, FR, US',
    description: 'Rural and suburban households across Germany, France and the US, lower EV intent baseline',
    filters: {
      id: 'fg-rural',
      operator: 'AND',
      conditions: [
        { id: 'r-c1', attribute: 'Country',          operator: 'in', value: ['DE', 'FR', 'US'] },
        { id: 'r-c2', attribute: 'Housing type',      operator: 'in', value: ['Rural', 'Suburban'] },
        { id: 'r-c3', attribute: 'Income bracket',    operator: 'in', value: ['$25k–$50k', '$50k–$75k'] },
      ],
    },
    createdAt: '2026-06-08T09:05:00Z',
    updatedAt: '2026-06-08T09:05:00Z',
    isShared: false,
    region: 'de-fr-us',
  },
];

export const seedWidgets: Widget[] = [
  {
    id: 'wid-1',
    type: 'bar',
    title: 'Purchase Intent by Age Group',
    audienceId: 'aud-1',
    benchmarkAudienceId: 'aud-3',
    metric: 'purchase_intent',
    breakdown: 'age_group',
    createdAt: '2025-03-12T09:00:00Z',
  },
  {
    id: 'wid-2',
    type: 'pie',
    title: 'Device Type Distribution',
    audienceId: 'aud-2',
    metric: 'category_penetration',
    breakdown: 'device_type',
    createdAt: '2025-03-12T09:05:00Z',
  },
  {
    id: 'wid-3',
    type: 'line',
    title: 'Brand Awareness Trend — Q1 2025',
    audienceId: 'aud-1',
    metric: 'brand_awareness',
    createdAt: '2025-03-12T09:10:00Z',
  },
  {
    id: 'wid-4',
    type: 'scorecard',
    title: 'Net Promoter Score',
    audienceId: 'aud-3',
    benchmarkAudienceId: 'aud-1',
    metric: 'net_promoter_score',
    createdAt: '2025-03-12T09:15:00Z',
  },
  {
    id: 'wid-5',
    type: 'table',
    title: 'Ad Recall — Statement Battery by Gender',
    audienceId: 'aud-2',
    metric: 'ad_recall',
    breakdown: 'gender',
    createdAt: '2025-03-12T09:20:00Z',
  },
  {
    id: 'wid-ev-1',
    type: 'table',
    title: 'EV Purchase Intent by Audience Segment',
    audienceId: 'aud-ev',
    metric: 'purchase_intent',
    breakdown: 'EV Purchase Intent %',
    crossDimensionLabel: 'Country of residence (EV)',
    crossDimensionId: 'Country of residence (EV)',
    createdAt: '2026-06-08T09:10:00Z',
  },
  {
    id: 'wid-ev-2',
    type: 'bar',
    title: 'EV Intent — Urban vs Rural Consumers',
    audienceId: 'aud-ev',
    benchmarkAudienceId: 'aud-rural',
    metric: 'purchase_intent',
    breakdown: 'Settlement type',
    createdAt: '2026-06-08T09:15:00Z',
  },
  {
    id: 'wid-ev-3',
    type: 'pie',
    title: 'Car Ownership Status — EV Audience',
    audienceId: 'aud-ev',
    metric: 'category_penetration',
    breakdown: 'Car ownership status',
    createdAt: '2026-06-08T09:20:00Z',
  },
];

export const seedDashboards: Dashboard[] = [
  {
    id: 'dash-1',
    name: 'Q1 Audience Overview',
    widgets: [
      { widgetId: 'wid-1', position: { x: 0, y: 0, w: 6, h: 4 } },
      { widgetId: 'wid-2', position: { x: 6, y: 0, w: 6, h: 4 } },
      { widgetId: 'wid-4', position: { x: 0, y: 4, w: 4, h: 3 } },
    ],
    isShared: false,
    createdAt: '2025-03-15T10:00:00Z',
    updatedAt: '2025-03-15T10:00:00Z',
  },
  {
    id: 'dash-ev',
    name: 'EV Consumers',
    widgets: [
      { widgetId: 'wid-ev-1', position: { x: 0, y: 0,  w: 12, h: 7 } },
      { widgetId: 'wid-ev-2', position: { x: 0, y: 7,  w: 7,  h: 7 } },
      { widgetId: 'wid-ev-3', position: { x: 7, y: 7,  w: 5,  h: 7 } },
    ],
    isShared: false,
    createdAt: '2026-06-08T09:00:00Z',
    updatedAt: '2026-06-08T09:00:00Z',
  },
];

export const seedProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Q1 Consumer Research',
    savedAnalyses: [
      {
        id: 'ana-1',
        name: 'Q1 Audience Overview — Summary',
        dashboardId: 'dash-1',
        template: 'summary' as const,
        audienceId: 'aud-1',
        widgetIds: ['wid-1', 'wid-3'],
        createdAt: '2025-03-15T11:00:00Z',
        sections: [
          {
            id: 'sec-exec',
            heading: 'Executive Summary',
            content: 'The Q1 Audience Overview dashboard consolidates 3 data points covering purchase intent, device distribution, and net promoter score. Overall, the data reveals consistent patterns across the Millennial Shoppers audience, with notable variation in intent metrics compared to the High-Income Homeowner benchmark. Key signals point to an opportunity to strengthen brand positioning in high-intent segments while sustaining current awareness momentum.',
          },
          {
            id: 'sec-findings',
            heading: 'Key Findings',
            content: '• Purchase intent is highest in the 25–34 cohort, outperforming the benchmark audience by an estimated 12 percentage points.\n• Brand awareness has trended upward across the tracked period, with a notable acceleration in the most recent wave.\n• Mobile accounts for approximately 64% of device usage, reinforcing the need for mobile-first creative strategies.\n• Ad recall scores are at or above category average across all measured segments.\n• Net Promoter Score sits at 42, indicating moderate but consistent advocacy behaviour within the category.',
          },
          {
            id: 'sec-recs',
            heading: 'Recommendations',
            content: '• Prioritise mobile-optimised ad formats to align with the dominant device usage pattern observed in the data.\n• Continue investing in upper-funnel brand-building to sustain the positive awareness trajectory identified this quarter.\n• Target the 25–34 cohort with conversion-focused messaging, where purchase intent signals are strongest.\n• Benchmark against the High-Income Homeowner segment quarterly to monitor intent divergence.\n• Commission a follow-up research wave in Q2 to assess whether Q1 gains are sustained or represent a seasonal peak.',
          },
        ],
      },
    ],
    dashboardIds: ['dash-1'],
    createdAt: '2025-03-01T08:00:00Z',
  },
];
