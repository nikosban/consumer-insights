import type { AIMessage } from '@/types'
import {
  EV_PROCESSING_STEPS, EV_AI_TEXT, EV_BENCHMARK_PANEL,
  EV_WIDGET_CLUSTER, EV_AUDIENCE_DRAFT, EV_FOLLOW_UPS,
} from './fakeGenerators'

// ─── 1. Headphones — text + single chart ─────────────────────────────────────

const HEADPHONES: AIMessage[] = [
  {
    id: 'ph-u1',
    role: 'user',
    content: 'What is the purchase intent for premium headphones among 25–34 year-olds in Germany?',
  },
  {
    id: 'ph-a1',
    role: 'assistant',
    content:
      '**58% of 25–34 year-olds in Germany express high or very high purchase intent for premium headphones** in the next 12 months — well above the all-age average of 41%.\n\nThe segment is driven by remote-work adoption and a shift toward premium audio for both professional and leisure use. Sony and Apple lead brand consideration, with Bose maintaining strong loyalty among repeat buyers.',
    messageType: 'data_widget',
    dataWidget: {
      title: 'Premium Headphone Purchase Intent by Age — Germany',
      subtitle: 'High / very high intent, 2024',
      chartType: 'bar',
      metric: 'Purchase intent',
      source: 'Statista Consumer Electronics Survey DE, 2024 (n=4,812)',
      chartData: {
        labels: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
        series: [{ name: 'High intent (%)', values: [52, 58, 43, 31, 22, 14] }],
      },
    },
    suggestedFollowUps: [
      'Which brands lead in consideration among this segment?',
      'How does this compare to the UK market?',
      'Break down by income level within the 25–34 group',
    ],
    attribution: 'Consumer Electronics Survey DE, 2024 (n=4,812)',
  },
]

// ─── 2. Gen Z sustainability — chart + audience draft ─────────────────────────

const GENZ_SUSTAINABILITY: AIMessage[] = [
  {
    id: 'gz-u1',
    role: 'user',
    content: 'What are Gen Z consumer attitudes toward sustainable brands in Western Europe?',
  },
  {
    id: 'gz-a1',
    role: 'assistant',
    content:
      '**72% of Gen Z consumers in Western Europe say sustainability credentials influence their purchase decisions** — the highest share of any generation. However, only 38% are willing to pay a meaningful premium (>10%) for sustainable alternatives, revealing a significant attitude–behaviour gap.\n\nThe gap is widest in Germany and France, where price sensitivity among younger cohorts remains high despite strong environmental values.',
    messageType: 'data_widget',
    dataWidget: {
      title: 'Gen Z Sustainability Attitudes — Western Europe',
      subtitle: 'Agree / strongly agree by statement, 2024',
      chartType: 'bar',
      metric: 'Attitude agreement rate',
      source: 'Statista Consumer Values Survey EU, 2024 (n=6,340)',
      chartData: {
        labels: [
          'Sustainability influences brand choice',
          'Actively seeks eco-certified products',
          'Researches brand environmental record',
          'Trusts sustainability claims',
          'Would pay 10%+ more for sustainable',
        ],
        series: [{ name: 'Agree / Strongly agree (%)', values: [72, 61, 55, 44, 38] }],
      },
    },
    suggestedFollowUps: [
      'Build an audience of sustainability-driven Gen Z buyers',
      'Which markets show the strongest willingness to pay?',
      'How do Millennials compare on these attitudes?',
    ],
    attribution: 'Consumer Values Survey EU, 2024 (n=6,340)',
  },
  {
    id: 'gz-u2',
    role: 'user',
    content: 'Build an audience of sustainability-driven Gen Z buyers',
  },
  {
    id: 'gz-a2',
    role: 'assistant',
    content:
      "Based on the attitude data, I've identified a high-conviction segment: **Eco-Committed Gen Z** — those who both strongly agree that sustainability influences their choices AND express willingness to pay a premium. This audience sits at roughly **9.4M people across Western Europe**.\n\nI've pre-filled the audience builder with the filters below. You can adjust the geographic scope or tighten the intent threshold before saving.",
    messageType: 'audience_draft',
    audienceDraft: {
      name: 'Eco-Committed Gen Z — Western Europe',
      inheritedFrom: 'Gen Z Sustainability Attitudes Survey',
      filters: [
        { label: 'Region',            value: 'Western Europe (DE, FR, UK, NL, SE, ES)' },
        { label: 'Age range',         value: '18–27 (Gen Z)' },
        { label: 'Attitude signal',   value: 'Sustainability strongly influences brand choice' },
        { label: 'Intent signal',     value: 'Would pay >10% premium for sustainable products' },
        { label: 'Eco certification', value: 'Actively seeks eco-certified products' },
        { label: 'Universe',          value: '~9.4M' },
      ],
      prefill: {
        name: 'Eco-Committed Gen Z — Western Europe',
        description: 'Gen Z consumers across Western Europe with high sustainability conviction and proven willingness to pay',
        region: 'Western Europe',
        isShared: false,
        filters: {
          id: 'fg-genz-eco',
          operator: 'AND',
          conditions: [
            { id: 'c1', attribute: 'Age (basic)',          operator: 'in',  value: ['18-24', '25-27'] },
            { id: 'c2', attribute: 'Country',              operator: 'in',  value: ['DE', 'FR', 'GB', 'NL', 'SE', 'ES'] },
            { id: 'c3', attribute: 'Sustainability index', operator: 'gte', value: '75' },
          ],
        },
      },
    },
    suggestedFollowUps: [
      'Which product categories does this audience over-index in?',
      'How does the universe size change if I narrow to DE + FR only?',
    ],
  },
]

// ─── 3. EV — full demo ────────────────────────────────────────────────────────

const EV_COMPARISON: AIMessage[] = [
  {
    id: 'ev-u1',
    role: 'user',
    content: 'Compare EV purchase intent across Germany, France, and the US',
  },
  {
    id: 'ev-a1',
    role: 'assistant',
    content: EV_AI_TEXT,
    messageType: 'ev_demo',
    processingSteps: EV_PROCESSING_STEPS.map(s => ({ ...s, status: 'done' as const })),
    benchmarkPanel: EV_BENCHMARK_PANEL,
    widgetCluster: EV_WIDGET_CLUSTER,
    suggestedFollowUps: EV_FOLLOW_UPS,
    attribution: 'Statista Mobility & EV Sentiment Survey, 2024',
  },
  {
    id: 'ev-u2',
    role: 'user',
    content: 'Activate this audience in the builder',
  },
  {
    id: 'ev-a2',
    role: 'assistant',
    content:
      "I've pre-filled the audience builder with the **Urban Tech Professionals** segment — the highest-intent group from the benchmark. The universe sits at ~2.1M in Germany. Review the filters below and open the builder to refine or save.",
    messageType: 'audience_draft',
    audienceDraft: EV_AUDIENCE_DRAFT,
    suggestedFollowUps: [
      'Extend this audience to France and the US',
      'What is the CPM benchmark for this segment?',
    ],
  },
]

// ─── 4. Streaming platforms — brand recall among Millennials UK ───────────────

const STREAMING_UK: AIMessage[] = [
  {
    id: 'st-u1',
    role: 'user',
    content: 'Which streaming platforms have the highest brand recall among Millennials in the UK?',
  },
  {
    id: 'st-a1',
    role: 'assistant',
    content:
      '**Netflix leads brand recall among UK Millennials at 94%**, followed by Spotify (88%) and Disney+ (79%). YouTube sits at 86% but is often categorised separately as a free-tier platform.\n\nRecall is strongly correlated with active subscription — platforms with exclusive original content (Netflix, Disney+) show the highest unaided recall. Prime Video scores high on recall (82%) but lags on affinity, suggesting it benefits from bundled access rather than intentional subscription.',
    messageType: 'data_widget',
    dataWidget: {
      title: 'Streaming Platform Brand Recall — UK Millennials',
      subtitle: 'Unaided recall, ages 25–42, 2024',
      chartType: 'bar',
      metric: 'Brand recall (%)',
      source: 'Statista Digital Media Survey UK, 2024 (n=3,150)',
      chartData: {
        labels: ['Netflix', 'YouTube', 'Spotify', 'Prime Video', 'Disney+', 'Apple TV+', 'DAZN'],
        series: [{ name: 'Unaided recall (%)', values: [94, 86, 88, 82, 79, 61, 44] }],
      },
    },
    suggestedFollowUps: [
      'How does recall compare to platform satisfaction scores?',
      'Break this down by age within Millennials (25–34 vs 35–42)',
      'Which platform has the highest share-of-wallet among this group?',
    ],
    attribution: 'Digital Media Survey UK, 2024 (n=3,150)',
  },
  {
    id: 'st-u2',
    role: 'user',
    content: 'How does recall compare to platform satisfaction scores?',
  },
  {
    id: 'st-a2',
    role: 'assistant',
    content:
      "There's a clear satisfaction gap for Amazon Prime Video and YouTube: both score high on recall but significantly lower on satisfaction, indicating passive usage rather than active preference.\n\n**Spotify stands out** with the strongest recall-to-satisfaction ratio — 88% recall paired with an 81% satisfaction score — suggesting it's the most intentional subscription in the Millennial media stack. Apple TV+ shows the inverse pattern: low recall but high satisfaction among those who use it.",
    messageType: 'data_widget',
    dataWidget: {
      title: 'Recall vs. Satisfaction — UK Millennials',
      subtitle: 'Gap analysis by streaming platform, 2024',
      chartType: 'bar',
      metric: 'Recall vs. satisfaction',
      source: 'Statista Digital Media Survey UK, 2024 (n=3,150)',
      chartData: {
        labels: ['Netflix', 'Spotify', 'YouTube', 'Prime Video', 'Disney+', 'Apple TV+'],
        series: [
          { name: 'Brand recall (%)',    values: [94, 88, 86, 82, 79, 61] },
          { name: 'Satisfaction (%)',    values: [78, 81, 69, 62, 74, 77] },
        ],
      },
    },
    suggestedFollowUps: [
      'Build a high-affinity streaming audience for Spotify',
      'Which age group drives Netflix\'s satisfaction score?',
    ],
    attribution: 'Digital Media Survey UK, 2024 (n=3,150)',
  },
]

// ─── 5. Music streaming by age — US ──────────────────────────────────────────

const MUSIC_STREAMING_US: AIMessage[] = [
  {
    id: 'ms-u1',
    role: 'user',
    content: 'Which age group streams the most music on mobile in the US?',
  },
  {
    id: 'ms-a1',
    role: 'assistant',
    content:
      '**18–24 year-olds lead mobile music streaming in the US**, with 91% streaming daily or near-daily — 22 points above the national average. The 25–34 cohort is a close second at 84%, driven by commuter and workout use cases.\n\nStreaming frequency drops sharply after 45, where podcast listening overtakes music as the dominant audio format on mobile. Afternoon (3–6 PM) and evening (7–10 PM) are the peak streaming windows across all age groups.',
    messageType: 'data_widget',
    dataWidget: {
      title: 'Mobile Music Streaming Frequency by Age — US',
      subtitle: 'Daily or near-daily listeners, 2024',
      chartType: 'bar',
      metric: 'Daily streaming rate (%)',
      source: 'Statista Audio & Podcasting Survey US, 2024 (n=5,020)',
      chartData: {
        labels: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
        series: [
          { name: 'Daily / near-daily streaming (%)', values: [91, 84, 72, 58, 41, 26] },
          { name: 'US average', values: [69, 69, 69, 69, 69, 69] },
        ],
      },
    },
    suggestedFollowUps: [
      'Which platforms dominate each age group?',
      'How does podcast listening overlap with music streaming?',
      'Show gender split within the 18–24 cohort',
    ],
    attribution: 'Audio & Podcasting Survey US, 2024 (n=5,020)',
  },
]

// ─── 6. Brand loyalty — Millennials vs Gen Z, fashion ────────────────────────

const BRAND_LOYALTY_FASHION: AIMessage[] = [
  {
    id: 'bl-u1',
    role: 'user',
    content: 'How does brand loyalty differ between Millennials and Gen Z in the fashion category?',
  },
  {
    id: 'bl-a1',
    role: 'assistant',
    content:
      '**Millennials are significantly more brand loyal than Gen Z across the fashion category.** 61% of Millennials say they repeatedly buy from the same clothing brand, versus only 38% of Gen Z — a 23-point gap.\n\nGen Z loyalty is driven by values alignment and community rather than product consistency. They are 2.1× more likely than Millennials to switch brands after a single negative sustainability or social-responsibility signal. However, when they do commit to a brand, their average order frequency is 14% higher.',
    messageType: 'data_widget',
    dataWidget: {
      title: 'Fashion Brand Loyalty Signals — Millennials vs. Gen Z',
      subtitle: 'Global, 2024',
      chartType: 'bar',
      metric: 'Loyalty behaviour rate (%)',
      source: 'Statista Fashion & Retail Attitudes Survey, 2024 (n=8,100)',
      chartData: {
        labels: [
          'Repeatedly buys same brand',
          'Recommends brand to peers',
          'Follows brand on social',
          'Buys full-price (never waits for sale)',
          'Would switch after one bad experience',
        ],
        series: [
          { name: 'Millennials (%)', values: [61, 54, 48, 39, 27] },
          { name: 'Gen Z (%)',       values: [38, 62, 71, 22, 58] },
        ],
      },
    },
    suggestedFollowUps: [
      'Which fashion brands score highest on Gen Z loyalty?',
      'Does this loyalty gap close for luxury vs. fast-fashion?',
      'Build a high-loyalty Millennial fashion audience',
    ],
    attribution: 'Fashion & Retail Attitudes Survey, 2024 (n=8,100)',
  },
  {
    id: 'bl-u2',
    role: 'user',
    content: 'Build a high-loyalty Millennial fashion audience',
  },
  {
    id: 'bl-a2',
    role: 'assistant',
    content:
      "Here's a pre-built segment for **Brand-Loyal Millennial Fashion Buyers** — Millennials who report repeat purchasing from the same brand and recommend it to peers. The universe is approximately **18.2M across North America and Western Europe**.",
    messageType: 'audience_draft',
    audienceDraft: {
      name: 'Brand-Loyal Millennial Fashion Buyers',
      inheritedFrom: 'Fashion & Retail Attitudes Survey, 2024',
      filters: [
        { label: 'Age range',        value: '28–43 (Millennials)' },
        { label: 'Loyalty signal',   value: 'Repeatedly buys from same brand' },
        { label: 'Advocacy signal',  value: 'Recommends brand to peers' },
        { label: 'Category',         value: 'Fashion / Apparel' },
        { label: 'Region',           value: 'North America + Western Europe' },
        { label: 'Universe',         value: '~18.2M' },
      ],
      prefill: {
        name: 'Brand-Loyal Millennial Fashion Buyers',
        description: 'Millennials with strong repeat-purchase behaviour and peer advocacy in the fashion category',
        region: 'Global',
        isShared: false,
        filters: {
          id: 'fg-mil-fashion',
          operator: 'AND',
          conditions: [
            { id: 'c1', attribute: 'Age (basic)',          operator: 'in',  value: ['28 - 34 years', '35 - 43 years'] },
            { id: 'c2', attribute: 'Purchase frequency',   operator: 'in',  value: ['Monthly', 'Bi-weekly'] },
            { id: 'c3', attribute: 'Brand loyalty index',  operator: 'gte', value: '70' },
          ],
        },
      },
    },
    suggestedFollowUps: [
      'What channels do they prefer for fashion discovery?',
      'How does this audience respond to email vs. social ads?',
    ],
  },
]

// ─── 7. NPS — digital banking apps, Southeast Asia ───────────────────────────

const NPS_BANKING_SEA: AIMessage[] = [
  {
    id: 'nb-u1',
    role: 'user',
    content: 'NPS benchmark for digital banking apps in Southeast Asia',
  },
  {
    id: 'nb-a1',
    role: 'assistant',
    content:
      '**GCash (Philippines) leads NPS in Southeast Asia at +67**, followed by GoPay (Indonesia) at +58. Traditional banks with digital apps — like CIMB and Maybank — trail significantly, averaging NPS +31.\n\nThe primary NPS drivers in SEA digital banking are transaction speed, in-app promotions, and peer-to-peer transfer reliability. Customer service response time is the top detractor, cited by 62% of Detractors across all markets.',
    messageType: 'data_widget',
    dataWidget: {
      title: 'Digital Banking App NPS — Southeast Asia',
      subtitle: 'Net Promoter Score by platform, 2024',
      chartType: 'bar',
      metric: 'NPS',
      source: 'Statista Fintech Consumer Survey SEA, 2024 (n=7,450)',
      chartData: {
        labels: ['GCash', 'GoPay', 'Dana', 'OVO', 'SeaBank', 'CIMB Digital', 'Maybank2u'],
        series: [{ name: 'NPS', values: [67, 58, 52, 49, 44, 33, 28] }],
      },
    },
    suggestedFollowUps: [
      'What drives NPS among GCash users specifically?',
      'How does SEA NPS compare to European digital banking?',
      'Which age group scores highest on digital banking NPS?',
    ],
    attribution: 'Fintech Consumer Survey SEA, 2024 (n=7,450)',
  },
  {
    id: 'nb-u2',
    role: 'user',
    content: 'How does SEA NPS compare to European digital banking?',
  },
  {
    id: 'nb-a2',
    role: 'assistant',
    content:
      "SEA digital banking apps outperform European counterparts by a wide margin. **The SEA average NPS is +52 vs +34 for Europe's top digital banks.**\n\nThis gap is partly structural — SEA's challenger banks launched with mobile-first architectures and no branch legacy, while European incumbents are migrating complex core systems. UK-based Monzo and Revolut are the European bright spots at +61 and +54 respectively, comparable to mid-tier SEA players.",
    messageType: 'data_widget',
    dataWidget: {
      title: 'Digital Banking NPS: SEA vs. Europe',
      subtitle: 'Top platforms by region, 2024',
      chartType: 'bar',
      metric: 'NPS',
      source: 'Statista Fintech Consumer Survey Global, 2024',
      chartData: {
        labels: ['GCash (SEA)', 'Monzo (EU)', 'Revolut (EU)', 'GoPay (SEA)', 'N26 (EU)', 'ING Digital (EU)', 'HSBC App (EU)'],
        series: [{ name: 'NPS', values: [67, 61, 54, 58, 47, 38, 29] }],
      },
    },
    suggestedFollowUps: [
      'What features explain Monzo\'s lead in Europe?',
      'Build a high-NPS fintech early-adopter audience',
    ],
    attribution: 'Fintech Consumer Survey Global, 2024 (n=14,900)',
  },
]

// ─── 8. Home fitness — income bracket spend ──────────────────────────────────

const HOME_FITNESS: AIMessage[] = [
  {
    id: 'hf-u1',
    role: 'user',
    content: 'Which income bracket spends the most on home fitness equipment in 2024?',
  },
  {
    id: 'hf-a1',
    role: 'assistant',
    content:
      '**Households earning $100k+ account for 41% of total home fitness equipment spend in 2024**, despite representing only 22% of the adult population — a spend index of 1.87×. The $75–100k bracket is the fastest-growing segment, with spend up 18% YoY driven by first-time equipment buyers post-pandemic.\n\nConnected equipment (Peloton, Tonal, Mirror) skews heavily toward the $100k+ bracket, while free weights and resistance bands are the top purchases across all income groups.',
    messageType: 'data_widget',
    dataWidget: {
      title: 'Home Fitness Equipment Spend Share by Income — US',
      subtitle: '% of total category spend, 2024',
      chartType: 'bar',
      metric: 'Spend share (%)',
      source: 'Statista Health & Wellness Consumer Survey US, 2024 (n=4,600)',
      chartData: {
        labels: ['<$35k', '$35–50k', '$50–75k', '$75–100k', '$100k+'],
        series: [
          { name: 'Spend share (%)',     values: [7, 12, 19, 21, 41] },
          { name: 'Population share (%)', values: [28, 18, 20, 12, 22] },
        ],
      },
    },
    suggestedFollowUps: [
      'What categories within fitness do the $100k+ bracket buy most?',
      'How does connected equipment adoption differ by income?',
      'Build a premium home fitness audience',
    ],
    attribution: 'Health & Wellness Consumer Survey US, 2024 (n=4,600)',
  },
]

// ─── 9. Gen Z loyalty programs — retail drivers ──────────────────────────────

const GENZ_LOYALTY: AIMessage[] = [
  {
    id: 'gl-u1',
    role: 'user',
    content: 'Gen Z attitude toward loyalty programs in retail — key drivers and drop-off points',
  },
  {
    id: 'gl-a1',
    role: 'assistant',
    content:
      "**68% of Gen Z consumers are enrolled in at least one retail loyalty program, but only 29% actively engage with it monthly.** The gap between enrolment and engagement is the defining challenge for brands targeting this cohort.\n\nThe top enrolment driver is an immediate sign-up reward (cited by 74%). The top drop-off trigger is a cluttered app experience — 58% of Gen Z abandoners cite 'too many notifications or steps to redeem.' Cash-back and exclusive access trump points in appeal; traditional points with expiry dates are the most-disliked mechanic.",
    messageType: 'data_widget',
    dataWidget: {
      title: 'Gen Z Loyalty Program Engagement Drivers & Barriers',
      subtitle: 'Agree / strongly agree, Global, 2024',
      chartType: 'bar',
      metric: 'Agreement rate (%)',
      source: 'Statista Retail & Loyalty Survey, 2024 (n=5,800)',
      chartData: {
        labels: [
          'Instant sign-up reward motivates enrolment',
          'Cash-back preferred over points',
          'Exclusive early access is appealing',
          'Would share data for personalised rewards',
          'Too many notifications cause drop-off',
          'Points with expiry dates frustrate me',
        ],
        series: [{ name: 'Agree / Strongly agree (%)', values: [74, 69, 63, 51, 58, 64] }],
      },
    },
    suggestedFollowUps: [
      'Which retail categories have the strongest Gen Z loyalty program uptake?',
      'How do Millennials compare on loyalty program engagement?',
      'Build an engaged Gen Z loyalty audience for retail',
    ],
    attribution: 'Retail & Loyalty Survey, 2024 (n=5,800)',
  },
  {
    id: 'gl-u2',
    role: 'user',
    content: 'Build an engaged Gen Z loyalty audience for retail',
  },
  {
    id: 'gl-a2',
    role: 'assistant',
    content:
      "Here's a pre-built segment targeting **Active Gen Z Loyalty Members** — enrolled in at least one retail loyalty program and redeeming rewards at least monthly. Universe: approximately **14.1M across the US, UK, and Australia**.",
    messageType: 'audience_draft',
    audienceDraft: {
      name: 'Active Gen Z Loyalty Members — Retail',
      inheritedFrom: 'Retail & Loyalty Survey, 2024',
      filters: [
        { label: 'Age range',         value: '18–27 (Gen Z)' },
        { label: 'Loyalty status',    value: 'Enrolled in ≥1 retail loyalty program' },
        { label: 'Engagement',        value: 'Redeems rewards monthly or more' },
        { label: 'Preferred reward',  value: 'Cash-back or exclusive access' },
        { label: 'Region',            value: 'US, UK, Australia' },
        { label: 'Universe',          value: '~14.1M' },
      ],
      prefill: {
        name: 'Active Gen Z Loyalty Members — Retail',
        description: 'Gen Z retail loyalty program members with active monthly redemption behaviour',
        region: 'Global',
        isShared: false,
        filters: {
          id: 'fg-genz-loyalty',
          operator: 'AND',
          conditions: [
            { id: 'c1', attribute: 'Age (basic)',          operator: 'in',  value: ['18-24', '25-27'] },
            { id: 'c2', attribute: 'Loyalty program',      operator: 'in',  value: ['Active member'] },
            { id: 'c3', attribute: 'Purchase frequency',   operator: 'in',  value: ['Weekly', 'Bi-weekly', 'Monthly'] },
          ],
        },
      },
    },
    suggestedFollowUps: [
      'What channels convert best for this audience?',
      'How does CLV compare to non-loyalty Gen Z shoppers?',
    ],
  },
]

// ─── 10. Social commerce — TikTok vs Instagram purchase drivers ───────────────

const SOCIAL_COMMERCE: AIMessage[] = [
  {
    id: 'sc-u1',
    role: 'user',
    content: 'How do TikTok and Instagram compare as social commerce purchase drivers among 18–30 year-olds?',
  },
  {
    id: 'sc-a1',
    role: 'assistant',
    content:
      "**TikTok has overtaken Instagram as the primary social commerce purchase trigger among 18–30 year-olds globally**, with 54% reporting a purchase directly influenced by TikTok content in the past 3 months, vs. 47% for Instagram.\n\nTikTok drives impulse purchases — 71% of TikTok-influenced buys are unplanned. Instagram, by contrast, shows stronger performance for high-consideration purchases (fashion, beauty >$80): 38% of Instagram-influenced buyers researched the product for more than a week before buying.",
    messageType: 'data_widget',
    dataWidget: {
      title: 'Social Commerce Purchase Influence — 18–30 year-olds',
      subtitle: 'Purchased due to platform content, last 3 months, 2024',
      chartType: 'bar',
      metric: 'Purchase influence rate (%)',
      source: 'Statista Social Commerce Survey Global, 2024 (n=9,200)',
      chartData: {
        labels: ['TikTok', 'Instagram', 'YouTube', 'Pinterest', 'Facebook', 'Snapchat'],
        series: [{ name: 'Influenced a purchase (%)', values: [54, 47, 38, 29, 21, 17] }],
      },
    },
    suggestedFollowUps: [
      'Which product categories convert best on TikTok?',
      'How does purchase intent from TikTok ads compare to organic content?',
      'Build a social-commerce-ready audience for beauty brands',
    ],
    attribution: 'Social Commerce Survey Global, 2024 (n=9,200)',
  },
]

// ─── 11. Travel intent — post-pandemic recovery by market ─────────────────────

const TRAVEL_INTENT: AIMessage[] = [
  {
    id: 'ti-u1',
    role: 'user',
    content: 'Which markets show the strongest international travel intent for summer 2025?',
  },
  {
    id: 'ti-a1',
    role: 'assistant',
    content:
      "**The US leads international travel intent for summer 2025 with 58% of adults planning at least one international trip** — up 9 points from 2024. Gulf markets (UAE, Saudi Arabia) show the strongest growth trajectory, driven by a young, high-income demographic with expanded visa-free access.\n\nEurope-to-Europe travel remains robust, with Germany and France showing 51% and 49% intent respectively. Japan is the most popular single destination globally, cited by 22% of all international travel intenders.",
    messageType: 'data_widget',
    dataWidget: {
      title: 'International Travel Intent — Summer 2025',
      subtitle: 'Planning ≥1 international trip, by home market',
      chartType: 'bar',
      metric: 'Travel intent (%)',
      source: 'Statista Travel & Tourism Survey Global, 2025 (n=12,400)',
      chartData: {
        labels: ['US', 'UAE', 'Australia', 'Germany', 'France', 'UK', 'Japan', 'Brazil'],
        series: [{ name: 'Planning international trip (%)', values: [58, 56, 53, 51, 49, 48, 44, 39] }],
      },
    },
    suggestedFollowUps: [
      'What does the high-intent US traveller profile look like?',
      'Which booking channels dominate across these markets?',
      'Build a premium international travel audience',
    ],
    attribution: 'Travel & Tourism Survey Global, 2025 (n=12,400)',
  },
]

// ─── 12. AI tool adoption — professional use cases ────────────────────────────

const AI_ADOPTION: AIMessage[] = [
  {
    id: 'ai-u1',
    role: 'user',
    content: 'What is the adoption rate of AI productivity tools among knowledge workers in North America?',
  },
  {
    id: 'ai-a1',
    role: 'assistant',
    content:
      "**64% of North American knowledge workers use at least one AI productivity tool weekly** — up from 38% in 2023. ChatGPT remains the most recognised and used (49%), but specialised tools like GitHub Copilot and Notion AI are gaining rapidly in professional contexts.\n\nAdoption is highest in tech (81%) and marketing (74%) functions. The primary barrier in other functions is trust in output accuracy, cited by 61% of non-adopters — more significant than privacy concerns (44%) or cost (31%).",
    messageType: 'data_widget',
    dataWidget: {
      title: 'Weekly AI Tool Adoption by Function — North America',
      subtitle: 'Knowledge workers using AI tools ≥ weekly, 2024',
      chartType: 'bar',
      metric: 'Weekly adoption rate (%)',
      source: 'Statista AI Workforce Survey North America, 2024 (n=6,800)',
      chartData: {
        labels: ['Technology', 'Marketing', 'Design / Creative', 'Finance', 'Sales', 'HR', 'Operations', 'Legal'],
        series: [{ name: 'Weekly AI tool usage (%)', values: [81, 74, 68, 55, 52, 44, 41, 33] }],
      },
    },
    suggestedFollowUps: [
      'Which specific AI tools lead in each function?',
      'How does enterprise vs. SMB adoption compare?',
      'Build an AI-forward professional audience',
    ],
    attribution: 'AI Workforce Survey North America, 2024 (n=6,800)',
  },
]

// ─── Map from firstMessage → messages ─────────────────────────────────────────

export const PRESET_CONVERSATIONS: Record<string, AIMessage[]> = {
  'What is the purchase intent for premium headphones among 25–34 year-olds in Germany?': HEADPHONES,
  'What are Gen Z consumer attitudes toward sustainable brands in Western Europe?': GENZ_SUSTAINABILITY,
  'Compare EV purchase intent across Germany, France, and the US': EV_COMPARISON,
  'Which streaming platforms have the highest brand recall among Millennials in the UK?': STREAMING_UK,
  'Which age group streams the most music on mobile in the US?': MUSIC_STREAMING_US,
  'How does brand loyalty differ between Millennials and Gen Z in the fashion category?': BRAND_LOYALTY_FASHION,
  'NPS benchmark for digital banking apps in Southeast Asia': NPS_BANKING_SEA,
  'Which income bracket spends the most on home fitness equipment in 2024?': HOME_FITNESS,
  'Gen Z attitude toward loyalty programs in retail — key drivers and drop-off points': GENZ_LOYALTY,
  'How do TikTok and Instagram compare as social commerce purchase drivers among 18–30 year-olds?': SOCIAL_COMMERCE,
  'Which markets show the strongest international travel intent for summer 2025?': TRAVEL_INTENT,
  'What is the adoption rate of AI productivity tools among knowledge workers in North America?': AI_ADOPTION,
}
