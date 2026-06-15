import type { AIMessage } from '@/types'
import {
  EV_PROCESSING_STEPS, EV_AI_TEXT, EV_BENCHMARK_PANEL,
  EV_WIDGET_CLUSTER, EV_AUDIENCE_DRAFT, EV_FOLLOW_UPS,
} from './fakeGenerators'

// ─── 1. Headphones — simplest: one question, one answer, text + chart ─────────

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
            { id: 'c1', attribute: 'Age (basic)',         operator: 'in',  value: ['18-24', '25-27'] },
            { id: 'c2', attribute: 'Country',             operator: 'in',  value: ['DE', 'FR', 'GB', 'NL', 'SE', 'ES'] },
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

// ─── 3. EV — full demo: processing steps + benchmark + widget cluster + audience ─

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

// Map from firstMessage → pre-built conversation
export const PRESET_CONVERSATIONS: Record<string, AIMessage[]> = {
  'What is the purchase intent for premium headphones among 25–34 year-olds in Germany?': HEADPHONES,
  'What are Gen Z consumer attitudes toward sustainable brands in Western Europe?': GENZ_SUSTAINABILITY,
  'Compare EV purchase intent across Germany, France, and the US': EV_COMPARISON,
}
