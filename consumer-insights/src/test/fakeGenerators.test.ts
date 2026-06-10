/**
 * fakeGenerators tests — verify the EV demo data pipeline and trigger
 * detection are correct. A broken trigger or malformed data shape would
 * silently produce a blank/crashed chat response.
 */

import { describe, it, expect } from 'vitest'
import {
  isEVTrigger,
  EV_PROCESSING_STEPS,
  EV_AI_TEXT,
  EV_BENCHMARK_PANEL,
  EV_WIDGET_CLUSTER,
  EV_AUDIENCE_DRAFT,
  EV_FOLLOW_UPS,
  getFakeAIResponse,
} from '@/data/fakeGenerators'

// ─── Trigger detection ────────────────────────────────────────────────────────

describe('isEVTrigger', () => {
  const hits = [
    'Who intends to buy EVs in Germany?',
    'ev buyers germany',
    'EV purchase intent',
    'electric vehicle market',
    'electric car buyers',
    'who wants to buy an EV',
    'Germany EV adoption',
  ]
  const misses = [
    'Who buys sneakers in the US?',
    'streaming subscriptions Germany',
    'brand awareness Nike',
    '',
  ]

  hits.forEach(q => {
    it(`matches: "${q}"`, () => {
      expect(isEVTrigger(q)).toBe(true)
    })
  })

  misses.forEach(q => {
    it(`does not match: "${q}"`, () => {
      expect(isEVTrigger(q)).toBe(false)
    })
  })
})

// ─── EV processing steps ─────────────────────────────────────────────────────

describe('EV_PROCESSING_STEPS', () => {
  it('contains at least 10 steps', () => {
    expect(EV_PROCESSING_STEPS.length).toBeGreaterThanOrEqual(10)
  })

  it('every step has a non-empty label and value', () => {
    EV_PROCESSING_STEPS.forEach((step, i) => {
      expect(step.label, `step ${i} label`).toBeTruthy()
      expect(step.value, `step ${i} value`).toBeTruthy()
    })
  })
})

// ─── EV AI text ───────────────────────────────────────────────────────────────

describe('EV_AI_TEXT', () => {
  it('is a non-empty string', () => {
    expect(typeof EV_AI_TEXT).toBe('string')
    expect(EV_AI_TEXT.length).toBeGreaterThan(20)
  })
})

// ─── Benchmark panel ─────────────────────────────────────────────────────────

describe('EV_BENCHMARK_PANEL', () => {
  it('has exactly 3 segments', () => {
    expect(EV_BENCHMARK_PANEL.segments).toHaveLength(3)
  })

  it('has exactly one best-match segment', () => {
    const best = EV_BENCHMARK_PANEL.segments.filter(s => s.isBestMatch)
    expect(best).toHaveLength(1)
  })

  it('every segment has required fields', () => {
    EV_BENCHMARK_PANEL.segments.forEach((seg, i) => {
      expect(seg.name, `seg ${i} name`).toBeTruthy()
      expect(seg.intentScore, `seg ${i} intentScore`).toBeGreaterThan(0)
      expect(seg.universe, `seg ${i} universe`).toBeTruthy()
      expect(seg.ageRange, `seg ${i} ageRange`).toBeTruthy()
    })
  })

  it('has a non-empty nudge string', () => {
    expect(EV_BENCHMARK_PANEL.nudge).toBeTruthy()
  })
})

// ─── Widget cluster ───────────────────────────────────────────────────────────

describe('EV_WIDGET_CLUSTER', () => {
  it('contains exactly 3 widgets', () => {
    expect(EV_WIDGET_CLUSTER).toHaveLength(3)
  })

  it('contains bar, line, and scorecard chart types', () => {
    const types = EV_WIDGET_CLUSTER.map(w => w.chartType)
    expect(types).toContain('bar')
    expect(types).toContain('line')
    expect(types).toContain('scorecard')
  })

  it('every widget has chartData with labels and at least one series', () => {
    EV_WIDGET_CLUSTER.forEach((w, i) => {
      expect(w.chartData.labels, `widget ${i} labels`).toBeTruthy()
      expect(w.chartData.series.length, `widget ${i} series`).toBeGreaterThan(0)
    })
  })

  it('series values length matches labels length for bar and line widgets', () => {
    EV_WIDGET_CLUSTER.filter(w => w.chartType !== 'scorecard').forEach((w, i) => {
      w.chartData.series.forEach(s => {
        expect(s.values.length, `widget ${i} series length`).toBe(w.chartData.labels.length)
      })
    })
  })
})

// ─── Audience draft ───────────────────────────────────────────────────────────

describe('EV_AUDIENCE_DRAFT', () => {
  it('has a name, inheritedFrom, and at least 3 filters', () => {
    expect(EV_AUDIENCE_DRAFT.name).toBeTruthy()
    expect(EV_AUDIENCE_DRAFT.inheritedFrom).toBeTruthy()
    expect(EV_AUDIENCE_DRAFT.filters.length).toBeGreaterThanOrEqual(3)
  })

  it('every filter has a label and value', () => {
    EV_AUDIENCE_DRAFT.filters.forEach((f, i) => {
      expect(f.label, `filter ${i} label`).toBeTruthy()
      expect(f.value, `filter ${i} value`).toBeTruthy()
    })
  })

  it('prefill contains filter group', () => {
    expect(EV_AUDIENCE_DRAFT.prefill.filters).toBeDefined()
  })
})

// ─── Follow-ups ───────────────────────────────────────────────────────────────

describe('EV_FOLLOW_UPS', () => {
  it('has at least 2 follow-up suggestions', () => {
    expect(EV_FOLLOW_UPS.length).toBeGreaterThanOrEqual(2)
  })

  it('every suggestion is a non-empty string', () => {
    EV_FOLLOW_UPS.forEach((q, i) => {
      expect(typeof q, `follow-up ${i}`).toBe('string')
      expect(q.length, `follow-up ${i}`).toBeGreaterThan(0)
    })
  })
})

// ─── getFakeAIResponse ────────────────────────────────────────────────────────

describe('getFakeAIResponse', () => {
  it('returns ev_demo type for an EV trigger phrase', () => {
    const res = getFakeAIResponse('Who intends to buy EVs in Germany?', {})
    expect(res.type).toBe('ev_demo')
  })

  it('returns a non-ev_demo type for a generic query', () => {
    const res = getFakeAIResponse('Tell me about sneaker buyers in the US', {})
    expect(res.type).not.toBe('ev_demo')
  })

  it('always returns an object with a type and content field', () => {
    const queries = [
      'EV Germany',
      'brand awareness',
      'who buys premium coffee',
      '',
    ]
    queries.forEach(q => {
      const res = getFakeAIResponse(q, {})
      expect(res).toHaveProperty('type')
      expect(res).toHaveProperty('content')
    })
  })
})
