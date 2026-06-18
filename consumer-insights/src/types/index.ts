// ─── Audience ───────────────────────────────────────────────────────────────

export type FilterCondition = {
  id: string;
  attribute: string;
  operator: 'eq' | 'neq' | 'in' | 'gte' | 'lte';
  value: string | string[] | number;
};

export type FilterGroup = {
  id: string;
  operator: 'AND' | 'OR';
  conditions: Array<FilterCondition | FilterGroup>;
};

export type Audience = {
  id: string;
  name: string;
  description?: string;
  filters: FilterGroup;
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
  region?: string;
  wave?: string;
};

// ─── Widget ──────────────────────────────────────────────────────────────────

export type WidgetType = 'bar' | 'line' | 'pie' | 'table' | 'scorecard' | 'text';

export type Widget = {
  id: string;
  type: WidgetType;
  title: string;
  audienceId: string;
  benchmarkAudienceId?: string;
  metric: string;
  breakdown?: string;
  createdAt: string;
  country?: string;
  year?: string;
  crossDimensionLabel?: string;
  crossDimensionId?: string;
  showIndex?: boolean;
  showTotalShare?: boolean;
};

export type CrossTabConfig = {
  showTotal: boolean
  showUniverse: boolean
  showResponses: boolean
  showPctCol: boolean
  showPctRow: boolean
  showIndex: boolean
}

export const DEFAULT_CROSSTAB_CONFIG: CrossTabConfig = {
  showTotal: true,
  showUniverse: true,
  showResponses: true,
  showPctCol: true,
  showPctRow: true,
  showIndex: true,
}

export type ChartSeries = {
  name: string;
  values: number[];       // percent
  absolutes?: number[];   // absolute count in group
  populations?: number[]; // in millions
  indexValues?: number[]; // index (100 = average)
  baseN?: number;         // group respondent base
};

export type ChartData = {
  labels: string[];
  series: ChartSeries[];
  totalSeries?: {         // "Total share of all respondents" column
    values: number[];
    absolutes?: number[];
    populations?: number[];
    baseN?: number;
  };
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

export type DashboardWidget = {
  widgetId: string;
  position: { x: number; y: number; w: number; h: number };
};

export type Dashboard = {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Project / Workspace ─────────────────────────────────────────────────────

export type AnalysisSection = {
  id: string;
  heading: string;
  content: string;
};

export type Analysis = {
  id: string;
  name: string;
  dashboardId?: string;
  template?: 'summary' | 'full';
  sections?: AnalysisSection[];
  audienceId: string;
  widgetIds: string[];
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  savedAnalyses: Analysis[];
  dashboardIds: string[];
  createdAt: string;
};

// ─── Research AI ─────────────────────────────────────────────────────────────

export type CIHandoff = {
  type: 'create_audience' | 'create_widget' | 'open_dashboard';
  payload: Partial<Audience> | Partial<Widget>;
};

export type AudienceCardData = {
  name: string;
  subtitle: string;
  sampleSize: number;
  region: string;
  confidence: number;
  demographics: Array<{ label: string; value: string }>;
  behaviors: Array<{ label: string; value: string }>;
  prefill: Partial<Audience>;
};

export type DataWidgetCardData = {
  title: string;
  subtitle: string;
  chartType: WidgetType;
  chartData: ChartData;
  metric: string;
  source: string;
};

// ─── EV Demo types ───────────────────────────────────────────────────────────

export type ProcessingStep = {
  label: string;
  value: string;
  status: 'done' | 'active' | 'pending';
};

export type SegmentCard = {
  name: string;
  ageRange: string;
  descriptor: string;
  intentScore: number;
  universe: string;
  isBestMatch: boolean;
};

export type BenchmarkPanelData = {
  segments: SegmentCard[];
  nudge: string;
};

export type AudienceDraftData = {
  name: string;
  filters: Array<{ label: string; value: string }>;
  inheritedFrom: string;
  prefill: Partial<Audience>;
};

export type AIMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  handoff?: CIHandoff;
  attribution?: string;
  isStreaming?: boolean;
  audienceCard?: AudienceCardData;
  dataWidget?: DataWidgetCardData;
  messageType?: 'text' | 'audience_card' | 'clarify' | 'data_widget' | 'ev_demo' | 'audience_draft';
  suggestedFollowUps?: string[];
  // EV demo
  processingSteps?: ProcessingStep[];
  benchmarkPanel?: BenchmarkPanelData;
  widgetCluster?: DataWidgetCardData[];
  audienceDraft?: AudienceDraftData;
};

export type AIConversation = {
  id: string;
  messages: AIMessage[];
  resolvedAudience?: Audience;
  resolvedWidgets?: Widget[];
};

// ─── Misc ────────────────────────────────────────────────────────────────────

export const ATTRIBUTE_GROUPS = [
  { label: 'Survey details',                  attrs: ['Survey country', 'Survey year', 'Survey wave'] },
  { label: 'Characteristics & demographics',  attrs: ['Gender', 'Age (basic)', 'Age (10-year brackets)', 'Age (5-year brackets)', 'Age (detailed)', 'Country'] },
  { label: 'AI & smart technology',           attrs: ['AI usage', 'Smart home devices', 'AI assistant usage'] },
  { label: 'Consumer electronics',            attrs: ['Device ownership', 'Device type', 'Streaming devices'] },
  { label: 'Fashion',                         attrs: ['Clothing spend', 'Fashion interest', 'Sustainable fashion'] },
  { label: 'Finance',                         attrs: ['Income bracket', 'Investment behavior', 'Payment method'] },
  { label: 'Food & consumption',              attrs: ['Food spend', 'Organic food preference', 'Restaurant frequency'] },
  { label: 'Health',                          attrs: ['Health insurance', 'Fitness activity', 'Health consciousness'] },
  { label: 'Housing & household equipment',   attrs: ['Housing type', 'Household size', 'Home ownership'] },
  { label: 'Insurance',                       attrs: ['Attitudes towards insurances', 'Insurances owned by type', 'Insurance owner'] },
  { label: 'Internet & smartphone',           attrs: ['Internet usage', 'Smartphone type', 'Mobile data usage'] },
  { label: 'Media & news',                    attrs: ['News consumption', 'Streaming subscriptions', 'Media time spent'] },
  { label: 'Mobility',                        attrs: ['Transport mode', 'Car ownership', 'Travel frequency'] },
  { label: 'Online shopping',                 attrs: ['Online spend', 'Purchase frequency', 'Preferred retailer'] },
  { label: 'Personal care',                   attrs: ['Personal care spend', 'Grooming frequency'] },
  { label: 'Print media & ePublishing',       attrs: ['Print media read', 'eBook usage'] },
  { label: 'Retail shopping',                 attrs: ['Retail spend', 'Store preference', 'Loyalty programs'] },
  { label: 'Services & eServices',            attrs: ['Service subscriptions', 'Digital services usage'] },
  { label: 'Social media & marketing',        attrs: ['Social media platforms', 'Social media time', 'Influencer engagement'] },
  { label: 'Travel',                          attrs: ['Annual trips', 'Travel budget', 'Accommodation type'] },
  { label: 'Video games',                     attrs: ['Gaming frequency', 'Gaming platform', 'Gaming spend'] },
] as const

export const ATTRIBUTES = ATTRIBUTE_GROUPS.flatMap(g => g.attrs) as unknown as string[]

export const ATTRIBUTE_OPTIONS: Record<string, string[]> = {
  // Demographics
  'Gender':                  ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
  'Age (basic)':             ['18 - 29 years', '30 - 39 years', '40 - 49 years', '50 - 64 years', '65+ years'],
  'Age (10-year brackets)':  ['18-27 years', '28-37 years', '38-47 years', '48-57 years', '58-67 years', '68+ years'],
  'Age (5-year brackets)':   ['18-22 years', '23-27 years', '28-32 years', '33-37 years', '38-42 years', '43-47 years', '48-52 years', '53-57 years', '58-62 years', '63-67 years', '68+ years'],
  'Country':                 ['United States', 'Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Australia', 'Japan', 'Brazil', 'Canada'],
  'Survey country':          ['US', 'DE', 'UK', 'FR', 'IT', 'ES', 'AU', 'JP', 'BR', 'CA'],
  // Consumer electronics
  'Device type':             ['Mobile', 'Desktop', 'Tablet', 'Smart TV'],
  // Finance
  'Income bracket':          ['Under $25k', '$25k–$50k', '$50k–$75k', '$75k–$100k', '$100k–$150k', '$150k+'],
  'Payment method':          ['Credit card', 'Debit card', 'Digital wallet', 'Cash', 'Buy now pay later'],
  'Investment behavior':     ['Active investor', 'Passive / index funds', 'Savings only', 'No investments'],
  // Housing
  'Housing type':            ['House', 'Apartment', 'Condo', 'Townhouse', 'Other'],
  'Home ownership':          ['Owner', 'Renter', 'Living with family', 'Other'],
  // Health
  'Health insurance':        ['Private', 'Public', 'Employer-provided', 'None'],
  'Fitness activity':        ['Daily', 'Several times a week', 'Weekly', 'Monthly', 'Rarely', 'Never'],
  'Health consciousness':    ['Very health-conscious', 'Somewhat', 'Neutral', 'Not very', 'Not at all'],
  // Internet
  'Smartphone type':         ['Android', 'iOS', 'Other'],
  // Media
  'News consumption':        ['Daily', 'Several times a week', 'Weekly', 'Monthly', 'Rarely'],
  // Mobility
  'Transport mode':          ['Car', 'Public transit', 'Bicycle', 'Walking', 'Ride-sharing', 'Other'],
  'Car ownership':           ['Own', 'Lease', 'No car'],
  'Travel frequency':        ['Several times a year', 'Once a year', 'Every 2–3 years', 'Rarely', 'Never'],
  // Online shopping
  'Purchase frequency':      ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'A few times a year', 'Rarely'],
  // Social media
  'Social media platforms':  ['Facebook', 'Instagram', 'TikTok', 'Twitter/X', 'LinkedIn', 'YouTube', 'Pinterest', 'Snapchat'],
  // Travel
  'Accommodation type':      ['Hotel', 'Airbnb / Vacation rental', 'Hostel', 'Friends / Family', 'Other'],
  // Video games
  'Gaming frequency':        ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'],
  'Gaming platform':         ['PC', 'Console', 'Mobile', 'Cloud gaming'],
  // Food
  'Organic food preference': ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
  'Restaurant frequency':    ['Daily', 'Several times a week', 'Weekly', 'Monthly', 'Rarely'],
}

export const METRICS = [
  'purchase_intent',
  'brand_awareness',
  'brand_affinity',
  'ad_recall',
  'net_promoter_score',
  'category_penetration',
] as const;

export const BREAKDOWNS = [
  'age_group',
  'gender',
  'income_bracket',
  'country',
  'device_type',
] as const;
