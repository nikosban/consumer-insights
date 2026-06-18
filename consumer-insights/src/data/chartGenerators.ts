import type { ChartData, WidgetType } from '@/types';

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
  'Car ownership status':         ['Own (ICE)', 'Own (EV/Hybrid)', 'Lease', 'No car'],
  'Housing type':                 ['House', 'Apartment', 'Condo', 'Other'],
  'Primary transport mode':       ['Car', 'Public transit', 'Bicycle', 'Other'],
  'EV Purchase Intent %':         ['Very likely', 'Likely', 'Might', 'Comparing', 'Not interested'],
  'Settlement type':              ['Urban', 'Suburban', 'Rural'],
  'Generational breakdown':       ['Gen Z (18–27)', 'Millennials (28–43)', 'Gen X (44–59)', 'Baby Boomers (60–78)', 'Silent Gen (79+)'],
  'Country of residence (EV)':    ['Germany', 'France', 'United States'],
}

function barData(withBenchmark: boolean, breakdown?: string, audienceName?: string, benchmarkName?: string): ChartData {
  const labels: string[] = (breakdown ? BREAKDOWN_LABELS[breakdown] : undefined) ?? ['18-24', '25-34', '35-44', '45-54', '55+'];
  const series = [{ name: audienceName ?? 'Audience', values: labels.map(() => rand(20, 85)) }];
  if (withBenchmark) series.push({ name: benchmarkName ?? 'Benchmark', values: labels.map(() => rand(20, 85)) });
  return { labels, series };
}

function lineData(): ChartData {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return {
    labels,
    series: [{ name: 'Trend', values: labels.map((_, i) => rand(30, 40) + i * rand(1, 5)) }],
  };
}

function pieData(breakdown?: string): ChartData {
  const labels = (breakdown ? BREAKDOWN_LABELS[breakdown] : undefined) ?? ['Mobile', 'Desktop', 'Tablet', 'Other'];
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
  // ── Characteristics & demographics ──
  'Gender':                                ['Male', 'Female', 'Non-binary'],
  'Gender split':                          ['Male', 'Female', 'Non-binary'],
  'Age distribution':                      ['18-24', '25-34', '35-44', '45-54', '55+'],
  'Detailed age groups':                   ['18-20', '21-24', '25-29', '30-34', '35-39', '40-44', '45-54', '55-64', '65+'],
  'Generational breakdown':                ['Gen Z (18–27)', 'Millennials (28–43)', 'Gen X (44–59)', 'Baby Boomers (60–78)'],
  'Country of residence':                  ['US', 'Germany', 'UK', 'France'],
  'Country of residence (EV)':             ['Germany', 'France', 'United States'],
  'Income distribution':                   ['<$25k', '$25–50k', '$50–75k', '$75–100k', '$100k+'],
  'Income bracket':                        ['<$25k', '$25-50k', '$50-100k', '$100k+'],
  'Income bracket distribution':           ['<$25k', '$25–50k', '$50–75k', '$75–100k', '$100k+'],
  'Education level':                       ['No formal', 'Secondary', 'Bachelor\'s', 'Postgraduate'],
  'Employment status':                     ['Employed full-time', 'Employed part-time', 'Self-employed', 'Student', 'Retired', 'Unemployed'],
  'Household size':                        ['1 person', '2 people', '3–4 people', '5+ people'],
  'Household size distribution':           ['1 person', '2 people', '3–4 people', '5+ people'],

  // ── AI & smart technology ──
  'AI awareness & usage':                  ['Heavy user', 'Occasional user', 'Aware but non-user', 'Unaware'],
  'AI assistant adoption':                 ['Daily', 'Weekly', 'Monthly', 'Never'],
  'AI assistant usage':                    ['Daily', 'Weekly', 'Monthly', 'Never'],
  'Smart home device ownership':           ['Own 3+', 'Own 1–2', 'None'],
  'Attitudes towards AI':                  ['Enthusiastic', 'Cautious optimist', 'Sceptical', 'Opposed'],
  'Generative AI familiarity':             ['Expert', 'Regular user', 'Tried it', 'Heard of it', 'Unaware'],

  // ── Consumer electronics ──
  'Attitudes towards consumer electronics':['Very positive', 'Positive', 'Neutral', 'Negative'],
  'Consumer electronics ownership':        ['5+ devices', '3–4 devices', '1–2 devices', 'None'],
  'Computing and personal tech ownership': ['5+ devices', '3–4 devices', '1–2 devices', 'None'],
  'Consumer electronics usage':            ['Daily', 'Several times a week', 'Weekly', 'Rarely'],
  'Device type breakdown':                 ['Smartphone', 'Laptop', 'Desktop', 'Tablet', 'Smart TV'],
  'Streaming device ownership':            ['Smart TV', 'Game console', 'Streaming stick', 'Smartphone/tablet', 'None'],

  // ── Fashion ──
  'Clothing & footwear spend':             ['<$50/mo', '$50–100/mo', '$100–200/mo', '$200+/mo'],
  'Clothing spend by age group':           ['18-24', '25-34', '35-44', '45-54', '55+'],
  'Fashion interest & engagement':         ['Very interested', 'Somewhat interested', 'Neutral', 'Not interested'],
  'Fashion interest over time':            ['Growing', 'Stable', 'Declining'],
  'Sustainable fashion attitudes':         ['Active buyer', 'Interested but passive', 'Indifferent', 'Sceptical'],
  'Sustainable fashion interest':          ['Very interested', 'Interested', 'Neutral', 'Not interested'],
  'Fashion purchase channels':             ['Online only', 'Mostly online', 'Mostly in-store', 'In-store only'],
  'Fashion brand awareness':               ['Aware of 10+', 'Aware of 5–9', 'Aware of 1–4', 'None'],

  // ── Finance ──
  'Investment behaviour':                  ['Active investor', 'Passive investor', 'Savings only', 'No investments'],
  'Payment methods used':                  ['Card (credit/debit)', 'Digital wallet', 'Bank transfer', 'Cash'],
  'Preferred payment methods':             ['Card (credit/debit)', 'Digital wallet', 'Bank transfer', 'Cash'],
  'Banking & fintech usage':               ['Digital-first', 'Traditional bank', 'Mixed', 'Unbanked'],
  'Crypto & digital asset awareness':      ['Owner', 'Interested', 'Aware but uninterested', 'Unaware'],
  'Financial wellbeing':                   ['Comfortable', 'Managing', 'Struggling', 'In difficulty'],

  // ── Food & consumption ──
  'Food & beverage spend':                 ['<$200/mo', '$200–400/mo', '$400–600/mo', '$600+/mo'],
  'Monthly food spend':                    ['<$200/mo', '$200–400/mo', '$400–600/mo', '$600+/mo'],
  'Organic food preference':               ['Always organic', 'Often organic', 'Sometimes', 'Never'],
  'Restaurant & dining frequency':         ['Daily', 'Several times/week', 'Weekly', 'Monthly', 'Rarely'],
  'Restaurant visit frequency':            ['Daily', 'Several times/week', 'Weekly', 'Monthly', 'Rarely'],
  'Food delivery usage':                   ['Weekly+', '2–3×/month', 'Monthly', 'Rarely', 'Never'],
  'Dietary habits & restrictions':         ['Omnivore', 'Flexitarian', 'Vegetarian', 'Vegan', 'Other'],

  // ── Health ──
  'Health insurance type':                 ['Private', 'Public / state', 'Employer-provided', 'None'],
  'Fitness activity level':                ['Daily', 'Several times/week', 'Weekly', 'Rarely', 'Never'],
  'Fitness activity frequency':            ['Daily', 'Several times/week', 'Weekly', 'Rarely', 'Never'],
  'Health consciousness':                  ['Very', 'Somewhat', 'Neutral', 'Not very'],
  'Health consciousness level':            ['Very', 'Somewhat', 'Neutral', 'Not very'],
  'Mental health awareness':               ['High awareness', 'Moderate', 'Low', 'Not engaged'],
  'Supplement & vitamin usage':            ['Daily', 'Occasionally', 'Rarely', 'Never'],

  // ── Housing & household equipment ──
  'Housing type':                          ['House', 'Apartment', 'Condo', 'Other'],
  'Housing type breakdown':                ['House', 'Apartment', 'Condo', 'Other'],
  'Home ownership status':                 ['Own outright', 'Mortgaged', 'Renting', 'Other'],
  'Household appliance ownership':         ['High-end (5+)', 'Mid-range (3–4)', 'Basic (1–2)', 'Minimal'],
  'Home renovation intent':                ['Planning soon', 'Considering', 'No plans'],

  // ── Insurance ──
  'Attitudes towards insurances':          ['Proactive', 'Reactive', 'Indifferent', 'Avoidant'],
  'Insurances owned by type':              ['Health', 'Car', 'Home', 'Life', 'Travel'],
  'Insurance types owned':                 ['Health', 'Car', 'Home', 'Life', 'Travel'],
  'Insurance owner status':               ['Owner', 'Non-owner'],
  'Insurance ownership rate':              ['Owner', 'Non-owner'],

  // ── Internet & smartphone ──
  'Internet usage frequency':              ['Always on', 'Several hrs/day', '1–2 hrs/day', 'Occasionally'],
  'Smartphone type & OS':                  ['Android', 'iOS', 'Other'],
  'Smartphone OS distribution':            ['Android', 'iOS', 'Other'],
  'Mobile data usage':                     ['Heavy (10GB+)', 'Moderate (5–10GB)', 'Light (<5GB)', 'Wi-Fi only'],
  'Mobile data usage by age':              ['18-24', '25-34', '35-44', '45-54', '55+'],
  'Online activities':                     ['Shopping', 'Social media', 'News', 'Entertainment', 'Work'],

  // ── Media & news ──
  'News consumption habits':               ['Several times/day', 'Daily', 'Few times/week', 'Rarely'],
  'News consumption frequency':            ['Several times/day', 'Daily', 'Few times/week', 'Rarely'],
  'Streaming subscriptions':               ['4+', '2–3', '1', 'None'],
  'Streaming subscription share':          ['4+', '2–3', '1', 'None'],
  'Daily media time spent':                ['<1 hr', '1–2 hrs', '2–4 hrs', '4+ hrs'],
  'Podcast listening habits':              ['Daily', 'Weekly', 'Occasionally', 'Never'],

  // ── Mobility ──
  'Primary transport mode':                ['Car', 'Public transit', 'Bicycle', 'Other'],
  'Car ownership status':                  ['Own (ICE)', 'Own (EV/Hybrid)', 'Lease', 'No car'],
  'Electric vehicle interest':             ['Very likely to buy', 'Likely', 'Undecided', 'Unlikely', 'Won\'t buy'],
  'EV purchase intent':                    ['Very likely', 'Likely', 'Undecided', 'Unlikely', 'Won\'t buy'],
  'Sustainability interest':               ['Very interested', 'Interested', 'Neutral', 'Not interested'],
  'Public transit usage':                  ['Daily', 'Several times/week', 'Occasionally', 'Never'],
  'Settlement type':                       ['Urban', 'Suburban', 'Rural'],
  'Travel frequency distribution':         ['6+ trips/yr', '3–5 trips/yr', '1–2 trips/yr', 'None'],

  // ── Online shopping ──
  'Online shopping spend':                 ['<$50/mo', '$50–150/mo', '$150–300/mo', '$300+/mo'],
  'Monthly online spend':                  ['<$50/mo', '$50–150/mo', '$150–300/mo', '$300+/mo'],
  'Purchase frequency':                    ['Daily', 'Weekly', '2–3×/month', 'Monthly', 'Rarely'],
  'Preferred retailer':                    ['Amazon', 'Specialist e-tailer', 'Brand direct', 'Marketplace', 'In-store'],
  'Returns behaviour':                     ['Frequent returner', 'Occasional', 'Rarely returns'],

  // ── Personal care ──
  'Personal care spend':                   ['<$30/mo', '$30–60/mo', '$60–100/mo', '$100+/mo'],
  'Personal care monthly spend':           ['<$30/mo', '$30–60/mo', '$60–100/mo', '$100+/mo'],
  'Grooming frequency':                    ['Daily', 'Several times/week', 'Weekly', 'Less often'],
  'Beauty brand usage':                    ['Luxury', 'Mid-range', 'Drug store / mass', 'No preference'],

  // ── Print media & ePublishing ──
  'Print media readership':                ['Daily', 'Weekly', 'Monthly', 'Never'],
  'eBook & digital reading usage':         ['Heavy reader', 'Occasional', 'Rarely', 'Never'],
  'eBook usage rate':                      ['Heavy reader', 'Occasional', 'Rarely', 'Never'],
  'Magazine subscriptions':               ['3+', '1–2', 'None'],

  // ── Retail shopping ──
  'Retail shopping spend':                 ['<$100/mo', '$100–200/mo', '$200–400/mo', '$400+/mo'],
  'Monthly retail spend':                  ['<$100/mo', '$100–200/mo', '$200–400/mo', '$400+/mo'],
  'Store preference (online vs. in-store)':['Online only', 'Mostly online', 'Mixed', 'Mostly in-store', 'In-store only'],
  'Preferred store type':                  ['Online only', 'Mostly online', 'Mixed', 'Mostly in-store', 'In-store only'],
  'Loyalty programme usage':               ['Active member 3+', 'Active member 1–2', 'Inactive member', 'Non-member'],
  'Loyalty programme membership':          ['Active member 3+', 'Active member 1–2', 'Inactive member', 'Non-member'],

  // ── Services & eServices ──
  'Service subscriptions':                 ['5+', '3–4', '1–2', 'None'],
  'Service subscriptions held':            ['5+', '3–4', '1–2', 'None'],
  'Digital services usage':                ['Daily', 'Several times/week', 'Weekly', 'Rarely'],
  'Gig economy & freelance usage':         ['Regular user', 'Occasional', 'Rarely', 'Never'],

  // ── Social media & marketing ──
  'Social media platforms used':           ['Facebook', 'Instagram', 'TikTok', 'YouTube'],
  'Daily social media time':               ['<30 min', '30 min–1 hr', '1–2 hrs', '2–4 hrs', '4+ hrs'],
  'Influencer engagement':                 ['Regular buyer', 'Occasional', 'Follower only', 'Not influenced'],
  'Influencer engagement rate':            ['Regular buyer', 'Occasional', 'Follower only', 'Not influenced'],
  'Attitudes towards advertising':         ['Receptive', 'Neutral', 'Ad-avoidant', 'Ad-blocker user'],

  // ── Travel ──
  'Annual trip frequency':                 ['6+ trips', '3–5 trips', '1–2 trips', 'None'],
  'Annual trips taken':                    ['6+ trips', '3–5 trips', '1–2 trips', 'None'],
  'Travel budget':                         ['<$1k', '$1–3k', '$3–6k', '$6k+'],
  'Travel budget distribution':            ['<$1k', '$1–3k', '$3–6k', '$6k+'],
  'Accommodation preference':              ['Hotel', 'Vacation rental', 'Hostel', 'Staying with friends/family'],
  'Travel planning channels':              ['Online OTA', 'Direct booking', 'Travel agent', 'App'],

  // ── Video games ──
  'Gaming frequency':                      ['Daily', 'Several times/week', 'Weekly', 'Rarely', 'Never'],
  'Gaming platform':                       ['PC', 'Console', 'Mobile'],
  'Gaming platform split':                 ['PC', 'Console', 'Mobile'],
  'Gaming spend':                          ['<$10/mo', '$10–30/mo', '$30–60/mo', '$60+/mo'],
  'Monthly gaming spend':                  ['<$10/mo', '$10–30/mo', '$30–60/mo', '$60+/mo'],
  'Esports & streaming viewership':        ['Weekly+', 'Monthly', 'Occasionally', 'Never'],
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
  audienceName?: string,
  benchmarkName?: string,
): ChartData {
  seedRng(seed ? `${seed}:${type}:${crossDimensionLabel ?? ''}` : undefined)
  if (type === 'table' && crossDimensionLabel) return crosstableData(crossDimensionLabel, undefined, metric, category)
  switch (type) {
    case 'bar':       return barData(hasBenchmark, breakdown, audienceName, benchmarkName)
    case 'line':      return lineData()
    case 'pie':       return pieData(breakdown)
    case 'scorecard': return scorecardData(hasBenchmark)
    case 'table':     return surveyTableData(metric, category)
    default:          return surveyTableData(metric, category)
  }
}
