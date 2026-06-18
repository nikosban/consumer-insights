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
}

export type SurveyCategory = {
  label: string
  questions: SurveyQuestion[]
}

export const SURVEY_CATALOG: SurveyCategory[] = [
  {
    label: 'Survey details',
    questions: [
      { id: 'sq-survey-country', label: 'Survey country' },
      { id: 'sq-survey-year', label: 'Survey year' },
      { id: 'sq-survey-wave', label: 'Survey wave' },
    ],
  },
  {
    label: 'Characteristics & demographics',
    questions: [
      { id: 'sq-gender', label: 'Gender' },
      { id: 'sq-age-distribution', label: 'Age distribution' },
      { id: 'sq-age-detailed', label: 'Detailed age groups' },
      { id: 'sq-gen-breakdown', label: 'Generational breakdown' },
      { id: 'sq-country-residence', label: 'Country of residence' },
      { id: 'sq-income-distribution', label: 'Income distribution' },
      { id: 'sq-education', label: 'Education level' },
      { id: 'sq-employment', label: 'Employment status' },
      { id: 'sq-household-size', label: 'Household size' },
    ],
  },
  {
    label: 'AI & smart technology',
    questions: [
      { id: 'sq-ai-awareness', label: 'AI awareness & usage' },
      { id: 'sq-smart-home-ownership', label: 'Smart home device ownership' },
      { id: 'sq-ai-assistant-usage', label: 'AI assistant usage' },
      { id: 'sq-ai-attitudes', label: 'Attitudes towards AI' },
      { id: 'sq-generative-ai', label: 'Generative AI familiarity' },
    ],
  },
  {
    label: 'Consumer electronics',
    questions: [
      { id: 'sq-ce-attitudes', label: 'Attitudes towards consumer electronics' },
      { id: 'sq-ce-ownership', label: 'Consumer electronics ownership' },
      { id: 'sq-computing-ownership', label: 'Computing and personal tech ownership' },
      { id: 'sq-ce-usage', label: 'Consumer electronics usage' },
    ],
  },
  {
    label: 'Fashion',
    questions: [
      { id: 'sq-fashion-spend', label: 'Clothing & footwear spend' },
      { id: 'sq-fashion-interest', label: 'Fashion interest & engagement' },
      { id: 'sq-sustainable-fashion', label: 'Sustainable fashion attitudes' },
      { id: 'sq-fashion-channels', label: 'Fashion purchase channels' },
      { id: 'sq-fashion-brands', label: 'Fashion brand awareness' },
    ],
  },
  {
    label: 'Finance',
    questions: [
      { id: 'sq-income-bracket', label: 'Income bracket' },
      { id: 'sq-investment-behavior', label: 'Investment behaviour' },
      { id: 'sq-payment-methods', label: 'Payment methods used' },
      { id: 'sq-banking-usage', label: 'Banking & fintech usage' },
      { id: 'sq-crypto-awareness', label: 'Crypto & digital asset awareness' },
      { id: 'sq-financial-wellbeing', label: 'Financial wellbeing' },
    ],
  },
  {
    label: 'Food & consumption',
    questions: [
      { id: 'sq-food-spend', label: 'Food & beverage spend' },
      { id: 'sq-organic-food', label: 'Organic food preference' },
      { id: 'sq-restaurant-frequency', label: 'Restaurant & dining frequency' },
      { id: 'sq-food-delivery', label: 'Food delivery usage' },
      { id: 'sq-dietary-habits', label: 'Dietary habits & restrictions' },
    ],
  },
  {
    label: 'Health',
    questions: [
      { id: 'sq-health-insurance', label: 'Health insurance type' },
      { id: 'sq-fitness-activity', label: 'Fitness activity level' },
      { id: 'sq-health-consciousness', label: 'Health consciousness' },
      { id: 'sq-mental-health', label: 'Mental health awareness' },
      { id: 'sq-supplement-usage', label: 'Supplement & vitamin usage' },
    ],
  },
  {
    label: 'Housing & household equipment',
    questions: [
      { id: 'sq-housing-type', label: 'Housing type' },
      { id: 'sq-home-ownership', label: 'Home ownership status' },
      { id: 'sq-household-appliances', label: 'Household appliance ownership' },
      { id: 'sq-home-renovation', label: 'Home renovation intent' },
    ],
  },
  {
    label: 'Insurance',
    questions: [
      { id: 'sq-insurance-attitudes', label: 'Attitudes towards insurances' },
      { id: 'sq-insurance-owned', label: 'Insurances owned by type' },
      { id: 'sq-insurance-owner', label: 'Insurance owner status' },
    ],
  },
  {
    label: 'Internet & smartphone',
    questions: [
      { id: 'sq-internet-usage', label: 'Internet usage frequency' },
      { id: 'sq-smartphone-type', label: 'Smartphone type & OS' },
      { id: 'sq-mobile-data', label: 'Mobile data usage' },
      { id: 'sq-internet-activities', label: 'Online activities' },
    ],
  },
  {
    label: 'Media & news',
    questions: [
      { id: 'sq-news-consumption', label: 'News consumption habits' },
      { id: 'sq-streaming-subs', label: 'Streaming subscriptions' },
      { id: 'sq-media-time', label: 'Daily media time spent' },
      { id: 'sq-podcast-usage', label: 'Podcast listening habits' },
    ],
  },
  {
    label: 'Mobility',
    questions: [
      { id: 'sq-transport-mode', label: 'Primary transport mode' },
      { id: 'sq-car-ownership', label: 'Car ownership status' },
      { id: 'sq-ev-interest', label: 'Electric vehicle interest' },
      { id: 'sq-public-transit', label: 'Public transit usage' },
    ],
  },
  {
    label: 'Online shopping',
    questions: [
      { id: 'sq-online-spend', label: 'Online shopping spend' },
      { id: 'sq-purchase-frequency', label: 'Purchase frequency' },
      { id: 'sq-preferred-retailer', label: 'Preferred retailer' },
      { id: 'sq-returns-behavior', label: 'Returns behaviour' },
    ],
  },
  {
    label: 'Personal care',
    questions: [
      { id: 'sq-personal-care-spend', label: 'Personal care spend' },
      { id: 'sq-grooming-frequency', label: 'Grooming frequency' },
      { id: 'sq-beauty-brands', label: 'Beauty brand usage' },
    ],
  },
  {
    label: 'Print media & ePublishing',
    questions: [
      { id: 'sq-print-media-read', label: 'Print media readership' },
      { id: 'sq-ebook-usage', label: 'eBook & digital reading usage' },
      { id: 'sq-magazine-subs', label: 'Magazine subscriptions' },
    ],
  },
  {
    label: 'Retail shopping',
    questions: [
      { id: 'sq-retail-spend', label: 'Retail shopping spend' },
      { id: 'sq-store-preference', label: 'Store preference (online vs. in-store)' },
      { id: 'sq-loyalty-programs', label: 'Loyalty programme usage' },
    ],
  },
  {
    label: 'Services & eServices',
    questions: [
      { id: 'sq-service-subs', label: 'Service subscriptions' },
      { id: 'sq-digital-services', label: 'Digital services usage' },
      { id: 'sq-gig-economy', label: 'Gig economy & freelance usage' },
    ],
  },
  {
    label: 'Social media & marketing',
    questions: [
      { id: 'sq-social-platforms', label: 'Social media platforms used' },
      { id: 'sq-social-time', label: 'Daily social media time' },
      { id: 'sq-influencer-engagement', label: 'Influencer engagement' },
      { id: 'sq-ad-attitudes', label: 'Attitudes towards advertising' },
    ],
  },
  {
    label: 'Travel',
    questions: [
      { id: 'sq-annual-trips', label: 'Annual trip frequency' },
      { id: 'sq-travel-budget', label: 'Travel budget' },
      { id: 'sq-accommodation-type', label: 'Accommodation preference' },
      { id: 'sq-travel-planning', label: 'Travel planning channels' },
    ],
  },
  {
    label: 'Video games',
    questions: [
      { id: 'sq-gaming-frequency', label: 'Gaming frequency' },
      { id: 'sq-gaming-platform', label: 'Gaming platform' },
      { id: 'sq-gaming-spend', label: 'Gaming spend' },
      { id: 'sq-esports', label: 'Esports & streaming viewership' },
    ],
  },
]
