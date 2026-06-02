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
];

export const seedWidgets: Widget[] = [
  {
    id: 'wid-1',
    type: 'bar',
    title: 'Purchase Intent by Brand',
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
    title: 'Brand Awareness Over Time',
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
    title: 'Ad Recall Breakdown',
    audienceId: 'aud-2',
    metric: 'ad_recall',
    breakdown: 'gender',
    createdAt: '2025-03-12T09:20:00Z',
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
