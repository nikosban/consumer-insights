# Engineering Tickets — V3 Consolidation, Demo Removal & Performance

**Epic:** V3 Consolidation  
**PRD:** `PRD_v3_consolidation.md`  
**Date:** 2026-06-23

---

## Ticket Index

| ID | Title | Type | Estimate | Depends on |
|----|-------|------|----------|------------|
| CI-01 | Collapse V3.1/V3.2 into a single V3 variant | Chore | 1h | — |
| CI-02 | Simplify VersionSwitcherFab (remove variant logic) | Chore | 30m | CI-01 |
| CI-03 | Delete demo infrastructure (3 files) | Chore | 30m | — |
| CI-04 | Remove DemoContext and DemoOverlay from App.tsx | Chore | 30m | CI-03 |
| CI-05 | Strip data-demo attributes — ResearchAIPage | Chore | 45m | CI-03 |
| CI-06 | Strip data-demo attributes — AudienceBuilderPage | Chore | 20m | CI-03 |
| CI-07 | Strip data-demo attributes — ChartsPage | Chore | 20m | CI-03 |
| CI-08 | Strip data-demo attributes — DashboardBuilderPage | Chore | 20m | CI-03 |
| CI-09 | Strip data-demo attributes — AnalysisDetailPage + chat components + Hero | Chore | 20m | CI-03 |
| CI-10 | localStorage migration: remove stale ci_v3_variant key | Chore | 15m | CI-01 |
| CI-11 | React.memo — chat message components | Perf | 1.5h | — |
| CI-12 | React.memo — history rows and use-case tiles | Perf | 45m | — |
| CI-13 | Lazy-load presetConversations.ts | Perf | 1h | — |
| CI-14 | Memoize generateChartData per widget key | Perf | 45m | — |
| CI-15 | Verify: full regression sweep after all tickets | QA | 1h | all |

**Total estimate: ~10h**

---

## CI-01 — Collapse V3.1/V3.2 into a single V3 variant

**Type:** Chore  
**Estimate:** 1h  
**Depends on:** —

### Context

`src/config/versions.ts` defines two entries, `v3.1` and `v3.2`, that are functionally the same app with a different `variant` field. The variant controls whether Dashboards/Analysis appear in the sidebar. We are removing this distinction.

### Files

- `src/config/versions.ts`
- `src/components/layout/WorkspaceSidebar.tsx`

### Acceptance criteria

- [ ] `versions.ts` has a single V3 entry: `{ id: 'v3', label: 'Consumer Insights V3', path: '/research-ai' }` — no `variant` field
- [ ] `V3_VARIANT_KEY` constant deleted from `versions.ts`
- [ ] `WorkspaceSidebar.tsx` has no `v3variant` state, no `showFullNav` variable, no `localStorage.getItem(V3_VARIANT_KEY)` call
- [ ] `WorkspaceSidebar.tsx` has no `storage` or `ci-variant-change` event listeners
- [ ] Both Dashboards and Analysis `<NavItem>` are rendered unconditionally in `WorkspaceSidebar`
- [ ] Navigating to `/dashboards` and `/analyses` works from sidebar nav

### Implementation notes

In `WorkspaceSidebar.tsx`, find and delete:
```tsx
const [v3variant, setV3Variant] = useState(...)
const showFullNav = v3variant !== '3.1'
useEffect(() => { /* storage listeners */ }, [])
```
And remove the `{showFullNav && ...}` guards from the two nav items.

---

## CI-02 — Simplify VersionSwitcherFab

**Type:** Chore  
**Estimate:** 30m  
**Depends on:** CI-01

### Context

`VersionSwitcherFab.tsx` currently stores the variant to localStorage and dispatches a `ci-variant-change` event when selecting a version. After CI-01 removes the variant system, this logic is dead code. The FAB should only navigate.

### Files

- `src/components/app/VersionSwitcherFab.tsx`

### Acceptance criteria

- [ ] `V3_VARIANT_KEY` import removed
- [ ] `localStorage.setItem(V3_VARIANT_KEY, v.variant)` removed
- [ ] `window.dispatchEvent(new Event('ci-variant-change'))` removed
- [ ] On version selection, only `navigate(v.path)` and `setOpen(false)` remain
- [ ] FAB still opens correctly; all versions still navigable
- [ ] V3.1 entry no longer appears in FAB dropdown (only V0, V1, V2, V3)

---

## CI-03 — Delete demo infrastructure files

**Type:** Chore  
**Estimate:** 30m  
**Depends on:** —

### Context

Three files constitute the demo machinery. They are not imported anywhere except `App.tsx` and each other. Deleting them removes the DemoOverlay, spotlight, pulse animations, and 30-step script from the bundle entirely.

### Files to delete

- `src/demo/demoScript.ts`
- `src/demo/DemoOverlay.tsx`
- `src/demo/useDemoMode.ts`
- `src/demo/` directory (once empty)

### Acceptance criteria

- [ ] All three files deleted
- [ ] `src/demo/` directory gone
- [ ] No remaining imports to deleted files (will cause build error if missed — good safeguard)
- [ ] TypeScript build passes after deletion

### Implementation notes

Do CI-04 in the same commit or immediately after, otherwise the build will fail (App.tsx still imports the deleted files).

---

## CI-04 — Remove DemoContext and DemoOverlay from App.tsx

**Type:** Chore  
**Estimate:** 30m  
**Depends on:** CI-03

### Context

`App.tsx` is the top-level file that wires the demo into the app. All demo-related imports, context setup, and renders live here.

### Files

- `src/App.tsx`

### Acceptance criteria

- [ ] `import { useDemoMode } from '@/demo/useDemoMode'` removed
- [ ] `import type { DemoModeHandle } from '@/demo/useDemoMode'` removed
- [ ] `import DemoOverlay from '@/demo/DemoOverlay'` removed
- [ ] `export const DemoContext = createContext<DemoModeHandle | null>(null)` removed
- [ ] `export const useDemoContext = () => useContext(DemoContext)` removed
- [ ] `const demo = useDemoMode(navigate)` removed
- [ ] `<DemoContext.Provider value={demo}>` and its closing tag removed
- [ ] `<DemoOverlay demo={demo} />` removed
- [ ] All other code structure preserved; routes unchanged
- [ ] TypeScript build passes
- [ ] App renders correctly with no console errors

### Before / After (App.tsx structure)

**Before:**
```tsx
const demo = useDemoMode(navigate)
return (
  <DemoContext.Provider value={demo}>
    <DemoOverlay demo={demo} />
    <VersionSwitcherFab />
    ...
  </DemoContext.Provider>
)
```

**After:**
```tsx
return (
  <>
    <VersionSwitcherFab />
    ...
  </>
)
```

---

## CI-05 — Strip data-demo attributes: ResearchAIPage

**Type:** Chore  
**Estimate:** 45m  
**Depends on:** CI-03

### Context

`ResearchAIPage.tsx` has the most `data-demo` attributes of any file — including a dynamic `dataDemoId` prop pattern that threads demo IDs through component trees. All must be removed.

### Files

- `src/pages/ResearchAIPage.tsx`
- Any child components that receive a `dataDemoId` prop (check: likely `ChatMessageList` or similar)

### Attributes to remove

| Attribute | Location hint |
|-----------|--------------|
| `data-demo="rai-prompt"` | prompt input area |
| `data-demo="rai-modes"` | data source tabs |
| `data-demo="rai-usecases"` | use-case tiles grid |
| `data-demo="rai-history"` | chat history section |
| `data-demo="history-genz"` | Gen Z history item |
| `data-demo="chat-query"` | user message bubble |
| `data-demo="chat-audience-card"` | generated audience card |
| `data-demo="chat-suggestions"` | follow-up suggestions container |
| dynamic `data-demo={dataDemoId}` | history row |

### Acceptance criteria

- [ ] Zero `data-demo` attributes in `ResearchAIPage.tsx`
- [ ] Any `dataDemoId` prop (and its receiving element in child components) removed
- [ ] No TypeScript errors introduced
- [ ] Chat history renders correctly; use-case tiles render correctly

---

## CI-06 — Strip data-demo attributes: AudienceBuilderPage

**Type:** Chore  
**Estimate:** 20m  
**Depends on:** CI-03

### Files

- `src/pages/AudienceBuilderPage.tsx`

### Attributes to remove

`builder-universe`, `builder-input`, `builder-logic`, `builder-region`, `builder-save`

### Acceptance criteria

- [ ] Zero `data-demo` attributes in file
- [ ] Audience builder still renders and saves correctly

---

## CI-07 — Strip data-demo attributes: ChartsPage

**Type:** Chore  
**Estimate:** 20m  
**Depends on:** CI-03

### Files

- `src/pages/ChartsPage.tsx`

### Attributes to remove

`charts-leaf`, `charts-rows`, `charts-cols`, `charts-types`, `charts-add-dashboard`

### Acceptance criteria

- [ ] Zero `data-demo` attributes in file
- [ ] Charts page still renders; "Add to Dashboard" button still works

---

## CI-08 — Strip data-demo attributes: DashboardBuilderPage

**Type:** Chore  
**Estimate:** 20m  
**Depends on:** CI-03

### Files

- `src/pages/DashboardBuilderPage.tsx`

### Attributes to remove

`dashboard-grid`, `dashboard-widget`, `dashboard-edit`, `dashboard-done`, `dashboard-export`, `dashboard-drag`, `dashboard-ai`

### Acceptance criteria

- [ ] Zero `data-demo` attributes in file
- [ ] Dashboard still renders with drag-and-drop working

---

## CI-09 — Strip data-demo attributes: remaining files

**Type:** Chore  
**Estimate:** 20m  
**Depends on:** CI-03

### Files

- `src/pages/AnalysisDetailPage.tsx` — `analysis-export`, `analysis-export-pptx`, `analysis-report`
- `src/components/app/chat/DataWidgetCard.tsx` — `chat-chart`, `chat-sources`, `chat-chart-toolbar`
- `src/components/app/chat/AudienceCard.tsx` — `chat-audience-actions`, `chat-open-builder`
- `src/pages/landing/sections/Hero.tsx` — `cta-try-assistant`

### Acceptance criteria

- [ ] Zero `data-demo` attributes across all four files
- [ ] Analysis page, chat cards, and landing Hero all still render correctly

---

## CI-10 — localStorage migration: remove stale ci_v3_variant

**Type:** Chore  
**Estimate:** 15m  
**Depends on:** CI-01

### Context

Existing users may have `ci_v3_variant` set to `'3.1'` in their localStorage. If WorkspaceSidebar still read this (which it won't after CI-01), it would hide nav items. But leaving stale keys is noise.

Add a one-time cleanup on App mount.

### Files

- `src/App.tsx`

### Implementation

In the root `App` component, add a `useEffect` (runs once):
```tsx
useEffect(() => {
  localStorage.removeItem('ci_v3_variant')
}, [])
```

### Acceptance criteria

- [ ] `ci_v3_variant` key deleted from localStorage on first load after this release
- [ ] No console warnings or errors from the cleanup

### Note

This `useEffect` can be deleted in the next release cycle (one release is enough to migrate all users).

---

## CI-11 — React.memo: chat message components

**Type:** Performance  
**Estimate:** 1.5h  
**Depends on:** —

### Context

ResearchAIPage renders a list of messages. When a new message is added, all existing message components re-render unnecessarily. Components involved: `DataWidgetCard`, `AudienceCard`, `AudienceDraftCard`, `BenchmarkPanel`, `WidgetCluster`, `ProcessingSteps`, `FollowUpChips`.

### Files

- `src/components/app/chat/DataWidgetCard.tsx`
- `src/components/app/chat/AudienceCard.tsx`
- `src/components/app/chat/AudienceDraftCard.tsx`
- `src/components/app/chat/BenchmarkPanel.tsx`
- `src/components/app/chat/WidgetCluster.tsx`
- `src/components/app/chat/ProcessingSteps.tsx`
- `src/components/app/chat/FollowUpChips.tsx`

### Implementation notes

For each component, wrap the default export:
```tsx
export default React.memo(ComponentName)
```

For `DataWidgetCard`, add a custom comparator to prevent re-render when only `addedToDash` or `vizType` local state changes (these are local state, so memo won't skip anyway — but ensure `card` prop is the same reference):
```tsx
export default React.memo(DataWidgetCard, (prev, next) => 
  prev.card === next.card
)
```

Ensure the parent (ResearchAIPage message loop) is keying messages by stable `id`, not array index.

### Acceptance criteria

- [ ] All 7 components wrapped in `React.memo`
- [ ] Adding a new message to the chat does NOT trigger re-renders of existing message components (verify with React DevTools Profiler)
- [ ] No functional regressions: chart interactions, viz switcher, add-to-dashboard still work

---

## CI-12 — React.memo: history rows and use-case tiles

**Type:** Performance  
**Estimate:** 45m  
**Depends on:** —

### Context

Two more list components in ResearchAIPage re-render unnecessarily:

1. **History rows** — rendered in a list from aiStore history; re-renders on every keystroke in the prompt input because the parent component re-renders
2. **UseCaseTile** — rendered in a grid of 6+ tiles; re-renders whenever parent state changes (input focus, mode change)

### Files

- `src/pages/ResearchAIPage.tsx` (history row + use-case tile components, likely defined inline or imported)

### Acceptance criteria

- [ ] History rows wrapped in `React.memo`; do not re-render when prompt input changes
- [ ] UseCaseTile items wrapped in `React.memo`; do not re-render when unrelated parent state changes
- [ ] History still scrolls and clicking a history item still loads the conversation

---

## CI-13 — Lazy-load presetConversations.ts

**Type:** Performance  
**Estimate:** 1h  
**Depends on:** —

### Context

`presetConversations.ts` (650 lines, ~20KB unminified) is statically imported in `aiGenerators.ts`, which is imported in `ResearchAIPage.tsx`. It loads at app startup even though it's only needed the moment the user submits a query.

### Files

- `src/data/aiGenerators.ts`
- `src/data/presetConversations.ts` — no changes needed to this file itself

### Implementation

In `aiGenerators.ts`, find the import:
```ts
import { HEADPHONES, GENZ_SUSTAINABILITY, EV_SCENARIO, ... } from './presetConversations'
```

Replace with a lazy getter:
```ts
let _presets: typeof import('./presetConversations') | null = null

async function getPresets() {
  if (!_presets) _presets = await import('./presetConversations')
  return _presets
}
```

Update `getFakeAIResponse()` (or whichever function does pattern matching against presets) to `await getPresets()` before using them.

Since `getFakeAIResponse` is already called inside an async function (the streaming simulation), this requires no caller changes.

### Acceptance criteria

- [ ] `presetConversations.ts` does NOT appear in the initial JS bundle (check with `vite build --report` or bundle analyser)
- [ ] On first query submission, preset conversations load in background with no perceptible delay
- [ ] All 6 preset conversation scenarios still trigger correctly (EV, Gen Z, Nike, Homeowners, Millennials, Headphones)
- [ ] TypeScript types preserved (use `typeof import(...)` for type inference)

---

## CI-14 — Memoize generateChartData per widget key

**Type:** Performance  
**Estimate:** 45m  
**Depends on:** —

### Context

`generateChartData(seed, breakdown, metric)` in `chartGenerators.ts` re-initialises a seeded RNG every call. Called once per widget per render of `ChartRenderer`. With 6+ widgets on a dashboard, this runs 6+ times on every state update (even unrelated ones). Since data is deterministic from the input parameters, results can be cached by a composite key.

### Files

- `src/data/chartGenerators.ts`

### Implementation

At module level, add a cache:
```ts
const _chartDataCache = new Map<string, ChartData>()

function getCacheKey(seed: string | number, breakdown: string, metric: string) {
  return `${seed}:${breakdown}:${metric}`
}
```

Wrap the `generateChartData` function body:
```ts
export function generateChartData(seed, breakdown, metric): ChartData {
  const key = getCacheKey(seed, breakdown, metric)
  const cached = _chartDataCache.get(key)
  if (cached) return cached
  // ... existing generation logic ...
  _chartDataCache.set(key, result)
  return result
}
```

Cache is module-scoped and lives for the session — fine since data is deterministic and never changes for a given widget.

### Acceptance criteria

- [ ] `generateChartData` with same arguments returns the same object reference (strict equality: `===`)
- [ ] Dashboard with 6 widgets re-renders trigger zero chart data regeneration for unchanged widgets
- [ ] Changing chart type (vizType) still generates new data if parameters differ
- [ ] No memory leak: cache size is bounded by the number of unique widget configurations (typically < 20 per session)

---

## CI-15 — Regression sweep: verify all tickets

**Type:** QA  
**Estimate:** 1h  
**Depends on:** All of the above

### Checklist

**V3 navigation:**
- [ ] Navigating to `/research-ai` works
- [ ] Navigating to `/audiences`, `/audiences/new` works
- [ ] Navigating to `/charts` works
- [ ] Navigating to `/dashboards`, `/dashboards/new`, `/dashboards/:id` works
- [ ] Navigating to `/analyses`, `/analyses/:id` works
- [ ] `/playground` works

**Sidebar:**
- [ ] Dashboards nav item visible without any localStorage manipulation
- [ ] Analysis nav item visible
- [ ] Collapsing/expanding sidebar works

**Version switcher FAB:**
- [ ] FAB opens dropdown
- [ ] V3 is listed once (not V3.1 and V3.2)
- [ ] Selecting V0 navigates to `/consumer_insights_v0`
- [ ] Selecting V1 navigates to `/consumer_insights_v1`
- [ ] Selecting V2 navigates to `/consumer_insights_v2`
- [ ] Selecting V3 navigates to `/research-ai`

**Demo removed:**
- [ ] No demo overlay appears on any page
- [ ] No spotlight or pulse animations visible
- [ ] No demo control bar at bottom of screen
- [ ] Browser console has zero errors from deleted demo imports

**Chat flow:**
- [ ] Submitting a query shows a response
- [ ] EV query triggers EV scenario preset
- [ ] "Add to Dashboard" opens picker, saves widget, shows toast
- [ ] "Add to Dashboard" does NOT navigate away from chat
- [ ] Charts page: selecting a chart and adding to dashboard works

**localStorage:**
- [ ] `ci_v3_variant` key absent from localStorage after load
- [ ] Other keys (`ci-dashboards`, `ci-widgets`, `ci-audiences`, `ci-ai`) still present

**Performance (spot-check):**
- [ ] React DevTools Profiler: adding a chat message does not re-render previous messages
- [ ] Dashboard with 6 widgets: scrolling sidebar does not re-render chart data

---

## Delivery Order (suggested)

```
Week 1:
  Day 1: CI-03, CI-04 (delete demo, clean App.tsx) — commits together
  Day 1: CI-01, CI-02, CI-10 (merge variants, clean FAB, localStorage) — commits together
  Day 2: CI-05 → CI-09 (strip data-demo in batches by file)

Week 2:
  Day 3: CI-11, CI-12 (React.memo)
  Day 3: CI-13 (lazy preset conversations)
  Day 4: CI-14 (memoize chart data)
  Day 4: CI-15 (regression sweep)
```

**Suggested PR structure:**
- PR 1: "chore: remove demo infrastructure and merge V3 variants" (CI-01 through CI-10)
- PR 2: "perf: memoize message components and lazy-load presets" (CI-11 through CI-14)
- PR 3: "chore: CI-15 regression notes in PR description"
