export type BubbleType = 'spotlight' | 'pulse'

export interface DemoBubble {
  selector: string        // CSS selector of the element to highlight
  label: string           // short title ~5 words
  sublabel?: string       // one sentence
  type: BubbleType
  position?: 'top' | 'bottom' | 'left' | 'right'  // preferred callout side
}

export interface DemoStep {
  id: string
  scene: string           // human label for the control bar
  path?: string           // navigate to this path when the step starts
  variant?: string        // apply this V3 variant (e.g. '3.2') when the step starts
  action?: string         // selector to click when advancing away from this step
  actionDelay?: number    // ms to wait after clicking action before next step
  holdMs?: number         // override how long this step is shown before auto-advance
  bubbles: DemoBubble[]
}

// ─── Script ──────────────────────────────────────────────────────────────────
// The demo auto-plays. Navigation between pages happens via `path`. The only
// in-page click action is opening the Gen Z chat (no route for a single chat).

export const DEMO_SCRIPT: DemoStep[] = [

  // ACT 1 — Landing
  {
    id: 'landing',
    scene: 'Landing page',
    path: '/',
    holdMs: 4000,
    bubbles: [],
  },

  // ACT 2 — Research AI empty state
  {
    id: 'rai-prompt',
    scene: 'Chat — ask anything',
    path: '/research-ai',
    bubbles: [
      {
        selector: '[data-demo="rai-prompt"]',
        label: 'Ask anything, naturally',
        sublabel: 'No filters or dropdowns — just describe what you need.',
        type: 'spotlight',
        position: 'bottom',
      },
    ],
  },
  {
    id: 'rai-modes',
    scene: 'Chat — data sources',
    bubbles: [
      {
        selector: '[data-demo="rai-modes"]',
        label: 'Switch data sources instantly',
        sublabel: 'Toggle between Consumer Insights, all surveys, or specific audiences.',
        type: 'spotlight',
        position: 'top',
      },
    ],
  },
  {
    id: 'rai-usecases',
    scene: 'Chat — quick starts',
    bubbles: [
      {
        selector: '[data-demo="rai-usecases"]',
        label: 'Jump-start with one click',
        sublabel: 'Pre-built workflows for the most common research tasks.',
        type: 'spotlight',
        position: 'top',
      },
    ],
  },
  {
    id: 'rai-history',
    scene: 'Chat — pick up past research',
    holdMs: 4000,
    bubbles: [
      {
        selector: '[data-demo="rai-history"]',
        label: 'Pick up any previous research',
        sublabel: 'All your past chats, ready to continue — let\'s open one.',
        type: 'spotlight',
        position: 'top',
      },
    ],
    action: '[data-demo="history-genz"] button',
    actionDelay: 1600,
  },

  // ACT 3 — Gen Z conversation
  {
    id: 'chat-query',
    scene: 'Chat — your question in context',
    holdMs: 5500,
    bubbles: [
      {
        selector: '[data-demo="chat-query"]',
        label: 'Your question, always in context',
        sublabel: 'The original query anchors the entire conversation.',
        type: 'pulse',
        position: 'left',
      },
      {
        selector: '[data-demo="chat-chart"]',
        label: 'Auto-generated chart from real data',
        sublabel: 'Statista data visualised instantly — no setup required.',
        type: 'pulse',
        position: 'left',
      },
    ],
  },
  {
    id: 'chat-tools',
    scene: 'Chat — export & sources',
    holdMs: 5000,
    bubbles: [
      {
        selector: '[data-demo="chat-chart-toolbar"]',
        label: 'Export right from the chat',
        sublabel: 'Download, copy, or add any chart to a dashboard in one click.',
        type: 'pulse',
        position: 'top',
      },
      {
        selector: '[data-demo="chat-sources"]',
        label: 'Every claim is sourced',
        sublabel: 'The underlying Statista dataset is always one click away.',
        type: 'pulse',
        position: 'top',
      },
    ],
  },
  {
    id: 'chat-audience',
    scene: 'Chat — segment detected',
    holdMs: 5500,
    bubbles: [
      {
        selector: '[data-demo="chat-audience-card"]',
        label: 'Segment detected automatically',
        sublabel: 'The AI spotted a high-value audience and built it for you.',
        type: 'pulse',
        position: 'top',
      },
      {
        selector: '[data-demo="chat-audience-actions"]',
        label: 'Save it or open the builder',
        sublabel: 'One click to save the segment — or customise it further.',
        type: 'pulse',
        position: 'top',
      },
    ],
  },

  // ACT 4 — Audience Builder
  {
    id: 'builder-universe',
    scene: 'Audience Builder — live estimate',
    path: '/audiences/new',
    bubbles: [
      {
        selector: '[data-demo="builder-universe"]',
        label: 'Live universe estimate',
        sublabel: 'Updates in real time as you refine your filters.',
        type: 'spotlight',
        position: 'bottom',
      },
    ],
  },
  {
    id: 'builder-input',
    scene: 'Audience Builder — plain English',
    bubbles: [
      {
        selector: '[data-demo="builder-input"]',
        label: 'Describe your audience in plain English',
        sublabel: 'No taxonomy to learn — just write who you\'re looking for.',
        type: 'spotlight',
        position: 'bottom',
      },
    ],
  },
  {
    id: 'builder-logic',
    scene: 'Audience Builder — boolean logic',
    bubbles: [
      {
        selector: '[data-demo="builder-logic"]',
        label: 'Combine signals with boolean logic',
        sublabel: 'AND narrows the segment, OR broadens it — full control.',
        type: 'spotlight',
        position: 'right',
      },
    ],
  },

  // ACT 5 — Charts
  {
    id: 'charts-open',
    scene: 'Charts — chart library',
    path: '/charts',
    holdMs: 4000,
    bubbles: [
      {
        selector: '[data-demo="charts-leaf"]',
        label: 'Browse the full chart library',
        sublabel: 'Pick any metric to start building — let\'s open one.',
        type: 'spotlight',
        position: 'right',
      },
    ],
    action: '[data-demo="charts-leaf"]',
    actionDelay: 1400,
  },
  {
    id: 'charts-rows',
    scene: 'Charts — rows',
    bubbles: [
      {
        selector: '[data-demo="charts-rows"]',
        label: 'Drop a breakdown into rows',
        sublabel: 'Age, gender, region — any dimension becomes a row.',
        type: 'spotlight',
        position: 'right',
      },
    ],
  },
  {
    id: 'charts-cols',
    scene: 'Charts — columns',
    bubbles: [
      {
        selector: '[data-demo="charts-cols"]',
        label: 'Drop a metric into columns',
        sublabel: 'Any survey question becomes a column to compare across.',
        type: 'spotlight',
        position: 'right',
      },
    ],
  },
  {
    id: 'charts-types',
    scene: 'Charts — visualisation types',
    bubbles: [
      {
        selector: '[data-demo="charts-types"]',
        label: 'Switch visualisation instantly',
        sublabel: 'Bar, line, table — same data, different perspective.',
        type: 'spotlight',
        position: 'bottom',
      },
    ],
  },
  {
    id: 'charts-add-dashboard',
    scene: 'Charts — save to dashboard',
    bubbles: [
      {
        selector: '[data-demo="charts-add-dashboard"]',
        label: 'Push any chart to a dashboard',
        sublabel: 'One click saves the chart with its current configuration.',
        type: 'spotlight',
        position: 'bottom',
      },
    ],
  },

  // ACT 6 — Unlock the full feature set (variant 3.2)
  {
    id: 'version-switch',
    scene: 'Unlocking the full feature set',
    variant: '3.2',
    holdMs: 4500,
    bubbles: [
      {
        selector: '[title="Switch version"]',
        label: 'The full feature set is now on',
        sublabel: 'Dashboards and Analysis are unlocked in the sidebar.',
        type: 'spotlight',
        position: 'top',
      },
    ],
  },

  // ACT 7 — Dashboard
  {
    id: 'dashboard-grid',
    scene: 'Dashboard — your saved charts',
    path: '/dashboards/dash-1',
    bubbles: [
      {
        selector: '[data-demo="dashboard-grid"]',
        label: 'Your saved charts, always here',
        sublabel: 'Every widget you\'ve saved lives on this dashboard.',
        type: 'spotlight',
        position: 'top',
      },
    ],
  },
  {
    id: 'dashboard-widget',
    scene: 'Dashboard — live widgets',
    bubbles: [
      {
        selector: '[data-demo="dashboard-widget"]',
        label: 'Live, interactive widgets',
        sublabel: 'Inspect, filter, or rearrange any widget on the canvas.',
        type: 'pulse',
        position: 'top',
      },
    ],
  },
  {
    id: 'dashboard-export',
    scene: 'Dashboard — export',
    bubbles: [
      {
        selector: '[data-demo="dashboard-export"]',
        label: 'Export the whole dashboard',
        sublabel: 'PDF or PowerPoint — ready for any boardroom.',
        type: 'spotlight',
        position: 'bottom',
      },
    ],
  },

  // ACT 8 — Analysis
  {
    id: 'analysis-report',
    scene: 'Analysis — narrative report',
    path: '/analyses/ana-1',
    bubbles: [
      {
        selector: '[data-demo="analysis-report"]',
        label: 'Auto-generated narrative report',
        sublabel: 'AI turns your data into structured, readable analysis.',
        type: 'spotlight',
        position: 'right',
      },
    ],
  },
  {
    id: 'analysis-export',
    scene: 'Analysis — export',
    bubbles: [
      {
        selector: '[data-demo="analysis-export"]',
        label: 'One click to PDF or PowerPoint',
        sublabel: 'Your research, formatted and ready to present.',
        type: 'spotlight',
        position: 'bottom',
      },
    ],
  },

  // End
  {
    id: 'end',
    scene: 'Demo complete',
    bubbles: [],
  },
]
