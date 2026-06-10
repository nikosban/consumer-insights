/**
 * Page smoke tests — render every route and assert it doesn't crash.
 * These are the first line of defence against "white screen" regressions.
 * We don't test visual output here, just that React can mount and unmount
 * each page without throwing.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import React from 'react'

// ── Stub heavy/non-jsdom-compatible modules ──────────────────────────────────

// recharts uses ResizeObserver which jsdom doesn't have
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  Line: () => null,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}))

// react-grid-layout uses DOM measurements
vi.mock('react-grid-layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  WidthProvider: (C: React.ComponentType) => C,
}))

beforeAll(() => {
  // ResizeObserver is used by some layout components
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // matchMedia is used by some UI libs
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

// ── Helper ────────────────────────────────────────────────────────────────────

function renderAt(path: string, element: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>
  )
}

// ── Page imports (lazy to avoid top-level side-effects on import) ─────────────

const pages = [
  { name: 'AudiencesPage',      path: '/audiences',    load: () => import('@/pages/AudiencesPage') },
  { name: 'DashboardsPage',     path: '/dashboards',   load: () => import('@/pages/DashboardsPage') },
  { name: 'ResearchAIPage',     path: '/research-ai',  load: () => import('@/pages/ResearchAIPage') },
  { name: 'AnalysesPage',       path: '/analyses',     load: () => import('@/pages/AnalysesPage') },
  { name: 'PlaygroundPage',     path: '/playground',   load: () => import('@/pages/PlaygroundPage') },
  { name: 'AudienceBuilderPage',path: '/audiences/new',load: () => import('@/pages/AudienceBuilderPage') },
  { name: 'ChartsPage',         path: '/charts',       load: () => import('@/pages/ChartsPage') },
]

// ─── Smoke tests ──────────────────────────────────────────────────────────────

describe('page smoke tests — mount without crashing', () => {
  pages.forEach(({ name, path, load }) => {
    it(`${name} renders without throwing`, async () => {
      const mod = await load()
      const Page = (mod as { default: React.ComponentType }).default
      expect(() => renderAt(path, <Page />)).not.toThrow()
    })
  })
})

// ─── ResearchAI — EV flow rendering ──────────────────────────────────────────

describe('ResearchAIPage — EV demo components render', () => {
  it('renders the empty chat state with input box', async () => {
    const { default: ResearchAIPage } = await import('@/pages/ResearchAIPage')
    renderAt('/research-ai', <ResearchAIPage />)
    // The empty state should show the heading
    expect(screen.getByText(/researching today/i)).toBeInTheDocument()
  })

  it('renders a user message bubble after addMessage', async () => {
    const { default: ResearchAIPage } = await import('@/pages/ResearchAIPage')
    const { useAIStore } = await import('@/store/aiStore')
    useAIStore.getState().reset()
    useAIStore.getState().addMessage({ id: 'u1', role: 'user', content: 'Who buys EVs in Germany?' })

    renderAt('/research-ai', <ResearchAIPage />)
    expect(screen.getByText('Who buys EVs in Germany?')).toBeInTheDocument()
  })

  it('renders processing steps when present on an assistant message', async () => {
    const { default: ResearchAIPage } = await import('@/pages/ResearchAIPage')
    const { useAIStore } = await import('@/store/aiStore')
    useAIStore.getState().reset()
    useAIStore.getState().addMessage({
      id: 'a1',
      role: 'assistant',
      content: '',
      isStreaming: true,
      messageType: 'ev_demo',
      processingSteps: [
        { label: 'Parsing intent', value: 'EV Germany', status: 'done' },
        { label: 'Finding segments', value: 'Scanning…', status: 'active' },
      ],
    })

    renderAt('/research-ai', <ResearchAIPage />)
    expect(screen.getByText('Parsing intent')).toBeInTheDocument()
    expect(screen.getByText('Finding segments')).toBeInTheDocument()
  })

  it('renders benchmark panel segments when present', async () => {
    const { default: ResearchAIPage } = await import('@/pages/ResearchAIPage')
    const { useAIStore } = await import('@/store/aiStore')
    const { EV_BENCHMARK_PANEL } = await import('@/data/fakeGenerators')
    useAIStore.getState().reset()
    useAIStore.getState().addMessage({
      id: 'a1',
      role: 'assistant',
      content: 'Here are the segments.',
      isStreaming: false,
      messageType: 'ev_demo',
      benchmarkPanel: EV_BENCHMARK_PANEL,
    })

    renderAt('/research-ai', <ResearchAIPage />)
    expect(screen.getByText('Urban Tech Professionals')).toBeInTheDocument()
  })

  it('renders audience draft card when audienceDraft is set', async () => {
    const { default: ResearchAIPage } = await import('@/pages/ResearchAIPage')
    const { useAIStore } = await import('@/store/aiStore')
    const { EV_AUDIENCE_DRAFT } = await import('@/data/fakeGenerators')
    useAIStore.getState().reset()
    useAIStore.getState().addMessage({
      id: 'a1',
      role: 'assistant',
      content: 'Here is your draft.',
      messageType: 'audience_draft',
      audienceDraft: EV_AUDIENCE_DRAFT,
    })

    renderAt('/research-ai', <ResearchAIPage />)
    expect(screen.getByText('AUDIENCE DRAFT')).toBeInTheDocument()
    expect(screen.getByText(EV_AUDIENCE_DRAFT.name)).toBeInTheDocument()
  })
})
