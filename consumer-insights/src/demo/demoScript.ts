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
  path?: string           // navigate to this path before showing bubbles
  action?: string         // selector to click after bubbles are dismissed
  actionDelay?: number    // ms to wait before clicking action (default 1200)
  autoContinue?: boolean  // advance automatically after bubbles (default: presenter presses Next)
  bubbles: DemoBubble[]
}

// ─── Script ──────────────────────────────────────────────────────────────────

export const DEMO_SCRIPT: DemoStep[] = [

  // ACT 1 — Landing
  {
    id: 'landing',
    scene: 'Landing page',
    path: '/',
    autoContinue: false,
    bubbles: [],
    action: '[data-demo="cta-try-assistant"]',
    actionDelay: 2000,
  },

  // ACT 2 — Research AI empty state
  {
    id: 'rai-prompt',
    scene: 'Chat — prompt',
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
    scene: 'Chat — mode chips',
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
    scene: 'Chat — history',
    bubbles: [
      {
        selector: '[data-demo="rai-history"]',
        label: 'Pick up any previous research',
        sublabel: 'All your past chats, searchable and ready to continue.',
        type: 'spotlight',
        position: 'top',
      },
    ],
    action: '[data-demo="history-genz"]',
    actionDelay: 1500,
  },

  // ACT 3 — Gen Z chat scroll
  {
    id: 'chat-query',
    scene: 'Chat — conversation',
    bubbles: [
      {
        selector: '[data-demo="chat-query"]',
        label: 'Your question, always in context',
        sublabel: 'The original query anchors the entire conversation.',
        type: 'pulse',
        position: 'right',
      },
      {
        selector: '[data-demo="chat-chart"]',
        label: 'Auto-generated chart from real data',
        sublabel: 'Statista data visualised instantly — no setup required.',
        type: 'pulse',
        position: 'right',
      },
      {
        selector: '[data-demo="chat-chart-toolbar"]',
        label: 'Export right from the chat',
        sublabel: 'Download, share, or add any chart to a dashboard in one click.',
        type: 'pulse',
        position: 'top',
      },
      {
        selector: '[data-demo="chat-sources"]',
        label: 'Every claim is sourced',
        sublabel: 'Click any badge to open the full underlying dataset.',
        type: 'pulse',
        position: 'right',
      },
    ],
  },
  {
    id: 'chat-suggestions',
    scene: 'Chat — suggestions & audience',
    bubbles: [
      {
        selector: '[data-demo="chat-suggestions"]',
        label: 'AI suggests the next question',
        sublabel: 'Follow the thread or pivot — the AI keeps up.',
        type: 'pulse',
        position: 'top',
      },
      {
        selector: '[data-demo="chat-audience-card"]',
        label: 'Segment detected automatically',
        sublabel: 'The AI spotted a high-value audience and built it for you.',
        type: 'pulse',
        position: 'top',
      },
      {
        selector: '[data-demo="chat-audience-actions"]',
        label: 'Save or open in the builder',
        sublabel: 'One click to save the segment or customise it further.',
        type: 'pulse',
        position: 'top',
      },
    ],
    action: '[data-demo="chat-open-builder"]',
    actionDelay: 2000,
  },

  // ACT 4 — Audience Builder
  {
    id: 'builder-preview',
    scene: 'Audience Builder — preview',
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
    scene: 'Audience Builder — natural input',
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
    id: 'builder-region',
    scene: 'Audience Builder — region',
    bubbles: [
      {
        selector: '[data-demo="builder-region"]',
        label: 'Scope by market or region',
        sublabel: 'Filter to a single country or build a multi-market audience.',
        type: 'spotlight',
        position: 'right',
      },
    ],
  },
  {
    id: 'builder-logic',
    scene: 'Audience Builder — AND/OR',
    bubbles: [
      {
        selector: '[data-demo="builder-logic"]',
        label: 'Combine signals with boolean logic',
        sublabel: 'AND narrows the segment, OR broadens it — full control.',
        type: 'spotlight',
        position: 'right',
      },
    ],
    action: '[data-demo="builder-save"]',
    actionDelay: 1500,
  },

  // ACT 5 — Back in chat, export callout
  {
    id: 'chat-export',
    scene: 'Chat — export',
    path: '/research-ai',
    action: '[data-demo="history-genz"]',
    actionDelay: 500,
    bubbles: [],
    autoContinue: true,
  },
  {
    id: 'chat-export-highlight',
    scene: 'Chat — export tools',
    bubbles: [
      {
        selector: '[data-demo="chat-chart-toolbar"]',
        label: 'Export any insight directly',
        sublabel: 'Charts and findings can leave the chat as files or dashboard widgets.',
        type: 'pulse',
        position: 'top',
      },
    ],
  },

  // ACT 6 — Charts
  {
    id: 'charts-rows',
    scene: 'Charts — row zone',
    path: '/charts',
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
    scene: 'Charts — column zone',
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
    scene: 'Charts — view types',
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
    scene: 'Charts — add to dashboard',
    bubbles: [
      {
        selector: '[data-demo="charts-add-dashboard"]',
        label: 'Push any chart to a dashboard',
        sublabel: 'One click saves the chart with its current configuration.',
        type: 'spotlight',
        position: 'top',
      },
    ],
  },

  // ACT 7 — Version switch
  {
    id: 'version-switch',
    scene: 'Switch to full feature set',
    bubbles: [
      {
        selector: '[title="Switch version"]',
        label: 'Switching to the full feature set',
        sublabel: 'Dashboards and Analysis are now unlocked.',
        type: 'spotlight',
        position: 'top',
      },
    ],
    action: '[title="Switch version"]',
    actionDelay: 2000,
  },

  // ACT 8 — Dashboard
  {
    id: 'dashboard-grid',
    scene: 'Dashboard — grid',
    path: '/dashboards',
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
    scene: 'Dashboard — widget',
    bubbles: [
      {
        selector: '[data-demo="dashboard-widget"]',
        label: 'Live, interactive widgets',
        sublabel: 'Click any widget to inspect, filter, or update it.',
        type: 'pulse',
        position: 'top',
      },
    ],
  },
  {
    id: 'dashboard-edit',
    scene: 'Dashboard — edit mode',
    bubbles: [
      {
        selector: '[data-demo="dashboard-edit"]',
        label: 'Enter edit mode',
        sublabel: 'Rearrange, add, or remove widgets freely.',
        type: 'spotlight',
        position: 'bottom',
      },
    ],
    action: '[data-demo="dashboard-edit"]',
    actionDelay: 1500,
  },
  {
    id: 'dashboard-drag',
    scene: 'Dashboard — drag & drop',
    bubbles: [
      {
        selector: '[data-demo="dashboard-drag"]',
        label: 'Drag to rearrange',
        sublabel: 'Move any widget to the layout that tells your story best.',
        type: 'pulse',
        position: 'right',
      },
    ],
  },
  {
    id: 'dashboard-ai',
    scene: 'Dashboard — AI card',
    bubbles: [
      {
        selector: '[data-demo="dashboard-ai"]',
        label: 'Let AI fill the gap',
        sublabel: 'Describe a chart and the AI builds and places it for you.',
        type: 'spotlight',
        position: 'top',
      },
    ],
    action: '[data-demo="dashboard-done"]',
    actionDelay: 2000,
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
    action: '[data-demo="dashboard-export"]',
    actionDelay: 1500,
  },

  // ACT 9 — Analysis
  {
    id: 'analysis-report',
    scene: 'Analysis — report',
    path: '/analyses',
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
        label: 'One-click to PDF or PowerPoint',
        sublabel: 'Your research, formatted and ready to present.',
        type: 'spotlight',
        position: 'top',
      },
    ],
    action: '[data-demo="analysis-export-pptx"]',
    actionDelay: 1500,
  },

  // End
  {
    id: 'end',
    scene: 'Demo complete',
    bubbles: [],
    autoContinue: false,
  },
]
