# PRD — V3 Consolidation, Demo Removal & Performance Hardening

**Status:** Draft  
**Author:** Engineering  
**Date:** 2026-06-23  
**Scope:** Consumer Insights — `src/` (V3 app only; legacy V0/V1/V2 untouched)

---

## 1. Background & Motivation

The V3 app currently ships with three layers of complexity that have outlived their purpose:

1. **A variant system (V3.1 / V3.2)** that hides or shows Dashboards and Analysis based on a localStorage key. This was a demo-stageing mechanism, not a real feature flag. It adds conditional branches, event listeners, and two separate version identifiers in the FAB for what is functionally one product.

2. **A 30-step interactive demo overlay** (spotlight + pulse + control bar) that was built for stakeholder walk-throughs. Every production component carries `data-demo="..."` marker attributes to support it. The demo machinery is bundled into the main JS chunk, adds ~4 `requestAnimationFrame` loops to every page render, and is the direct cause of the bug where clicking "Add to Dashboard" in V1 would sometimes trigger the demo's auto-advance and navigate the user to a V3 dashboard.

3. **Performance debt** introduced during rapid prototyping: a 650-line preset conversation file loaded synchronously, missing memoisation on re-rendering list items, and seeded RNG re-initialised on every chart render.

This PRD defines the work to address all three.

---

## 2. Goals

| # | Goal | Success metric |
|---|------|----------------|
| G1 | Single V3 — no variant switching | `ci_v3_variant` key removed; Dashboards + Analysis always visible |
| G2 | Zero demo code in production build | No `data-demo` attrs, no `DemoOverlay`, no `useDemoMode` in bundle |
| G3 | VersionSwitcherFab simplified | FAB switches V0/V1/V2/V3 only; no variant sub-selection |
| G4 | Chat list renders ≤1 extra component on new message | React.memo on all message-type components |
| G5 | Preset conversations lazy-loaded | `presetConversations.ts` not in initial bundle |
| G6 | Chart data memoised per widget | `generateChartData` result cached by widgetId |

---

## 3. Non-Goals

- Changes to V0, V1, V2 (legacy) — out of scope
- Real backend / API integration — still mocked
- Replacing Zustand — not in scope
- Redesigning any UI

---

## 4. Feature Breakdown

### 4.1 Merge V3.1 → V3.2 (always show full nav)

**What changes:**

The only behavioural difference between V3.1 and V3.2 is two nav items:
- `WorkspaceSidebar.tsx` line 68: `const showFullNav = v3variant !== '3.1'`
- Two conditional `{showFullNav && <NavItem ... />}` blocks for Dashboards and Analysis

**Plan:**
- Delete the `showFullNav` variable and both guards — always render both nav items
- Remove the `localStorage.getItem(V3_VARIANT_KEY)` read from WorkspaceSidebar
- Remove the `storage` / `ci-variant-change` event listeners from WorkspaceSidebar
- Remove `v3variant` state from WorkspaceSidebar
- Remove the `variant` field from V3.1 and V3.2 entries in `versions.ts`
- Collapse V3.1 and V3.2 into a single entry in `versions.ts` (keep `id: 'v3'`, label "Consumer Insights V3", `path: '/research-ai'`, no `variant`)
- Remove `V3_VARIANT_KEY` export from `versions.ts`
- Delete `ci_v3_variant` from localStorage on first load (one-time migration guard in App.tsx, removable after one release)

**Risk:** Low. The routes for Dashboards and Analysis already exist in App.tsx. They are already accessible by URL. We are only removing the nav hide/show toggle.

---

### 4.2 Remove Demo Infrastructure

**What changes:**

**Files to delete entirely:**
- `src/demo/demoScript.ts`
- `src/demo/DemoOverlay.tsx`
- `src/demo/useDemoMode.ts`
- `src/demo/` directory (if empty after above)

**Files to patch (remove demo plumbing):**
- `src/App.tsx`
  - Remove `import { useDemoMode }` and `import DemoOverlay`
  - Remove `DemoContext` creation, `useDemoMode(navigate)` call, `DemoContext.Provider` wrapper
  - Remove `<DemoOverlay demo={demo} />`
  - Remove `export const DemoContext` and `export const useDemoContext`
- `src/components/layout/WorkspaceSidebar.tsx` — already handled in 4.1 (event listeners for `ci-variant-change` removed)

**data-demo attribute removal (50+ instances across 7 files):**

Each file has `data-demo="..."` on DOM nodes. These are inert from a user perspective but:
- Add noise to the DOM (screen readers, test tooling)
- Are misleading in a production build
- Were the mechanism the demo used to spotlight/click elements

Files to clean up:
| File | Attributes to remove |
|------|---------------------|
| `src/pages/ResearchAIPage.tsx` | `rai-prompt`, `rai-modes`, `rai-usecases`, `rai-history`, `history-genz`, `chat-query`, `chat-audience-card`, `chat-suggestions`, dynamic `dataDemoId` prop |
| `src/pages/AudienceBuilderPage.tsx` | `builder-universe`, `builder-input`, `builder-logic`, `builder-region`, `builder-save` |
| `src/pages/ChartsPage.tsx` | `charts-leaf`, `charts-rows`, `charts-cols`, `charts-types`, `charts-add-dashboard` |
| `src/pages/DashboardBuilderPage.tsx` | `dashboard-grid`, `dashboard-widget`, `dashboard-edit`, `dashboard-done`, `dashboard-export`, `dashboard-drag`, `dashboard-ai` |
| `src/pages/AnalysisDetailPage.tsx` | `analysis-export`, `analysis-export-pptx`, `analysis-report` |
| `src/components/app/chat/DataWidgetCard.tsx` | `chat-chart`, `chat-sources`, `chat-chart-toolbar` |
| `src/components/app/chat/AudienceCard.tsx` | `chat-audience-actions`, `chat-open-builder` |
| `src/pages/landing/sections/Hero.tsx` | `cta-try-assistant` |

**localStorage key to migrate:**
- `ci_v3_variant` — write a one-time cleanup in App.tsx: `localStorage.removeItem('ci_v3_variant')` on mount

**Risk:** Low. `data-demo` attributes are never read by app logic (only by the now-deleted demo overlay). Removing them has zero runtime impact.

---

### 4.3 Simplify VersionSwitcherFab

With V3.1/V3.2 collapsed into a single V3 entry, the FAB no longer needs to handle `variant` storage or `ci-variant-change` dispatch.

**Changes to `VersionSwitcherFab.tsx`:**
- Remove `localStorage.setItem(V3_VARIANT_KEY, v.variant)` call
- Remove `window.dispatchEvent(new Event('ci-variant-change'))` call
- Remove `V3_VARIANT_KEY` import from versions config
- The FAB now purely calls `navigate(v.path)` on selection — much simpler

**Changes to `versions.ts`:**
- Remove V3.1 entry entirely
- Rename V3.2 entry to `id: 'v3'`, `label: 'Consumer Insights V3'`, remove `variant` field

---

### 4.4 Performance — Memoize Chat Message Components

**Problem:** On every new message in ResearchAIPage, the entire message list re-renders. Components like `DataWidgetCard`, `AudienceCard`, `BenchmarkPanel`, `WidgetCluster`, `ProcessingSteps` are not wrapped in `React.memo`. With a conversation of 10+ messages, adding one new message re-renders all 10.

**Fix:**
- Wrap `DataWidgetCard` in `React.memo` with a `propsAreEqual` that compares `card.title` + `card.metric` (the only data that can change)
- Wrap `AudienceCard`, `AudienceDraftCard`, `BenchmarkPanel`, `WidgetCluster`, `ProcessingSteps`, `FollowUpChips` in `React.memo`
- Wrap history row in `React.memo` (ResearchAIPage history list re-renders on every keystroke in the input)
- Wrap `UseCaseTile` grid items in `React.memo`

**Risk:** Low. These are pure presentational components — their output is determined by props alone.

---

### 4.5 Performance — Lazy-Load Preset Conversations

**Problem:** `presetConversations.ts` (650 lines of hardcoded conversation JSON) is imported synchronously in `aiGenerators.ts`, which is imported in `ResearchAIPage.tsx`. It is in the initial JS bundle even though it's only needed when the user submits a query that matches a preset pattern.

**Fix:**
- Convert `presetConversations.ts` to a dynamic import
- In `aiGenerators.ts`, replace `import { PRESETS } from './presetConversations'` with:
  ```ts
  async function getPresets() {
    const m = await import('./presetConversations')
    return m.PRESETS
  }
  ```
- Update `getFakeAIResponse()` (or equivalent) to `await getPresets()` before pattern matching
- Since the function is already async (it simulates streaming delay), this adds no extra latency in practice

**Savings:** ~15–20 KB (unminified) removed from initial bundle.

---

### 4.6 Performance — Memoize Chart Data Generation

**Problem:** `generateChartData(seed, breakdown, metric)` is called on every render of `ChartRenderer`. The seeded RNG (Mulberry32) is re-initialised from scratch each call. While fast (O(1)), it is called for every widget on every dashboard re-render (can be 6+ widgets simultaneously).

**Fix:**
- Add a module-level `Map<string, ChartData>` cache in `chartGenerators.ts`
- Key: `${widgetId}:${breakdown}:${metric}`
- On first call for a key: generate and cache. On subsequent calls: return cached value
- Clear cache on unmount not needed (data is deterministic — same key always produces same data)

**Risk:** Very low. Data is purely derived from the key parameters; no side-effects.

---

## 5. Architecture Notes

### Current state (before this PRD)

```
App.tsx
├── DemoContext.Provider          ← DELETE
│   ├── DemoOverlay               ← DELETE
│   ├── VersionSwitcherFab        ← SIMPLIFY
│   ├── AppLayout                 ← KEEP
│   │   └── WorkspaceSidebar      ← SIMPLIFY (remove variant logic)
│   └── [all routes]
```

### Target state (after this PRD)

```
App.tsx
├── VersionSwitcherFab            ← simplified (navigate only)
├── AppLayout                     ← unchanged
│   └── WorkspaceSidebar          ← simplified (no variant, full nav always)
└── [all routes]
```

### Variant lifecycle

| Key | Before | After |
|-----|--------|-------|
| `ci_v3_variant` | Controls nav items shown | One-time `removeItem` on load, then unused |
| `ci-variant-change` event | Fired on FAB + demo step | No longer dispatched or listened to |
| `V3_VARIANT_KEY` constant | Exported from versions.ts | Deleted |
| V3.1 version entry | In VERSIONS array, `variant: '3.1'` | Deleted |
| V3.2 version entry | In VERSIONS array, `variant: '3.2'` | Renamed to V3, `variant` field removed |

---

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Stale `ci_v3_variant` in user localStorage causes nav to break | Low | Medium | One-time `localStorage.removeItem('ci_v3_variant')` on App mount |
| Removing `data-demo` props breaks automated tests | Low | Low | Search for test selectors using `data-demo` before removal; audit `src/test/` |
| `React.memo` incorrectly skips re-render on chart type switch | Low | Low | Pass `vizType` in props equality check |
| Lazy preset import adds perceptible delay to first query | Very Low | Very Low | Import resolves in <5ms on cached bundles; streaming delay already > 1s |

---

## 7. Out of Scope

- Replacing seeded demo data (`seed.ts`) — this is shared infrastructure for the whole app to work. If this data needs to be replaced with real API data, that's a separate workstream.
- Removing `src/pages/landing/` — landing page is separate, no impact on V3 app routes
- Any V0/V1/V2 legacy code

---

## 8. Tickets

See `TICKETS_v3_consolidation.md` for the full breakdown.
