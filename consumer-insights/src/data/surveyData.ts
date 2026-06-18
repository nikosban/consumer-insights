export const SURVEY_TYPES = [
  'All surveys',
  'Global Survey',
  'Brand KPIs',
  'Pulse',
  'Media and Touchpoints',
  'Survey Library',
] as const

export const SURVEY_COUNTRIES = [
  'All countries',
  'United States',
  'Germany',
  'United Kingdom',
  'France',
  'Italy',
  'Spain',
  'Australia',
  'Japan',
  'Brazil',
  'Canada',
  'Netherlands',
  'Poland',
  'Sweden',
  'Mexico',
  'South Korea',
]

export type SurveyQuestion = {
  id: string
  label: string
  values?: string[]   // dimension labels when used as a crosstab column/row
}

export type SurveyCategory = {
  label: string
  questions: SurveyQuestion[]
}

export const SURVEY_CATALOG: SurveyCategory[] = [
  {
    label: 'Survey details',
    questions: [
      { id: 'sq-survey-country', label: 'Survey country',
        values: ['US', 'Germany', 'UK', 'France', 'Australia'] },
      { id: 'sq-survey-year',    label: 'Survey year',
        values: ['2022', '2023', '2024', '2025', '2026'] },
      { id: 'sq-survey-wave',    label: 'Survey wave',
        values: ['Q1', 'Q2', 'Q3', 'Q4'] },
    ],
  },
  {
    label: 'Characteristics & demographics',
    questions: [
      { id: 'sq-gender',            label: 'Gender',
        values: ['Male', 'Female', 'Non-binary'] },
      { id: 'sq-age-distribution',  label: 'Age distribution',
        values: ['18-24', '25-34', '35-44', '45-54', '55+'] },
      { id: 'sq-age-detailed',      label: 'Detailed age groups',
        values: ['18-20', '21-24', '25-29', '30-34', '35-39', '40-44', '45-54', '55-64', '65+'] },
      { id: 'sq-gen-breakdown',     label: 'Generational breakdown',
        values: ['Gen Z (18–27)', 'Millennials (28–43)', 'Gen X (44–59)', 'Baby Boomers (60–78)'] },
      { id: 'sq-country-residence', label: 'Country of residence',
        values: ['US', 'Germany', 'UK', 'France'] },
      { id: 'sq-income-distribution', label: 'Income distribution',
        values: ['<$25k', '$25–50k', '$50–75k', '$75–100k', '$100k+'] },
      { id: 'sq-education',         label: 'Education level',
        values: ['No formal', 'Secondary', "Bachelor's", 'Postgraduate'] },
      { id: 'sq-employment',        label: 'Employment status',
        values: ['Employed full-time', 'Employed part-time', 'Self-employed', 'Student', 'Retired', 'Unemployed'] },
      { id: 'sq-household-size',    label: 'Household size',
        values: ['1 person', '2 people', '3–4 people', '5+ people'] },
    ],
  },
  {
    label: 'AI & smart technology',
    questions: [
      { id: 'sq-ai-awareness',     label: 'AI awareness & usage',
        values: ['Heavy user', 'Occasional user', 'Aware but non-user', 'Unaware'] },
      { id: 'sq-smart-home-ownership', label: 'Smart home device ownership',
        values: ['Own 3+', 'Own 1–2', 'None'] },
      { id: 'sq-ai-assistant-usage', label: 'AI assistant usage',
        values: ['Daily', 'Weekly', 'Monthly', 'Never'] },
      { id: 'sq-ai-attitudes',     label: 'Attitudes towards AI',
        values: ['Enthusiastic', 'Cautious optimist', 'Sceptical', 'Opposed'] },
      { id: 'sq-generative-ai',    label: 'Generative AI familiarity',
        values: ['Expert', 'Regular user', 'Tried it', 'Heard of it', 'Unaware'] },
    ],
  },
  {
    label: 'Consumer electronics',
    questions: [
      { id: 'sq-ce-attitudes',       label: 'Attitudes towards consumer electronics',
        values: ['Very positive', 'Positive', 'Neutral', 'Negative'] },
      { id: 'sq-ce-ownership',       label: 'Consumer electronics ownership',
        values: ['5+ devices', '3–4 devices', '1–2 devices', 'None'] },
      { id: 'sq-computing-ownership', label: 'Computing and personal tech ownership',
        values: ['5+ devices', '3–4 devices', '1–2 devices', 'None'] },
      { id: 'sq-ce-usage',           label: 'Consumer electronics usage',
        values: ['Daily', 'Several times a week', 'Weekly', 'Rarely'] },
    ],
  },
  {
    label: 'Fashion',
    questions: [
      { id: 'sq-fashion-spend',      label: 'Clothing & footwear spend',
        values: ['<$50/mo', '$50–100/mo', '$100–200/mo', '$200+/mo'] },
      { id: 'sq-fashion-interest',   label: 'Fashion interest & engagement',
        values: ['Very interested', 'Somewhat interested', 'Neutral', 'Not interested'] },
      { id: 'sq-sustainable-fashion', label: 'Sustainable fashion attitudes',
        values: ['Active buyer', 'Interested but passive', 'Indifferent', 'Sceptical'] },
      { id: 'sq-fashion-channels',   label: 'Fashion purchase channels',
        values: ['Online only', 'Mostly online', 'Mostly in-store', 'In-store only'] },
      { id: 'sq-fashion-brands',     label: 'Fashion brand awareness',
        values: ['Aware of 10+', 'Aware of 5–9', 'Aware of 1–4', 'None'] },
    ],
  },
  {
    label: 'Finance',
    questions: [
      { id: 'sq-income-bracket',      label: 'Income bracket',
        values: ['<$25k', '$25-50k', '$50-100k', '$100k+'] },
      { id: 'sq-investment-behavior', label: 'Investment behaviour',
        values: ['Active investor', 'Passive investor', 'Savings only', 'No investments'] },
      { id: 'sq-payment-methods',     label: 'Payment methods used',
        values: ['Card (credit/debit)', 'Digital wallet', 'Bank transfer', 'Cash'] },
      { id: 'sq-banking-usage',       label: 'Banking & fintech usage',
        values: ['Digital-first', 'Traditional bank', 'Mixed', 'Unbanked'] },
      { id: 'sq-crypto-awareness',    label: 'Crypto & digital asset awareness',
        values: ['Owner', 'Interested', 'Aware but uninterested', 'Unaware'] },
      { id: 'sq-financial-wellbeing', label: 'Financial wellbeing',
        values: ['Comfortable', 'Managing', 'Struggling', 'In difficulty'] },
    ],
  },
  {
    label: 'Food & consumption',
    questions: [
      { id: 'sq-food-spend',          label: 'Food & beverage spend',
        values: ['<$200/mo', '$200–400/mo', '$400–600/mo', '$600+/mo'] },
      { id: 'sq-organic-food',        label: 'Organic food preference',
        values: ['Always organic', 'Often organic', 'Sometimes', 'Never'] },
      { id: 'sq-restaurant-frequency', label: 'Restaurant & dining frequency',
        values: ['Daily', 'Several times/week', 'Weekly', 'Monthly', 'Rarely'] },
      { id: 'sq-food-delivery',       label: 'Food delivery usage',
        values: ['Weekly+', '2–3×/month', 'Monthly', 'Rarely', 'Never'] },
      { id: 'sq-dietary-habits',      label: 'Dietary habits & restrictions',
        values: ['Omnivore', 'Flexitarian', 'Vegetarian', 'Vegan', 'Other'] },
    ],
  },
  {
    label: 'Health',
    questions: [
      { id: 'sq-health-insurance',    label: 'Health insurance type',
        values: ['Private', 'Public / state', 'Employer-provided', 'None'] },
      { id: 'sq-fitness-activity',    label: 'Fitness activity level',
        values: ['Daily', 'Several times/week', 'Weekly', 'Rarely', 'Never'] },
      { id: 'sq-health-consciousness', label: 'Health consciousness',
        values: ['Very', 'Somewhat', 'Neutral', 'Not very'] },
      { id: 'sq-mental-health',       label: 'Mental health awareness',
        values: ['High awareness', 'Moderate', 'Low', 'Not engaged'] },
      { id: 'sq-supplement-usage',    label: 'Supplement & vitamin usage',
        values: ['Daily', 'Occasionally', 'Rarely', 'Never'] },
    ],
  },
  {
    label: 'Housing & household equipment',
    questions: [
      { id: 'sq-housing-type',         label: 'Housing type',
        values: ['House', 'Apartment', 'Condo', 'Other'] },
      { id: 'sq-home-ownership',       label: 'Home ownership status',
        values: ['Own outright', 'Mortgaged', 'Renting', 'Other'] },
      { id: 'sq-household-appliances', label: 'Household appliance ownership',
        values: ['High-end (5+)', 'Mid-range (3–4)', 'Basic (1–2)', 'Minimal'] },
      { id: 'sq-home-renovation',      label: 'Home renovation intent',
        values: ['Planning soon', 'Considering', 'No plans'] },
    ],
  },
  {
    label: 'Insurance',
    questions: [
      { id: 'sq-insurance-attitudes', label: 'Attitudes towards insurances',
        values: ['Proactive', 'Reactive', 'Indifferent', 'Avoidant'] },
      { id: 'sq-insurance-owned',     label: 'Insurances owned by type',
        values: ['Health', 'Car', 'Home', 'Life', 'Travel'] },
      { id: 'sq-insurance-owner',     label: 'Insurance owner status',
        values: ['Owner', 'Non-owner'] },
    ],
  },
  {
    label: 'Internet & smartphone',
    questions: [
      { id: 'sq-internet-usage',      label: 'Internet usage frequency',
        values: ['Always on', 'Several hrs/day', '1–2 hrs/day', 'Occasionally'] },
      { id: 'sq-smartphone-type',     label: 'Smartphone type & OS',
        values: ['Android', 'iOS', 'Other'] },
      { id: 'sq-mobile-data',         label: 'Mobile data usage',
        values: ['Heavy (10GB+)', 'Moderate (5–10GB)', 'Light (<5GB)', 'Wi-Fi only'] },
      { id: 'sq-internet-activities', label: 'Online activities',
        values: ['Shopping', 'Social media', 'News', 'Entertainment', 'Work'] },
    ],
  },
  {
    label: 'Media & news',
    questions: [
      { id: 'sq-news-consumption', label: 'News consumption habits',
        values: ['Several times/day', 'Daily', 'Few times/week', 'Rarely'] },
      { id: 'sq-streaming-subs',   label: 'Streaming subscriptions',
        values: ['4+', '2–3', '1', 'None'] },
      { id: 'sq-media-time',       label: 'Daily media time spent',
        values: ['<1 hr', '1–2 hrs', '2–4 hrs', '4+ hrs'] },
      { id: 'sq-podcast-usage',    label: 'Podcast listening habits',
        values: ['Daily', 'Weekly', 'Occasionally', 'Never'] },
    ],
  },
  {
    label: 'Mobility',
    questions: [
      { id: 'sq-transport-mode', label: 'Primary transport mode',
        values: ['Car', 'Public transit', 'Bicycle', 'Other'] },
      { id: 'sq-car-ownership',  label: 'Car ownership status',
        values: ['Own (ICE)', 'Own (EV/Hybrid)', 'Lease', 'No car'] },
      { id: 'sq-ev-interest',    label: 'Electric vehicle interest',
        values: ['Very likely to buy', 'Likely', 'Undecided', 'Unlikely', "Won't buy"] },
      { id: 'sq-public-transit', label: 'Public transit usage',
        values: ['Daily', 'Several times/week', 'Occasionally', 'Never'] },
    ],
  },
  {
    label: 'Online shopping',
    questions: [
      { id: 'sq-online-spend',        label: 'Online shopping spend',
        values: ['<$50/mo', '$50–150/mo', '$150–300/mo', '$300+/mo'] },
      { id: 'sq-purchase-frequency',  label: 'Purchase frequency',
        values: ['Daily', 'Weekly', '2–3×/month', 'Monthly', 'Rarely'] },
      { id: 'sq-preferred-retailer',  label: 'Preferred retailer',
        values: ['Amazon', 'Specialist e-tailer', 'Brand direct', 'Marketplace', 'In-store'] },
      { id: 'sq-returns-behavior',    label: 'Returns behaviour',
        values: ['Frequent returner', 'Occasional', 'Rarely returns'] },
    ],
  },
  {
    label: 'Personal care',
    questions: [
      { id: 'sq-personal-care-spend', label: 'Personal care spend',
        values: ['<$30/mo', '$30–60/mo', '$60–100/mo', '$100+/mo'] },
      { id: 'sq-grooming-frequency',  label: 'Grooming frequency',
        values: ['Daily', 'Several times/week', 'Weekly', 'Less often'] },
      { id: 'sq-beauty-brands',       label: 'Beauty brand usage',
        values: ['Luxury', 'Mid-range', 'Drug store / mass', 'No preference'] },
    ],
  },
  {
    label: 'Print media & ePublishing',
    questions: [
      { id: 'sq-print-media-read', label: 'Print media readership',
        values: ['Daily', 'Weekly', 'Monthly', 'Never'] },
      { id: 'sq-ebook-usage',      label: 'eBook & digital reading usage',
        values: ['Heavy reader', 'Occasional', 'Rarely', 'Never'] },
      { id: 'sq-magazine-subs',    label: 'Magazine subscriptions',
        values: ['3+', '1–2', 'None'] },
    ],
  },
  {
    label: 'Retail shopping',
    questions: [
      { id: 'sq-retail-spend',      label: 'Retail shopping spend',
        values: ['<$100/mo', '$100–200/mo', '$200–400/mo', '$400+/mo'] },
      { id: 'sq-store-preference',  label: 'Store preference (online vs. in-store)',
        values: ['Online only', 'Mostly online', 'Mixed', 'Mostly in-store', 'In-store only'] },
      { id: 'sq-loyalty-programs',  label: 'Loyalty programme usage',
        values: ['Active member 3+', 'Active member 1–2', 'Inactive member', 'Non-member'] },
    ],
  },
  {
    label: 'Services & eServices',
    questions: [
      { id: 'sq-service-subs',    label: 'Service subscriptions',
        values: ['5+', '3–4', '1–2', 'None'] },
      { id: 'sq-digital-services', label: 'Digital services usage',
        values: ['Daily', 'Several times/week', 'Weekly', 'Rarely'] },
      { id: 'sq-gig-economy',     label: 'Gig economy & freelance usage',
        values: ['Regular user', 'Occasional', 'Rarely', 'Never'] },
    ],
  },
  {
    label: 'Social media & marketing',
    questions: [
      { id: 'sq-social-platforms',      label: 'Social media platforms used',
        values: ['Facebook', 'Instagram', 'TikTok', 'YouTube'] },
      { id: 'sq-social-time',           label: 'Daily social media time',
        values: ['<30 min', '30 min–1 hr', '1–2 hrs', '2–4 hrs', '4+ hrs'] },
      { id: 'sq-influencer-engagement', label: 'Influencer engagement',
        values: ['Regular buyer', 'Occasional', 'Follower only', 'Not influenced'] },
      { id: 'sq-ad-attitudes',          label: 'Attitudes towards advertising',
        values: ['Receptive', 'Neutral', 'Ad-avoidant', 'Ad-blocker user'] },
    ],
  },
  {
    label: 'Travel',
    questions: [
      { id: 'sq-annual-trips',        label: 'Annual trip frequency',
        values: ['6+ trips', '3–5 trips', '1–2 trips', 'None'] },
      { id: 'sq-travel-budget',       label: 'Travel budget',
        values: ['<$1k', '$1–3k', '$3–6k', '$6k+'] },
      { id: 'sq-accommodation-type',  label: 'Accommodation preference',
        values: ['Hotel', 'Vacation rental', 'Hostel', 'Staying with friends/family'] },
      { id: 'sq-travel-planning',     label: 'Travel planning channels',
        values: ['Online OTA', 'Direct booking', 'Travel agent', 'App'] },
    ],
  },
  {
    label: 'Video games',
    questions: [
      { id: 'sq-gaming-frequency', label: 'Gaming frequency',
        values: ['Daily', 'Several times/week', 'Weekly', 'Rarely', 'Never'] },
      { id: 'sq-gaming-platform',  label: 'Gaming platform',
        values: ['PC', 'Console', 'Mobile'] },
      { id: 'sq-gaming-spend',     label: 'Gaming spend',
        values: ['<$10/mo', '$10–30/mo', '$30–60/mo', '$60+/mo'] },
      { id: 'sq-esports',          label: 'Esports & streaming viewership',
        values: ['Weekly+', 'Monthly', 'Occasionally', 'Never'] },
    ],
  },
]

// Derived lookup: question label → dimension values
// This is the single source of truth — do not maintain a parallel map elsewhere.
export const QUESTION_VALUES: Record<string, string[]> = Object.fromEntries(
  SURVEY_CATALOG.flatMap(cat => cat.questions)
    .filter(q => q.values)
    .map(q => [q.label, q.values!])
)
