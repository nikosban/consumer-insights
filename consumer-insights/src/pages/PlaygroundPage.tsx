/**
 * COMPONENT PLAYGROUND — hidden route `/playground`
 *
 * Left-nav design-system browser.
 *
 * Foundations: Overview · Typography · Color · Elevation
 * Components:  Button · Badge · Input · Chip · Card · Empty State · Layout
 */

import { useState } from 'react'
import ChartRenderer from '@/components/charts/ChartRenderer'
import type { Widget, ChartData } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SelectField } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, Radio } from '@/components/ui/radio'
import { Chip } from '@/components/app/Chip'
import { Toolbar, ToolbarActions, ResourceCard, IconBtn } from '@/components/app'
import EmptyState from '@/components/EmptyState'
import {
  LayoutDashboard, FileText, Users, BarChart2, Trash2,
  Pencil, Copy, Plus, Share2, BookmarkPlus, RefreshCw,
  ChevronRight, Sparkles,
} from 'lucide-react'
import {
  IconPlus, IconDownload, IconTrash, IconCheck, IconArrowRight,
  IconLoader2, IconShare, IconX,
  IconLayoutSidebarRightCollapse, IconLayoutSidebarRightExpand,
} from '@tabler/icons-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'
import { generateChartData } from '@/data/fakeGenerators'

// ─── Nav structure ────────────────────────────────────────────────────────────

type PageId =
  | 'overview'
  | 'typography'
  | 'icons'
  | 'color'
  | 'elevation'
  | 'data-viz'
  | 'button'
  | 'badge'
  | 'form'
  | 'chip'
  | 'card'
  | 'chart-widget'
  | 'empty-state'
  | 'switcher'
  | 'layout'

const NAV: { group: string; items: { id: PageId; label: string }[] }[] = [
  {
    group: 'Foundations',
    items: [
      { id: 'overview',    label: 'Overview'    },
      { id: 'typography',  label: 'Typography'  },
      { id: 'icons',       label: 'Icons'       },
      { id: 'color',       label: 'Color'       },
      { id: 'elevation',   label: 'Elevation'   },
      { id: 'data-viz',    label: 'Data Viz'    },
    ],
  },
  {
    group: 'Components',
    items: [
      { id: 'button',      label: 'Button'      },
      { id: 'badge',       label: 'Badge'       },
      { id: 'form',        label: 'Form'        },
      { id: 'chip',        label: 'Chip'        },
      { id: 'card',         label: 'Card'         },
      { id: 'chart-widget', label: 'Chart Widget' },
      { id: 'empty-state',  label: 'Empty State'  },
      { id: 'switcher',     label: 'Switcher'     },
      { id: 'layout',      label: 'Layout'      },
    ],
  },
]

// ─── Shared helpers ───────────────────────────────────────────────────────────

function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8 pb-6 border-b border-border">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="flex items-baseline gap-3 mb-5 pb-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-6 mb-4">
      <span className="text-xs text-foreground w-32 shrink-0 pt-1">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}



// ─── List row patterns (used on Card page) ────────────────────────────────────

function AudienceStyleRow() {
  return (
    <div className="group flex items-center gap-4 py-3.5 rounded-xl hover:bg-accent transition-colors cursor-pointer -mx-3 px-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">Millennials 25–34 DE</span>
          <Badge variant="secondary" className="text-xs font-normal">Germany</Badge>
          <Badge className="text-xs font-normal bg-primary/10 text-primary border-0">Shared</Badge>
        </div>
        <p className="text-xs text-secondary-foreground mt-0.5 line-clamp-1">High-income urban consumers interested in premium brands</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {[<Pencil key="p" />, <Copy key="c" />, <Trash2 key="t" />].map((icon, i) => (
          <button key={i} className={cn(
            'inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-muted-foreground transition-colors',
            i === 2 ? 'hover:bg-red-50 hover:border-red-200 hover:text-destructive' : 'hover:bg-accent hover:text-foreground'
          )}>{icon}</button>
        ))}
      </div>
    </div>
  )
}

function DashboardStyleRow() {
  return (
    <div className="group flex items-center gap-3 py-3 rounded-xl hover:bg-accent transition-colors cursor-pointer -mx-3 px-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/8 text-primary shrink-0">
        <LayoutDashboard className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">Q1 Audience Overview</p>
        <p className="text-xs text-muted-foreground mt-0.5">3 widgets · Updated 3/15/2025</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-muted-foreground hover:bg-red-50 hover:border-red-200 hover:text-destructive">
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

function WidgetDragRow() {
  return (
    <div className="group flex items-center gap-2 px-3 py-2 hover:bg-primary/5 transition-colors cursor-grab active:cursor-grabbing rounded-md">
      <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/8 text-primary shrink-0">
        <BarChart2 className="h-3 w-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">Purchase Intent by Brand</p>
        <p className="text-xs text-foreground">Bar chart</p>
      </div>
    </div>
  )
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function OverviewPage() {
  const items: { name: string; status: 'done' | 'warn' | 'info'; note: string }[] = [
    { name: 'ResourceCard',    status: 'done', note: 'White header + gray-25 meta row, icon optional' },
    { name: 'IconBtn',         status: 'done', note: '7×7 bordered icon button, destructive variant' },
    { name: 'PageShell',       status: 'done', note: 'p-6 max-w-5xl mx-auto standard' },
    { name: 'Button',          status: 'done', note: 'default · outline · ghost · destructive · toolbar (h-8 text-xs)' },
    { name: 'Badge',           status: 'done', note: 'default · secondary · type-colour variants' },
    { name: 'Input',           status: 'done', note: 'Standard height + small variant' },
    { name: 'Chip',            status: 'done', note: 'default · primary · suggestion, with optional remove' },
    { name: 'Toolbar',         status: 'done', note: 'app/Toolbar.tsx + ToolbarActions' },
    { name: 'EmptyState',      status: 'done', note: 'Single component, optional CTA' },
    { name: 'SectionLabel',    status: 'done', note: 'Caps 10px label for groups' },
    { name: 'FieldGroup',      status: 'done', note: 'Label + content wrapper' },
    { name: 'Select',          status: 'warn', note: 'Two hand-rolled variants — not yet extracted' },
    { name: 'Checkbox',        status: 'warn', note: 'Two sizes, not using a Toggle component' },
    { name: 'WidgetPropertiesPanel', status: 'info', note: 'Inline in DashboardBuilderPage — extract when ready' },
  ]

  const dot: Record<'done' | 'warn' | 'info', string> = {
    done: 'bg-emerald-500',
    warn: 'bg-amber-400',
    info: 'bg-muted-foreground/40',
  }
  const label: Record<'done' | 'warn' | 'info', string> = {
    done: 'text-green-700',
    warn: 'text-amber-700',
    info: 'text-muted-foreground',
  }

  return (
    <>
      <PageHeader
        title="Overview"
        description="Status of every UI pattern in the app. Green = consolidated, amber = inconsistency known, gray = future work."
      />

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr] text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border gap-4">
          <span>Component</span>
          <span>Note</span>
        </div>
        {items.map(item => (
          <div key={item.name} className="grid grid-cols-[1fr_2fr] gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors items-center">
            <div className="flex items-center gap-2">
              <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot[item.status])} />
              <code className={cn('text-xs font-medium', label[item.status])}>{item.name}</code>
            </div>
            <span className="text-xs text-foreground">{item.note}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Consolidated</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Known inconsistency</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-foreground/40 inline-block" /> Future work</span>
      </div>
    </>
  )
}

function TypographyPage() {
  return (
    <>
      <PageHeader title="Typography" description="Font families, semantic tokens, size scale, and context-specific usage rules." />

      {/* ── Core scale ── */}
      <Section title="Core size scale" hint="32 → 24 → 20 → 16 → 14 → 12">
        <p className="text-sm text-foreground mb-4">
          Use only these six steps. <code className="font-mono">14px / 20px</code> is the default application text.
          <code className="font-mono"> 14px / 18px</code> is for dense contexts. Do not reduce primary values below <code className="font-mono">14px</code>.
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[180px_48px_52px_110px_1fr] gap-3 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Semantic token</span><span>px</span><span>rem</span><span>Line height</span><span>Usage</span>
          </div>
          {[
            { token: '--type-title-major',   px: '32', rem: '2',      lh: '40px · 2.5rem',  usage: 'Hero and marketing titles' },
            { token: '--type-title-page',    px: '24', rem: '1.5',    lh: '32px · 2rem',    usage: 'Page titles (h1)' },
            { token: '--type-title-section', px: '20', rem: '1.25',   lh: '28px · 1.75rem', usage: 'Section titles (h2)' },
            { token: '--type-title-compact', px: '16', rem: '1',      lh: '24px · 1.5rem',  usage: 'Nav items, prominent labels' },
            { token: '--type-body',          px: '14', rem: '0.875',  lh: '20px · 1.25rem', usage: 'Default body, buttons, inputs, row text' },
            { token: '--type-compact',       px: '14', rem: '0.875',  lh: '18px · 1.125rem',usage: 'Dense body text' },
            { token: '--type-supporting',    px: '12', rem: '0.75',   lh: '16px · 1rem',    usage: 'Labels, meta, helper text, chart axes' },
          ].map(({ token, px, rem, lh, usage }) => (
            <div key={token} className="grid grid-cols-[180px_48px_52px_110px_1fr] gap-3 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
              <code className="text-xs text-foreground font-medium">{token}</code>
              <span className="text-xs text-muted-foreground tabular-nums">{px}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{rem}</span>
              <span className="text-xs text-foreground">{lh}</span>
              <span className="text-xs text-foreground">{usage}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Font weight ── */}
      <Section title="Font weight">
        <div className="rounded-xl border border-border overflow-hidden mb-3 pb-px">
          <div className="grid grid-cols-[140px_48px_1fr_1fr] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Token</span><span>Value</span><span>Sample</span><span>Usage</span>
          </div>
          {[
            { token: 'font-normal',   value: '400', sample: <span className="text-sm font-normal text-foreground">The quick brown fox</span>, usage: 'Body text, table values, chart labels, descriptions, input values, mono values' },
            { token: 'font-medium',   value: '500', sample: <span className="text-sm font-medium text-foreground">The quick brown fox</span>, usage: 'Buttons, navigation, table headers, form labels, tabs, filters' },
            { token: 'font-semibold', value: '600', sample: <span className="text-sm font-semibold text-foreground">The quick brown fox</span>, usage: 'Page titles, section headings, important KPI values, strong selected states' },
            { token: 'font-bold',     value: '700', sample: <span className="text-sm font-bold text-foreground line-through opacity-40">The quick brown fox</span>, usage: 'Do not use — not part of the type scale' },
          ].map(({ token, value, sample, usage }) => (
            <div key={token} className="grid grid-cols-[140px_48px_1fr_1fr] gap-4 px-4 py-3 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
              <code className="text-xs text-foreground font-medium">{token}</code>
              <span className="text-xs text-muted-foreground tabular-nums">{value}</span>
              <div>{sample}</div>
              <span className="text-xs text-foreground">{usage}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground">Dense interfaces should remain predominantly Regular (400). Use Medium and Semibold selectively.</p>
      </Section>

      {/* ── Font family ── */}
      <Section title="Font family">
        <div className="rounded-xl border border-border overflow-hidden mb-4 pb-px">
          <div className="grid grid-cols-[180px_1fr_200px] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Typeface</span><span>Sample</span><span>Role</span>
          </div>
          <div className="grid grid-cols-[180px_1fr_200px] gap-4 px-4 py-3 border-b border-border/40 items-center hover:bg-muted/20 transition-colors py-3">
            <div>
              <code className="text-xs text-foreground font-medium">font-sans</code>
              <p className="text-xs text-secondary-foreground mt-0.5">Instrument Sans</p>
            </div>
            <span className="text-sm text-foreground">The quick brown fox jumps</span>
            <span className="text-xs text-foreground">Primary — all UI by default</span>
          </div>
          <div className="grid grid-cols-[180px_1fr_200px] gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors py-3">
            <div>
              <code className="text-xs text-foreground font-medium">font-mono</code>
              <p className="text-xs text-secondary-foreground mt-0.5">IBM Plex Mono</p>
            </div>
            <span className="text-sm font-mono text-foreground">DS-10482 · 2026-06-12</span>
            <span className="text-xs text-foreground">Secondary — machine-readable only</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-medium text-foreground mb-2">Use Instrument Sans for</p>
            <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
              <li>Navigation, buttons, form controls</li>
              <li>Table headers and cells</li>
              <li>KPI values, chart axes, legends</li>
              <li>Percentages, currency, rankings</li>
              <li>Descriptions and long-form text</li>
              <li>Human-readable dates</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-medium text-foreground mb-2">Use IBM Plex Mono for</p>
            <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
              <li>Dataset and record identifiers</li>
              <li>Country, currency, market codes</li>
              <li>Machine-formatted timestamps</li>
              <li>Version numbers, query syntax, code</li>
              <li>Formulas, file hashes, API keys</li>
              <li>Fixed-format metadata values</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-border/40 space-y-1">
              {['DS-10482', 'DE-BE', 'EUR', '2026-06-12 14:07:32', 'v2.14.0'].map(ex => (
                <code key={ex} className="block text-xs font-mono text-foreground">{ex}</code>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Context: table ── */}
      <Section title="Table typography">
        <div className="rounded-xl border border-border overflow-hidden mb-3 pb-px">
          <div className="grid grid-cols-[180px_1fr] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Element</span><span>Typography</span>
          </div>
          {[
            { el: 'Table cells',         spec: '14px / 18px, weight 400' },
            { el: 'Numeric cells',       spec: '14px / 18px, weight 400, tabular-nums lining-nums' },
            { el: 'Table headers',       spec: '12px / 16px or 14px / 18px, weight 500' },
            { el: 'Secondary cell text', spec: '12px / 16px, weight 400' },
            { el: 'Dataset identifiers', spec: '12px / 16px, IBM Plex Mono, weight 400' },
          ].map(({ el, spec }) => (
            <div key={el} className="grid grid-cols-[180px_1fr] gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
              <span className="text-xs text-foreground">{el}</span>
              <span className="text-xs text-foreground">{spec}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground">Use 12px headers when labels are short and secondary. Use 14px for longer human-readable labels. Do not place entire tables in IBM Plex Mono.</p>
      </Section>

      {/* ── Context: chart ── */}
      <Section title="Chart typography">
        <div className="rounded-xl border border-border overflow-hidden mb-3 pb-px">
          <div className="grid grid-cols-[180px_1fr] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Element</span><span>Typography</span>
          </div>
          {[
            { el: 'Chart title',    spec: '14px / 20px or 16px / 24px' },
            { el: 'Legend',        spec: '12px / 16px' },
            { el: 'Axis labels',   spec: '12px / 16px' },
            { el: 'Tooltip values',spec: '14px / 18px' },
            { el: 'Tooltip labels',spec: '12px / 16px' },
          ].map(({ el, spec }) => (
            <div key={el} className="grid grid-cols-[180px_1fr] gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
              <span className="text-xs text-foreground">{el}</span>
              <span className="text-xs text-foreground">{spec}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-foreground mb-2">Do not render chart text below 12px. When labels do not fit: reduce tick frequency, abbreviate values, increase chart dimensions, or move secondary detail into a tooltip. Do not solve overcrowding by shrinking type.</p>
      </Section>

      {/* ── Context: controls ── */}
      <Section title="Control typography">
        <div className="rounded-xl border border-border overflow-hidden mb-3 pb-px">
          <div className="grid grid-cols-[180px_1fr] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Control</span><span>Typography</span>
          </div>
          {[
            { el: 'Default button',    spec: '14px / 20px, weight 500' },
            { el: 'Compact button',    spec: '14px / 18px, weight 500' },
            { el: 'Default input',     spec: '14px / 20px, weight 400' },
            { el: 'Compact input',     spec: '14px / 18px, weight 400' },
            { el: 'Form label',        spec: '12px / 16px or 14px / 18px, weight 500' },
            { el: 'Helper text',       spec: '12px / 16px, weight 400' },
            { el: 'Menu item',         spec: '14px / 20px, weight 400 or 500' },
            { el: 'Compact menu item', spec: '14px / 18px, weight 400 or 500' },
          ].map(({ el, spec }) => (
            <div key={el} className="grid grid-cols-[180px_1fr] gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
              <span className="text-xs text-foreground">{el}</span>
              <span className="text-xs text-foreground">{spec}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground">Do not use 16px for ordinary desktop controls unless intentionally prominent.</p>
      </Section>

      {/* ── Numeric typography ── */}
      <Section title="Numeric typography">
        <div className="rounded-xl border border-border overflow-hidden mb-3 pb-px">
          <div className="grid grid-cols-[220px_1fr] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Approach</span><span>When to use</span>
          </div>
          <div className="grid grid-cols-[220px_1fr] gap-4 px-4 py-3 border-b border-border/40 items-start hover:bg-muted/20 transition-colors py-3">
            <div>
              <p className="text-xs font-medium text-foreground">Tabular lining figures</p>
              <code className="text-xs font-mono text-foreground">tabular-nums lining-nums</code>
              <p className="text-sm font-normal text-foreground mt-2 tabular-nums">1,234,567.89</p>
            </div>
            <p className="text-xs text-foreground">Numeric table columns, financial values, percentages, rankings, KPI values, dynamic values, values compared vertically, chart values</p>
          </div>
          <div className="grid grid-cols-[220px_1fr] gap-4 px-4 py-3 items-start hover:bg-muted/20 transition-colors py-3">
            <div>
              <p className="text-xs font-medium text-foreground">Proportional figures</p>
              <code className="text-xs font-mono text-foreground">default (no override)</code>
              <p className="text-sm font-normal text-foreground mt-2">Insight 3 of 12</p>
            </div>
            <p className="text-xs text-foreground">Ordinary prose when alignment is not required</p>
          </div>
        </div>
        <p className="text-xs text-foreground">Do not use IBM Plex Mono to get equal-width numerals. Prefer <code className="font-mono">tabular-nums</code> in Instrument Sans.</p>
      </Section>

      {/* ── Semantic tokens ── */}
      <Section title="Semantic tokens">
        <p className="text-sm text-foreground mb-3">Components consume these tokens rather than raw utility sizes. When a role is missing, map to the closest existing token before creating a new one.</p>
        <div className="rounded-xl border border-border overflow-hidden mb-3 pb-px">
          <div className="grid grid-cols-[220px_60px_1fr] gap-3 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Token pair</span><span>px</span><span>Line height token</span>
          </div>
          {[
            { size: '--type-title-major-size',   px: '32', line: '--type-title-major-line: 2.5rem' },
            { size: '--type-title-page-size',    px: '24', line: '--type-title-page-line: 2rem' },
            { size: '--type-title-section-size', px: '20', line: '--type-title-section-line: 1.75rem' },
            { size: '--type-title-compact-size', px: '16', line: '--type-title-compact-line: 1.5rem' },
            { size: '--type-body-size',          px: '14', line: '--type-body-line: 1.25rem' },
            { size: '--type-compact-size',       px: '14', line: '--type-compact-line: 1.125rem' },
            { size: '--type-supporting-size',    px: '12', line: '--type-supporting-line: 1rem' },
          ].map(({ size, px, line }) => (
            <div key={size} className="grid grid-cols-[220px_60px_1fr] gap-3 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
              <code className="text-xs font-mono text-foreground">{size}</code>
              <span className="text-xs text-muted-foreground tabular-nums">{px}px</span>
              <code className="text-xs font-mono text-foreground">{line}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Letter spacing ── */}
      <Section title="Letter spacing">
        <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>Use the typeface's default letter spacing unless a semantic token specifies otherwise</li>
          <li>Do not add tracking to ordinary body text</li>
          <li>Do not use negative tracking for small labels</li>
          <li>Avoid uppercase labels in dense interfaces</li>
          <li>Do not apply decorative tracking to numbers</li>
          <li>Do not increase IBM Plex Mono letter spacing by default</li>
          <li>Do not tighten small text to create more horizontal space</li>
          <li>Large titles may receive a small, globally defined tracking adjustment after visual testing — not per component</li>
        </ul>
      </Section>
    </>
  )
}

function IconsPage() {
  return (
    <>
      <PageHeader title="Icons" description="Sizing, weight, and pairing rules for Tabler Icons." />

      <Section title="Icon library">
        <p className="text-sm text-foreground mb-3">Use <strong className="font-medium text-foreground">Tabler Icons</strong> exclusively. Do not mix icons from multiple libraries.</p>
      </Section>

      <Section title="Stroke weight">
        <div className="rounded-xl border border-border overflow-hidden mb-4 pb-px">
          <div className="grid grid-cols-[160px_80px_1fr] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Context</span><span>stroke-width</span><span>When to use</span>
          </div>
          {[
            { ctx: 'Default', sw: '2', note: 'Icon-only controls and icons paired with medium/semibold text' },
            { ctx: 'Light', sw: '1.75', note: 'When a lighter treatment is needed alongside regular-weight text' },
            { ctx: 'Heavy', sw: '> 2', note: 'Do not use unless explicitly defined and visually tested' },
          ].map(({ ctx, sw, note }) => (
            <div key={ctx} className="grid grid-cols-[160px_80px_1fr] gap-4 px-4 py-3 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
              <span className="text-xs text-foreground">{ctx}</span>
              <code className="text-xs font-mono text-foreground">{sw}</code>
              <span className="text-xs text-foreground">{note}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground">Match icon visual weight to the text it accompanies. Do not map font-weight values directly to SVG stroke widths.</p>
      </Section>

      <Section title="Size scale">
        <div className="rounded-xl border border-border overflow-hidden mb-4 pb-px">
          <div className="grid grid-cols-[140px_100px_1fr] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Container</span><span>Icon size</span><span>Context</span>
          </div>
          {[
            { container: '32px container', size: '18–20px', note: 'Standard icon buttons' },
            { container: '24px container', size: '16px',    note: 'Compact toolbars, secondary actions' },
            { container: '20px container', size: '12–14px', note: 'Dense toolbars, tables, filters' },
            { container: 'Paired with text', size: '1.25cap', note: 'Default for text-paired icons — matches cap height of adjacent type' },
          ].map(({ container, size, note }) => (
            <div key={container} className="grid grid-cols-[140px_100px_1fr] gap-4 px-4 py-3 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
              <span className="text-xs text-foreground">{container}</span>
              <code className="text-xs font-mono text-foreground">{size}</code>
              <span className="text-xs text-foreground">{note}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-foreground mb-2">Use <code className="font-mono">12px</code> only for simple glyphs (chevrons, arrows, sort indicators, close marks). Do not render detailed Tabler icons at 12px.</p>
        <p className="text-xs text-foreground">Do not introduce arbitrary sizes outside this scale.</p>
      </Section>

      <Section title="Pairing icons with text">
        <div className="space-y-3 mb-4">
          {[
            { label: 'Default paired size', cls: 'flex items-center gap-2 text-sm text-foreground', iconCls: 'shrink-0 [&>svg]:w-[1.25cap] [&>svg]:h-[1.25cap]', note: '1.25cap · flex + items-center' },
          ].map(({ label, cls, iconCls, note }) => (
            <div key={label} className="flex items-start gap-6">
              <div className={cls}>
                <span className={iconCls}>
                  <LayoutDashboard />
                </span>
                Dashboard
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{label}</p>
                <p className="text-xs text-foreground">{note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-muted/40 border border-border p-4 text-xs space-y-1">
          <p className="font-medium text-foreground mb-2">Rules</p>
          <ul className="text-muted-foreground space-y-1 list-disc list-inside">
            <li>Size icon relative to cap height (<code className="font-mono">1.25cap</code> default), not fixed px</li>
            <li>Keep icon square — same value for width and height</li>
            <li>Align with flexbox, not manual top offsets</li>
            <li>Apply <code className="font-mono">flex-shrink: 0</code> to prevent distortion</li>
            <li>Do not stretch, crop, or distort icons</li>
          </ul>
        </div>
      </Section>

      <Section title="Interactive targets">
        <div className="space-y-3 text-xs text-muted-foreground">
          <p>The visual container and the interactive target are separate concepts.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Icon buttons must have a minimum tap target of <strong className="font-medium text-foreground">32×32px</strong></li>
            <li>A 20px or 24px visual icon may sit inside a larger clickable area</li>
            <li>Do not make the SVG element itself the only clickable region</li>
          </ul>
          <p>Use the same icon size and stroke for controls at the same hierarchy level.</p>
        </div>
      </Section>
    </>
  )
}

function ColorPage() {
  return (
    <>
      <PageHeader title="Color" description="Semantic token system, palette, usage rules, and prohibited patterns." />

      {/* ── Core principles ── */}
      <Section title="Core principles">
        <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>Neutral colors dominate the interface — use color only when it communicates meaning</li>
          <li>Use semantic tokens in components — never raw palette values directly</li>
          <li>Keep saturated color visually scarce so it retains meaning</li>
          <li>Do not communicate status, selection, or category through color alone</li>
          <li>Blue text implies interaction — do not use it for passive labels</li>
        </ul>
      </Section>

      {/* ── Palette ── */}
      <Section title="Palette foundations">
        <div className="rounded-xl border border-border overflow-hidden mb-4 pb-px">
          <div className="grid grid-cols-[120px_1fr_1fr] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Family</span><span>Role</span><span>Key shades in use</span>
          </div>
          {[
            { family: 'Zinc', role: 'Neutral foundation — all surfaces, text, borders, icons', shades: '50 · 100 · 200 · 400 · 600 · 950' },
            { family: 'Brand blue', role: 'Primary interaction, links, focus, selected states', shades: '500 (#1A72E7) · 600 (#0666E5) · 700 · 800' },
            { family: 'Blue', role: 'Informational states (separate token from brand)', shades: '50 · 100 · 300 · 600 · 700' },
            { family: 'Emerald', role: 'Success — healthy status, valid, confirmed positive', shades: '50 · 300 · 600 · 700' },
            { family: 'Amber', role: 'Warning — non-blocking risk, attention, partial', shades: '50 · 300 · 600 · 800' },
            { family: 'Red', role: 'Danger — errors, failed states, destructive actions', shades: '50 · 300 · 600 · 700' },
            { family: 'Chart palette', role: 'Data visualization only — not for UI controls', shades: 'violet · cyan · orange · fuchsia · teal · indigo · lime' },
          ].map(({ family, role, shades }) => (
            <div key={family} className="grid grid-cols-[120px_1fr_1fr] gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 items-start hover:bg-muted/20 transition-colors py-3">
              <span className="text-xs font-medium text-foreground">{family}</span>
              <span className="text-xs text-foreground">{role}</span>
              <span className="text-xs font-mono text-foreground">{shades}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground">Extend the palette only when an existing raw value cannot support the required semantic role. Do not mix Zinc and Gray as competing neutral foundations.</p>
      </Section>

      {/* ── Semantic tokens ── */}
      <Section title="Semantic tokens — light theme">
        <div className="space-y-6">
          {/* Background */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Background</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-[24px_180px_120px_1fr] gap-3 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
                <span />  <span>Token</span><span>Palette ref</span><span>Usage</span>
              </div>
              {[
                { sw: 'bg-background border border-border', token: 'background.default', ref: 'white', usage: 'Main content, cards, popovers' },
                { sw: 'bg-muted', token: 'background.submerged', ref: 'zinc.50', usage: 'Sidebar, table headers, filter areas, inspector panels' },
                { sw: 'bg-accent', token: 'background.neutral.subtle-hovered', ref: 'zinc.100', usage: 'Hover states on rows, menu items, buttons' },
                { sw: 'bg-primary/10', token: 'background.brand.subtle', ref: 'blue.50', usage: 'Selected rows, active nav tint, chip background' },
                { sw: 'bg-primary', token: 'background.brand.bold', ref: 'brand.600', usage: 'Primary buttons, checked controls, active badges' },
                { sw: 'bg-destructive/10', token: 'background.danger.subtle', ref: 'red.50', usage: 'Destructive hover, error notice background' },
                { sw: 'bg-destructive', token: 'background.danger.bold', ref: 'red.600', usage: 'Destructive button fill' },
              ].map(({ sw, token, ref, usage }) => (
                <div key={token} className="grid grid-cols-[24px_180px_120px_1fr] gap-3 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
                  <div className={cn('w-4 h-4 rounded shrink-0 border border-black/[0.06]', sw)} />
                  <code className="text-xs text-foreground">{token}</code>
                  <span className="text-xs font-mono text-foreground">{ref}</span>
                  <span className="text-xs text-foreground">{usage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Text</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-[24px_160px_120px_1fr] gap-3 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
                <span /><span>Token</span><span>Palette ref</span><span>Usage</span>
              </div>
              {[
                { sw: 'bg-foreground',          token: 'text.default',    ref: 'zinc.950', usage: 'Headings, body, row titles, primary labels' },
                { sw: 'bg-zinc-600',            token: 'text.subtle',     ref: 'zinc.600', usage: 'Secondary descriptions, sidebar nav' },
                { sw: 'bg-muted-foreground',    token: 'text.subtlest',   ref: 'zinc.400', usage: 'Placeholders, meta, helper text, disabled labels' },
                { sw: 'bg-primary',             token: 'text.brand/link', ref: 'brand.600', usage: 'Links, interactive labels — implies clickable' },
                { sw: 'bg-destructive',         token: 'text.danger',     ref: 'red.700',  usage: 'Error messages, destructive confirmations' },
                { sw: 'bg-emerald-700',         token: 'text.success',    ref: 'emerald.700', usage: 'Success messages, positive confirmations' },
                { sw: 'bg-amber-800',           token: 'text.warning',    ref: 'amber.800', usage: 'Warning messages, attention states' },
              ].map(({ sw, token, ref, usage }) => (
                <div key={token} className="grid grid-cols-[24px_160px_120px_1fr] gap-3 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
                  <div className={cn('w-4 h-4 rounded shrink-0 border border-black/[0.06]', sw)} />
                  <code className="text-xs text-foreground">{token}</code>
                  <span className="text-xs font-mono text-foreground">{ref}</span>
                  <span className="text-xs text-foreground">{usage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Border */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Border</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-[24px_160px_120px_1fr] gap-3 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
                <span /><span>Token</span><span>Palette ref</span><span>Usage</span>
              </div>
              {[
                { sw: 'border-2 border-black/[0.06]', token: 'border.subtle',   ref: 'alpha.black.8',   usage: 'Sidebar, floating surface edges' },
                { sw: 'border-2 border-black/[0.12]', token: 'border.default',  ref: 'alpha.black.12',  usage: 'Cards, inputs, dividers — standard use' },
                { sw: 'border-2 border-black/[0.18]', token: 'border.strong',   ref: 'alpha.black.18',  usage: 'Emphasized boundaries' },
                { sw: 'border-2 border-primary',      token: 'border.brand',    ref: 'brand.600',        usage: 'Focus rings, selected inputs, active filters' },
                { sw: 'border-2 border-destructive',  token: 'border.danger',   ref: 'red.300',          usage: 'Invalid input, error state borders' },
              ].map(({ sw, token, ref, usage }) => (
                <div key={token} className="grid grid-cols-[24px_160px_120px_1fr] gap-3 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
                  <div className={cn('w-4 h-4 rounded shrink-0', sw)} />
                  <code className="text-xs text-foreground">{token}</code>
                  <span className="text-xs font-mono text-foreground">{ref}</span>
                  <span className="text-xs text-foreground">{usage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Chart categorical palette ── */}
      <Section title="Chart categorical palette">
        <p className="text-sm text-foreground mb-3">8 distinct hues for unordered categorical series. Brand blue is always series 1. Assign the same category the same color across related views. Group minor categories into "Other" (zinc.500).</p>
        <div className="rounded-xl border border-border overflow-hidden mb-4 pb-px">
          <div className="grid grid-cols-[24px_80px_120px_1fr] gap-3 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span /><span>Series</span><span>Value</span><span>Hue</span>
          </div>
          {[
            { hex: '#0666E5', series: 'cat.1', hue: 'Brand blue' },
            { hex: '#7C3AED', series: 'cat.2', hue: 'Violet' },
            { hex: '#0891B2', series: 'cat.3', hue: 'Cyan' },
            { hex: '#EA580C', series: 'cat.4', hue: 'Orange' },
            { hex: '#C026D3', series: 'cat.5', hue: 'Fuchsia' },
            { hex: '#0D9488', series: 'cat.6', hue: 'Teal' },
            { hex: '#4F46E5', series: 'cat.7', hue: 'Indigo' },
            { hex: '#65A30D', series: 'cat.8', hue: 'Lime' },
            { hex: '#a1a1aa', series: 'other', hue: 'Zinc.400 — grouped "Other"' },
          ].map(({ hex, series, hue }) => (
            <div key={series} className="grid grid-cols-[24px_80px_120px_1fr] gap-3 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
              <div className="w-4 h-4 rounded shrink-0" style={{ background: hex }} />
              <code className="text-xs text-foreground">{series}</code>
              <code className="text-xs font-mono text-foreground">{hex}</code>
              <span className="text-xs text-foreground">{hue}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground">Avoid assigning Emerald, Amber, or Red to neutral categories — users interpret these as success, warning, and danger.</p>
      </Section>

      {/* ── Semantic color usage ── */}
      <Section title="Semantic color usage">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Brand / Interaction', color: 'bg-primary', usage: 'Primary actions, links, focus, checked controls, active filters, active navigation' },
            { label: 'Information', color: 'bg-blue-600', usage: 'Neutral notices, explanatory alerts, informational system states — separate token from brand' },
            { label: 'Success', color: 'bg-emerald-600', usage: 'Successful completion, healthy status, valid input, confirmed positive outcomes' },
            { label: 'Warning', color: 'bg-amber-500', usage: 'Non-blocking risk, attention-required states, partial completion' },
            { label: 'Danger', color: 'bg-destructive', usage: 'Errors, failed states, invalid input, destructive actions, critical problems' },
          ].map(({ label, color, usage }) => (
            <div key={label} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className={cn('w-3 h-3 rounded-full mt-0.5 shrink-0', color)} />
              <div>
                <p className="text-xs font-medium text-foreground mb-0.5">{label}</p>
                <p className="text-xs text-foreground">{usage}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Every semantic color must be accompanied by text, a label, icon, or shape. Do not rely on color alone.</p>
      </Section>

      {/* ── Decision rule ── */}
      <Section title="Decision rule">
        <p className="text-sm text-foreground mb-3">Before applying a non-neutral color, identify its exact meaning:</p>
        <div className="flex flex-wrap gap-2">
          {['Brand or interaction', 'Selection', 'Information', 'Success', 'Warning', 'Danger', 'Data meaning', 'Meaningful grouping'].map((m, i) => (
            <span key={m} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-xs text-muted-foreground">
              <span className="text-xs font-medium text-foreground tabular-nums">{i + 1}.</span> {m}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">If none apply, use a neutral token.</p>
      </Section>

      {/* ── Prohibited ── */}
      <Section title="Prohibited">
        <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>Raw palette values in components — always use semantic tokens</li>
          <li>Color without semantic purpose</li>
          <li>Colored background on every card</li>
          <li>Brand blue on passive labels, passive borders, or ordinary metadata</li>
          <li>Semantic status colors without genuine semantic meaning</li>
          <li>Visualization colors on UI controls</li>
          <li>Multiple unrelated accent hues in the main interface</li>
          <li>Large saturated surfaces without a strong reason</li>
          <li>Colored outer glows</li>
          <li>Category colors that conflict with success, warning, or danger meanings</li>
        </ul>
      </Section>
    </>
  )
}

function DataVizPage() {
  return (
    <>
      <PageHeader title="Data Visualization" description="Chart selection, color roles, axes, labels, and prohibited patterns." />

      <Section title="Intent first">
        <p className="text-sm text-foreground mb-3">Before selecting a chart, identify:</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {['The question being answered', 'The primary metric', 'The comparison or dimension', 'The relevant time period', 'The intended audience', 'The decision or action this supports'].map(q => (
            <div key={q} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-foreground mt-0.5">→</span> {q}
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground">If the task is unclear, use a table or request clarification rather than choosing a decorative chart.</p>
      </Section>

      <Section title="Chart selection">
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[120px_1fr_1fr] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Chart type</span><span>Use when</span><span>Avoid when</span>
          </div>
          {[
            { type: 'KPI / Scorecard', use: 'One important value with context (period, target, delta)', avoid: 'Many equally prominent KPIs; delta without comparison period' },
            { type: 'Table', use: 'Exact values, many attributes, sort/filter, identifiers, export', avoid: 'Pattern recognition is the goal; too few rows to need a table' },
            { type: 'Bar', use: 'Compare categories, rank items, discrete quantities', avoid: 'Time series with many points; rounded/3D bars' },
            { type: 'Line', use: 'Time series, ordered trends, rates over time', avoid: 'Unordered categories; more series than users can distinguish' },
            { type: 'Area', use: 'Total volume over time; part-to-whole change; bounded range', avoid: 'Overlapping opaque fills; decorative line enrichment' },
            { type: 'Stacked bar/area', use: 'Both total and composition matter', avoid: 'Precise per-series comparison is the main task; many small segments' },
            { type: 'Scatter', use: 'Relationship between two quantitative variables, clusters, outliers', avoid: 'Implying causation from correlation' },
            { type: 'Heatmap', use: 'Magnitude across two dimensions; cohort retention; time-of-day', avoid: 'When exact values are needed without tooltip' },
            { type: 'Pie / Donut', use: 'Few categories, approximate proportion, one meaningful whole', avoid: '>5 categories; similar values; ranking matters; comparison over time' },
            { type: 'Map', use: 'Geography is part of the analytical question', avoid: 'Decorative alternative to ranked table or bar chart' },
          ].map(({ type, use, avoid }) => (
            <div key={type} className="grid grid-cols-[120px_1fr_1fr] gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 items-start hover:bg-muted/20 transition-colors py-3">
              <span className="text-xs font-medium text-foreground">{type}</span>
              <span className="text-xs text-foreground">{use}</span>
              <span className="text-xs text-foreground">{avoid}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Color roles">
        <div className="rounded-xl border border-border overflow-hidden mb-3 pb-px">
          <div className="grid grid-cols-[140px_1fr] gap-4 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Role</span><span>Rule</span>
          </div>
          {[
            { role: 'Primary / Selected', rule: 'Brand blue (#0666E5). Main series, selected series, user\'s dataset, highlighted points.' },
            { role: 'Categorical', rule: '8-hue palette from color tokens. Assign same category same color across views. Group minor categories into "Other" (zinc).' },
            { role: 'Sequential', rule: 'Lightness changes for magnitude (volume, density, intensity). Do not use rainbow scales.' },
            { role: 'Diverging', rule: 'Only when data has a meaningful midpoint (zero, target, average). Restrained neutral at midpoint, stronger color at both ends.' },
            { role: 'Semantic (threshold)', rule: 'Emerald/Amber/Red only when data genuinely represents success/warning/danger. Never auto-encode increase=green or decrease=red.' },
            { role: 'Contextual / Inactive', rule: 'Zinc neutrals for grid lines, axes, inactive series, reference ranges.' },
          ].map(({ role, rule }) => (
            <div key={role} className="grid grid-cols-[140px_1fr] gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 items-start hover:bg-muted/20 transition-colors py-3">
              <span className="text-xs font-medium text-foreground">{role}</span>
              <span className="text-xs text-foreground">{rule}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground">When one series is highlighted, reduce emphasis on contextual series rather than increasing saturation everywhere. Do not use glow, gradients, or 3D as series emphasis.</p>
      </Section>

      <Section title="Axes, scales, and labels">
        <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>Label axes when the measure or unit is not obvious</li>
          <li>Use zero baselines for bars and area charts — do not truncate to exaggerate differences</li>
          <li>Line chart axes need not start at zero, but the visible range must not distort the trend</li>
          <li>Keep time axes chronological (left to right)</li>
          <li>Use linear scales by default; logarithmic only when range requires it — always labeled</li>
          <li>Keep grid lines subtle and subordinate to the data</li>
          <li>Prefer direct labels when they reduce lookup effort and do not create clutter</li>
          <li>Include units in the axis, title, label, or tooltip — not inferred</li>
          <li>Avoid dual-axis charts; prefer separate aligned charts or indexed values</li>
          <li>Do not rotate labels unless shortening, wrapping, or changing orientation would be worse</li>
          <li>Do not truncate category names that carry the primary meaning of the visualization</li>
        </ul>
      </Section>

      <Section title="Numbers and formatting">
        <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>Use tabular lining figures where numerical alignment matters</li>
          <li>Use Instrument Sans for chart values; IBM Plex Mono only for identifiers or fixed-format values</li>
          <li>Use consistent decimal precision — do not show more than source data supports</li>
          <li>Abbreviate large values when it improves scanning; expose precise value in tooltip</li>
          <li>Use locale-aware separators and formats</li>
          <li>Distinguish percentages from percentage-point change explicitly</li>
          <li>Display units and currencies explicitly</li>
          <li>Do not mix abbreviated and full values on the same axis without a clear reason</li>
        </ul>
      </Section>

      <Section title="Tooltips">
        <p className="text-sm text-foreground mb-2">Include only relevant information: category or timestamp, exact value, unit, comparison or delta, series name. Use the same formatting and names as the chart. Do not place controls or essential actions inside hover-only tooltips.</p>
      </Section>

      <Section title="Empty, loading, and error states">
        <p className="text-sm text-foreground mb-2">A visualization must distinguish between:</p>
        <div className="flex flex-wrap gap-2">
          {['Loading', 'No results', 'All values are zero', 'Missing data', 'Filtered-out data', 'Query error', 'Insufficient permissions'].map(s => (
            <span key={s} className="px-2.5 py-1 rounded-full border border-border text-xs text-muted-foreground">{s}</span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Do not display an empty chart frame when there is no data. Do not interpret missing values as zero unless explicitly defined by the data model.</p>
      </Section>

      <Section title="Automated / LLM-generated visualizations">
        <p className="text-sm text-foreground mb-2">When generating a visualization automatically:</p>
        <ol className="text-sm text-foreground space-y-1 list-decimal list-inside leading-relaxed">
          <li>Infer the user's analytical intent</li>
          <li>Classify fields as temporal, categorical, quantitative, ordinal, or identifier</li>
          <li>Identify metric, dimension, aggregation, filters, and time range</li>
          <li>Check category cardinality and missing values</li>
          <li>Select the simplest valid representation</li>
          <li>Apply meaningful ordering and number formatting</li>
          <li>State important assumptions</li>
          <li>Allow the user to change chart type, axes, aggregation, or time granularity</li>
          <li>Fall back to a table when no chart remains clear</li>
        </ol>
      </Section>

      <Section title="Decision checklist">
        <p className="text-sm text-foreground mb-2">Before adding or changing a visualization, verify:</p>
        <ol className="text-sm text-foreground space-y-1 list-decimal list-inside leading-relaxed">
          <li>What exact question does it answer?</li>
          <li>Is a chart more useful than a table or single value?</li>
          <li>Is the chosen encoding accurate for the data type?</li>
          <li>Is the primary comparison immediately visible?</li>
          <li>Are ordering, scale, units, and time range clear?</li>
          <li>Does color have a defined meaning?</li>
          <li>Can the result be understood without color or hover?</li>
          <li>Can users inspect the underlying data?</li>
          <li>Does the visualization remain legible in light and dark mode?</li>
          <li>Is every visible element necessary?</li>
        </ol>
      </Section>

      <Section title="Prohibited">
        <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>Choosing a chart before identifying the question</li>
          <li>Using a chart when a table is clearer</li>
          <li>Three-dimensional charts, decorative gradients, glows</li>
          <li>Rainbow scales for ordered data</li>
          <li>Semantic status colors for neutral categories</li>
          <li>More simultaneous series than users can distinguish</li>
          <li>Essential values hidden behind hover only</li>
          <li>Unlabeled dual axes; truncated axes</li>
          <li>Sorting time alphabetically</li>
          <li>Treating missing values as zero without justification</li>
          <li>Continuous animation unrelated to an active process</li>
        </ul>
      </Section>

      <DataVizLiveExamples />
    </>
  )
}

// ─── Data Viz live examples ───────────────────────────────────────────────────

function DemoChart({ widget, data, height = 180, caption }: {
  widget: Widget; data: ChartData; height?: number; caption?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="px-3 pt-3 pb-1">
        <p className="text-xs font-medium text-foreground truncate">{widget.title}</p>
      </div>
      <div style={{ height }} className="px-1 pb-2">
        <ChartRenderer widget={widget} data={data} height={height} />
      </div>
      {caption && (
        <div className="px-3 py-2 border-t border-border/60 bg-muted/30">
          <p className="text-xs text-muted-foreground">{caption}</p>
        </div>
      )}
    </div>
  )
}

function w(overrides: Partial<Widget> & { id: string; type: Widget['type']; title: string }): Widget {
  return { audienceId: 'all', metric: 'brand_awareness', createdAt: '', ...overrides }
}

function DataVizLiveExamples() {
  // ── Categorical palette — 8 series, one bar per token ──
  const paletteWidget = w({ id: 'dv-palette', type: 'bar', title: 'Categorical palette — 8 color tokens' })
  const paletteData: ChartData = {
    labels: ['Brand blue', 'Violet', 'Cyan', 'Orange', 'Fuchsia', 'Teal', 'Indigo', 'Lime'],
    series: [{ name: 'Value', values: [72, 65, 58, 61, 54, 67, 70, 56] }],
  }

  // ── Chart types grid ──
  const barWidget   = w({ id: 'dv-bar',   type: 'bar',       title: 'Purchase intent by age group', metric: 'purchase_intent', breakdown: 'age_group' })
  const barData: ChartData = {
    labels: ['18–24', '25–34', '35–44', '45–54', '55+'],
    series: [
      { name: 'Millennial Shoppers', values: [58, 74, 61, 42, 27] },
      { name: 'Market average',      values: [44, 55, 48, 36, 28] },
    ],
  }

  const lineWidget  = w({ id: 'dv-line',  type: 'line',      title: 'Brand awareness — Jan → Jun 2025' })
  const lineData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [{ name: 'Awareness %', values: [41, 44, 48, 51, 54, 57] }],
  }

  const pieWidget   = w({ id: 'dv-pie',   type: 'pie',       title: 'Device type distribution' })
  const pieData: ChartData = {
    labels: ['Mobile', 'Desktop', 'Tablet', 'Smart TV'],
    series: [{ name: 'Share', values: [54, 28, 11, 7] }],
  }

  const kpiWidget   = w({ id: 'dv-kpi',   type: 'scorecard', title: 'Net Promoter Score', benchmarkAudienceId: 'bench' })
  const kpiData: ChartData = {
    labels: ['NPS'],
    series: [
      { name: 'Millennial Shoppers', values: [48] },
      { name: 'Market average',      values: [32] },
    ],
  }

  // ── Color roles ──
  // Primary: one series highlighted, others muted
  const highlightWidget = w({ id: 'dv-hl', type: 'bar', title: 'Selected series highlighted' })
  const highlightData: ChartData = {
    labels: ['18–24', '25–34', '35–44', '45–54', '55+'],
    series: [
      { name: 'Audience', values: [58, 74, 61, 42, 27] },
      { name: 'Benchmark (muted)', values: [44, 55, 48, 36, 28] },
    ],
  }

  // Semantic: NPS band breakdown — emerald / amber / red via intent
  const semanticWidget = w({ id: 'dv-semantic', type: 'bar', title: 'NPS band distribution', metric: 'net_promoter_score' })
  const semanticData: ChartData = {
    labels: ['Promoters (9–10)', 'Passives (7–8)', 'Detractors (0–6)'],
    series: [{ name: 'Respondents %', values: [38, 29, 33] }],
  }

  // Sequential: single series, ordered magnitude
  const seqWidget = w({ id: 'dv-seq', type: 'bar', title: 'Online spend by income bracket', breakdown: 'income_bracket' })
  const seqData: ChartData = {
    labels: ['<$25k', '$25–50k', '$50–100k', '$100k+'],
    series: [{ name: 'Monthly avg. spend ($)', values: [38, 72, 124, 218] }],
  }

  // ── Anti-patterns ──
  const tooManySlicesWidget = w({ id: 'dv-pie-bad', type: 'pie', title: 'Avoid: pie with 8 categories' })
  const tooManySlicesData: ChartData = {
    labels: ['Mobile', 'Desktop', 'Tablet', 'Smart TV', 'Console', 'Wearable', 'OOH', 'Other'],
    series: [{ name: 'Share', values: [28, 22, 10, 8, 12, 6, 7, 7] }],
  }

  return (
    <>
      <Section title="Live examples — categorical palette">
        <p className="text-xs text-muted-foreground mb-4">
          8-hue palette applied to a single bar chart. The same category always maps to the same token across views.
        </p>
        <DemoChart widget={paletteWidget} data={paletteData} height={200}
          caption="chart-1 → chart-8 tokens. Assign by stable category order, not by data rank." />
      </Section>

      <Section title="Live examples — chart types">
        <p className="text-xs text-muted-foreground mb-4">
          Four main chart types with realistic consumer survey data. Choose based on the analytical question, not aesthetics.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <DemoChart widget={barWidget} data={barData} height={180}
            caption="Bar — compare categories. Use when ranking or discrete comparison is the goal." />
          <DemoChart widget={lineWidget} data={lineData} height={180}
            caption="Line — time series and ordered trends. Always chronological left→right." />
          <DemoChart widget={pieWidget} data={pieData} height={180}
            caption="Pie — approximate proportion, ≤5 slices, one meaningful whole." />
          <DemoChart widget={kpiWidget} data={kpiData} height={180}
            caption="Scorecard — single value with benchmark delta. One KPI per card." />
        </div>
      </Section>

      <Section title="Live examples — color roles">
        <p className="text-xs text-muted-foreground mb-4">
          Three distinct color roles: primary selection (brand blue), sequential magnitude, and semantic status.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <DemoChart widget={highlightWidget} data={highlightData} height={160}
            caption="Primary — audience series in brand blue; benchmark muted." />
          <DemoChart widget={seqWidget} data={seqData} height={160}
            caption="Sequential — single hue, ordered by magnitude. No rainbow scale." />
          <DemoChart widget={semanticWidget} data={semanticData} height={160}
            caption="Semantic — emerald/amber/red only when data genuinely maps to success/warning/danger." />
        </div>
      </Section>

      <Section title="Live examples — anti-patterns">
        <p className="text-xs text-muted-foreground mb-4">
          Examples of what not to do, and why.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="rounded-md border-2 border-destructive/30 overflow-hidden">
              <DemoChart widget={tooManySlicesWidget} data={tooManySlicesData} height={160} />
            </div>
            <p className="text-xs text-destructive mt-1.5">Avoid: 8 pie slices — impossible to compare. Use a bar chart instead.</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 flex flex-col justify-center gap-3">
            <p className="text-xs font-medium text-foreground">Other patterns to avoid</p>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>3D bars or glows on chart elements</li>
              <li>Gradient fills on bars or lines (decorative)</li>
              <li>Dual Y-axes without clear labeling</li>
              <li>Truncated Y-axis starting above zero on a bar chart</li>
              <li>Rainbow hue scale for ordered magnitude</li>
              <li>Green/red encoding on non-semantic data</li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  )
}

function ElevSurface({ label, style, description, code }: { label: string; style: React.CSSProperties; description: string; code: string }) {
  return (
    <div className="flex items-start gap-5">
      <div className="shrink-0 w-20 h-14 rounded-lg bg-background" style={style} />
      <div className="min-w-0 pt-1">
        <p className="text-xs font-medium text-foreground mb-0.5">{label}</p>
        <code className="block text-xs font-mono text-foreground mb-1 whitespace-pre-wrap leading-relaxed">{code}</code>
        <p className="text-xs text-foreground">{description}</p>
      </div>
    </div>
  )
}

function ElevationPage() {
  return (
    <>
      <PageHeader title="Elevation" description="Controlled strokes, compact shadows, and inset highlights. Crisp and dimensional — not flat, not fluffy." />

      <Section title="Surface anatomy">
        <p className="text-sm text-foreground mb-4">A raised component may use up to three visual layers. Not every component needs all three.</p>
        <div className="rounded-xl border border-border overflow-hidden mb-4 pb-px">
          <div className="grid grid-cols-[28px_160px_1fr] gap-3 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>#</span><span>Layer</span><span>Purpose</span>
          </div>
          {[
            { n: '1', layer: '1px perimeter stroke', desc: 'Defines the component edge' },
            { n: '2', layer: 'Inset upper-edge highlight', desc: 'Communicates that the surface is raised' },
            { n: '3', layer: 'Compact external shadow', desc: 'Conveys elevation — distance from the page surface' },
          ].map(({ n, layer, desc }) => (
            <div key={n} className="grid grid-cols-[28px_160px_1fr] gap-3 px-4 py-2.5 border-b border-border/40 last:border-0 items-center">
              <span className="text-xs text-muted-foreground tabular-nums">{n}</span>
              <span className="text-xs text-foreground">{layer}</span>
              <span className="text-xs text-foreground">{desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground">Do not add additional visual layers without a clear purpose. A component is not elevated simply because it has a background or border radius.</p>
      </Section>

      <Section title="Surface treatments">
        <div className="space-y-6">
          <ElevSurface
            label="Default structural surface"
            style={{ border: '1px solid var(--border)' }}
            description="Cards, panels, tables, chart containers, sidebar sections, form groups. No external shadow."
            code={`border: 1px solid var(--border);\nbox-shadow: none;`}
          />
          <ElevSurface
            label="Raised control (resting)"
            style={{
              border: '1px solid var(--border)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 1px rgba(0,0,0,0.10), 0 2px 3px -1px rgba(0,0,0,0.08)',
            }}
            description="Buttons and compact raised controls. Top-edge highlight visible only on inspection — not glossy."
            code={`border: 1px solid var(--border-control);\nbox-shadow:\n  inset 0 1px 0 var(--edge-highlight),\n  0 1px 1px rgb(0 0 0 / 0.1),\n  0 2px 3px -1px rgb(0 0 0 / 0.08);`}
          />
          <ElevSurface
            label="Raised control (hover)"
            style={{
              border: '1px solid var(--border)',
              transform: 'translateY(-1px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.10), 0 3px 5px -2px rgba(0,0,0,0.10)',
            }}
            description="Slight lift. Move no more than 1px. No large blur, no glow, no border-width change."
            code={`transform: translateY(-1px);\nbox-shadow:\n  inset 0 1px 0 var(--edge-highlight),\n  0 1px 2px rgb(0 0 0 / 0.1),\n  0 3px 5px -2px rgb(0 0 0 / 0.1);`}
          />
          <ElevSurface
            label="Raised control (pressed)"
            style={{
              border: '1px solid var(--border)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.10), 0 1px 0 rgba(0,0,0,0.04)',
            }}
            description="Appears closer to the surface. Reduces external shadow, adds restrained inset depth."
            code={`transform: translateY(0);\nbox-shadow:\n  inset 0 1px 2px rgb(0 0 0 / 0.1),\n  0 1px 0 rgb(0 0 0 / 0.04);`}
          />
          <ElevSurface
            label="Selected control"
            style={{
              border: '1px solid var(--border)',
              boxShadow: 'inset 0 0 0 1px var(--border)',
            }}
            description="Tabs, segments, options. Inset stroke communicates selection without affecting layout. Not the same as pressed."
            code={`box-shadow: inset 0 0 0 1px var(--border-control);`}
          />
          <ElevSurface
            label="Floating surface"
            style={{
              border: '1px solid var(--border)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 6px 14px -4px rgba(0,0,0,0.14)',
            }}
            description="Dropdowns, popovers, menus, autocomplete. Two layers: contact shadow + limited ambient separation."
            code={`border: 1px solid var(--border-subtle);\nbox-shadow:\n  0 1px 2px rgb(0 0 0 / 0.08),\n  0 6px 14px -4px rgb(0 0 0 / 0.14);`}
          />
          <ElevSurface
            label="Large overlay"
            style={{
              border: '1px solid var(--border)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 10px 24px -8px rgba(0,0,0,0.18)',
            }}
            description="Dialogs. Slightly broader shadow, still crisp. Relies on backdrop for hierarchy — shadow does not carry it alone."
            code={`border: 1px solid var(--border-subtle);\nbox-shadow:\n  0 2px 4px rgb(0 0 0 / 0.08),\n  0 10px 24px -8px rgb(0 0 0 / 0.18);`}
          />
        </div>
      </Section>

      <Section title="Component defaults">
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[140px_100px_130px_1fr] gap-3 text-xs font-medium text-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Component</span><span>Stroke</span><span>Inset</span><span>External shadow</span>
          </div>
          {[
            { comp: 'Standard card',    stroke: 'Subtle',          inset: 'None',             shadow: 'None' },
            { comp: 'Static panel',     stroke: 'Subtle',          inset: 'None',             shadow: 'None' },
            { comp: 'Input',            stroke: 'Default',         inset: 'None',             shadow: 'None' },
            { comp: 'Raised button',    stroke: 'Default',         inset: 'Upper-edge highlight', shadow: 'Compact' },
            { comp: 'Ghost button',     stroke: 'Optional subtle', inset: 'None',             shadow: 'None' },
            { comp: 'Pressed button',   stroke: 'Default',         inset: 'Inset depth',      shadow: 'Minimal' },
            { comp: 'Selected segment', stroke: 'Optional',        inset: 'Inset stroke',     shadow: 'None or minimal' },
            { comp: 'Dropdown menu',    stroke: 'Subtle',          inset: 'None',             shadow: 'Floating' },
            { comp: 'Popover',          stroke: 'Subtle',          inset: 'None',             shadow: 'Floating' },
            { comp: 'Dialog',           stroke: 'Subtle',          inset: 'None',             shadow: 'Overlay' },
            { comp: 'Sticky header',    stroke: 'Separator',       inset: 'None',             shadow: 'None or 1px contact' },
          ].map(({ comp, stroke, inset, shadow }) => (
            <div key={comp} className="grid grid-cols-[140px_100px_130px_1fr] gap-3 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors py-3">
              <span className="text-xs text-foreground">{comp}</span>
              <span className="text-xs text-foreground">{stroke}</span>
              <span className="text-xs text-foreground">{inset}</span>
              <span className="text-xs text-foreground">{shadow}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Decision rule">
        <div className="grid grid-cols-2 gap-3">
          {[
            { trigger: 'Component needs a clear edge',           treatment: 'Stroke' },
            { trigger: 'Control should feel subtly raised',      treatment: 'Upper-edge inset highlight' },
            { trigger: 'Component overlaps another surface',     treatment: 'External shadow' },
            { trigger: 'Control is actively pressed or recessed', treatment: 'Inset depth shadow' },
            { trigger: 'None of the above apply',                treatment: 'Keep flat' },
          ].map(({ trigger, treatment }) => (
            <div key={trigger} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="flex-1">
                <p className="text-xs text-foreground">If: {trigger}</p>
                <p className="text-xs font-medium text-foreground mt-0.5">→ {treatment}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Prohibited">
        <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>Shadows on every card</li>
          <li>Large soft shadows below small controls</li>
          <li>Inner depth shadows on resting cards</li>
          <li>Glossy button highlights</li>
          <li>Multiple visible perimeter strokes</li>
          <li>Combining strong border + strong inset shadow + strong external shadow</li>
          <li>Using pressed treatment to indicate selection (unless the control is a toggle)</li>
          <li>Adding elevation purely because a component is "important"</li>
          <li>Using shadow as a substitute for grouping, spacing, or hierarchy</li>
          <li>Arbitrary component-specific shadow values</li>
        </ul>
      </Section>

      <Section title="Shadow limits">
        <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>No more than two external shadow layers per component</li>
          <li>Keep vertical offset small and downward-biased</li>
          <li>Control blur ≤ ~5px; menu/popover blur ≤ ~16px</li>
          <li>Avoid shadows that extend significantly above or to the sides of a component</li>
          <li>Avoid large negative spread values to manufacture dramatic floating effects</li>
        </ul>
      </Section>
    </>
  )
}

// ─── ButtonPage ───────────────────────────────────────────────────────────────

function ButtonPage() {
  const ic = (Icon: React.ElementType) => <Icon strokeWidth={2} />

  return (
    <>
      <PageHeader
        title="Button"
        description="Two-axis system: hierarchy (filled / outlined / flat / inline) × intent (brand / neutral / danger / success)."
      />

      {/* ── API reference ── */}
      <Section title="API">
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 space-y-1">
          <code className="block text-xs font-mono text-foreground">{'<Button variant="primary|secondary|ghost|link[-neutral|-danger|-success]"'}</code>
          <code className="block text-xs font-mono text-foreground">{'        size="xs|sm|default|lg|icon|icon-xs|icon-sm|icon-lg" />'}</code>
          <p className="text-xs text-muted-foreground mt-2">Legacy aliases still accepted: <code className="font-mono">default</code> → primary, <code className="font-mono">outline</code> → secondary, <code className="font-mono">destructive</code> → secondary-danger.</p>
        </div>
      </Section>

      {/* ── Hierarchy × Intent grid ── */}
      <Section title="Hierarchy × intent">
        {/* Header */}
        <div className="grid grid-cols-[90px_1fr_1fr_1fr_1fr] gap-3 mb-2 px-1">
          <span />
          {['Brand', 'Neutral', 'Danger', 'Success'].map(h => (
            <span key={h} className="text-xs text-secondary-foreground">{h}</span>
          ))}
        </div>

        {/* Primary row */}
        <div className="grid grid-cols-[90px_1fr_1fr_1fr_1fr] gap-3 items-center py-3 border-t border-border/40">
          <div>
            <p className="text-xs font-medium text-foreground">Primary</p>
            <p className="text-xs text-secondary-foreground">Filled, raised</p>
          </div>
          <Button variant="primary">Save</Button>
          <Button variant="primary-neutral">Export</Button>
          <Button variant="primary-danger">{ic(IconTrash)} Delete</Button>
          <Button variant="primary-success">{ic(IconCheck)} Publish</Button>
        </div>

        {/* Secondary row */}
        <div className="grid grid-cols-[90px_1fr_1fr_1fr_1fr] gap-3 items-center py-3 border-t border-border/40">
          <div>
            <p className="text-xs font-medium text-foreground">Secondary</p>
            <p className="text-xs text-secondary-foreground">Outlined, raised</p>
          </div>
          <Button variant="secondary-brand">Share</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="secondary-danger">{ic(IconTrash)} Remove</Button>
          <Button variant="secondary-success">{ic(IconCheck)} Approve</Button>
        </div>

        {/* Ghost row */}
        <div className="grid grid-cols-[90px_1fr_1fr_1fr_1fr] gap-3 items-center py-3 border-t border-border/40">
          <div>
            <p className="text-xs font-medium text-foreground">Ghost</p>
            <p className="text-xs text-secondary-foreground">Flat, no border</p>
          </div>
          <Button variant="ghost-brand">View more</Button>
          <Button variant="ghost">Dismiss</Button>
          <Button variant="ghost-danger">{ic(IconTrash)} Clear</Button>
          <Button variant="ghost-success">{ic(IconCheck)} Mark done</Button>
        </div>

        {/* Link row */}
        <div className="grid grid-cols-[90px_1fr_1fr_1fr_1fr] gap-3 items-center py-3 border-t border-border/40">
          <div>
            <p className="text-xs font-medium text-foreground">Link</p>
            <p className="text-xs text-secondary-foreground">Inline, no padding</p>
          </div>
          <Button variant="link">Learn more</Button>
          <Button variant="link-neutral">Details</Button>
          <Button variant="link-danger">Remove</Button>
          <Button variant="link-success">Confirm</Button>
        </div>
      </Section>

      {/* ── Icon positions ── */}
      <Section title="Icon positions">
        <div className="grid grid-cols-[90px_1fr_1fr_1fr_1fr] gap-4 mb-2 px-1">
          <span />
          {['No icon', 'Leading', 'Trailing', 'Icon only'].map(h => (
            <span key={h} className="text-xs text-secondary-foreground">{h}</span>
          ))}
        </div>

        {(
          [
            { v: 'primary',         label: 'Primary'     },
            { v: 'secondary',       label: 'Secondary'   },
            { v: 'ghost',           label: 'Ghost'       },
            { v: 'secondary-danger', label: 'Sec-danger' },
            { v: 'primary-success', label: 'Pri-success' },
          ] as const
        ).map(({ v, label }) => (
          <div key={v} className="grid grid-cols-[90px_1fr_1fr_1fr_1fr] gap-4 items-center py-2 border-t border-border/40 first:border-0">
            <span className="text-xs text-foreground">{label}</span>
            <Button variant={v}>{label}</Button>
            <Button variant={v}>{ic(IconPlus)}{label}</Button>
            <Button variant={v}>{label}{ic(IconArrowRight)}</Button>
            <Button variant={v} size="icon">{ic(IconPlus)}</Button>
          </div>
        ))}
      </Section>

      {/* ── Sizes ── */}
      <Section title="Sizes">
        <div className="grid grid-cols-[70px_55px_1fr_1fr_1fr_1fr] gap-4 mb-2 px-1">
          <span className="text-xs text-secondary-foreground">Size</span>
          <span className="text-xs text-secondary-foreground">h</span>
          <span className="text-xs text-secondary-foreground">Primary</span>
          <span className="text-xs text-secondary-foreground">Secondary</span>
          <span className="text-xs text-secondary-foreground">Ghost</span>
          <span className="text-xs text-secondary-foreground">With icon</span>
        </div>

        {([
          { k: 'xs',      h: '24px' },
          { k: 'sm',      h: '28px' },
          { k: 'default', h: '32px' },
          { k: 'lg',      h: '36px' },
        ] as const).map(({ k, h }) => (
          <div key={k} className="grid grid-cols-[70px_55px_1fr_1fr_1fr_1fr] gap-4 items-center py-2.5 border-t border-border/40">
            <code className="text-xs font-mono text-foreground">{k}</code>
            <span className="text-xs tabular-nums text-muted-foreground">{h}</span>
            <Button variant="primary" size={k}>Button</Button>
            <Button variant="secondary" size={k}>Button</Button>
            <Button variant="ghost" size={k}>Button</Button>
            <Button variant="primary" size={k}>{ic(IconDownload)} Export</Button>
          </div>
        ))}

        <p className="text-xs text-muted-foreground mt-4 mb-2">Icon-only sizes</p>
        <div className="flex items-end gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <Button variant="secondary" size="icon-xs"><IconPlus size={12} strokeWidth={2} /></Button>
            <span className="text-xs text-muted-foreground">icon-xs</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Button variant="secondary" size="icon-sm"><IconPlus size={14} strokeWidth={2} /></Button>
            <span className="text-xs text-muted-foreground">icon-sm</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Button variant="secondary" size="icon"><IconPlus size={16} strokeWidth={2} /></Button>
            <span className="text-xs text-muted-foreground">icon</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Button variant="secondary" size="icon-lg"><IconPlus size={18} strokeWidth={2} /></Button>
            <span className="text-xs text-muted-foreground">icon-lg</span>
          </div>
        </div>
      </Section>

      {/* ── States ── */}
      <Section title="States">
        <div className="space-y-5">
          {(
            [
              { v: 'primary',   label: 'Primary'   },
              { v: 'secondary', label: 'Secondary'  },
              { v: 'ghost',     label: 'Ghost'      },
            ] as const
          ).map(({ v, label }) => (
            <div key={v}>
              <p className="text-xs text-secondary-foreground mb-3">{label}</p>
              <div className="flex items-end gap-6 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <Button variant={v}>Action</Button>
                  <span className="text-xs text-muted-foreground">Rest</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button variant={v} disabled>Action</Button>
                  <span className="text-xs text-muted-foreground">Disabled</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button variant={v}><IconLoader2 strokeWidth={2} className="animate-spin" /> Loading…</Button>
                  <span className="text-xs text-muted-foreground">Loading</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Real-world combos ── */}
      <Section title="Real-world combinations">
        <div className="space-y-4">

          <div>
            <p className="text-xs text-muted-foreground mb-2">Toolbar — mixed hierarchy</p>
            <div className="flex items-center gap-2 px-4 h-14 border border-border rounded-lg bg-background">
              <div className="flex flex-col min-w-0 mr-auto">
                <span className="text-xs text-muted-foreground leading-none mb-0.5">Characteristics</span>
                <span className="text-sm font-semibold text-foreground">Country of residence</span>
              </div>
              <Button variant="ghost">{ic(IconShare)} Share</Button>
              <Button variant="secondary">{ic(IconDownload)} Export</Button>
              <Button variant="primary">{ic(IconPlus)} Add to dashboard</Button>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Confirm dialog</p>
            <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg bg-background w-fit">
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">{ic(IconCheck)} Confirm</Button>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Destructive — soft trigger → bold confirm</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg bg-background w-fit">
                <Button variant="ghost">Cancel</Button>
                <Button variant="secondary-danger">{ic(IconTrash)} Delete</Button>
              </div>
              <span className="text-xs text-muted-foreground">→ opens confirm →</span>
              <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg bg-background w-fit">
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary-danger">{ic(IconTrash)} Delete permanently</Button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Success action</p>
            <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg bg-background w-fit">
              <Button variant="ghost">Back</Button>
              <Button variant="primary-success">{ic(IconCheck)} Publish dashboard</Button>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Inline link in body text</p>
            <p className="text-sm text-foreground">
              This analysis is read-only. <Button variant="link">Request edit access</Button> or <Button variant="link-neutral">view history</Button>.
            </p>
          </div>

        </div>
      </Section>

      {/* ── Rules ── */}
      <Section title="Rules">
        <ul className="text-sm text-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>Typography: <code className="font-mono text-xs">text-sm font-medium</code> (14px / 500). No <code className="font-mono text-xs">font-bold</code>, no uppercase.</li>
          <li>Icons: Tabler only, <code className="font-mono text-xs">strokeWidth=&#123;2&#125;</code>, ~14px. Leading = semantic action; trailing = directional.</li>
          <li>Colors: semantic tokens only. Exception: <code className="font-mono text-xs">emerald-600</code> for success pending a <code className="font-mono text-xs">--success</code> token.</li>
          <li>Elevation: primary + secondary use three-layer raised shadow. Ghost + link stay flat.</li>
          <li>Hover: <code className="font-mono text-xs">translateY(-1px)</code> — never more than 1px. No glow, no border-width change.</li>
          <li>Destructive flows: secondary-danger (soft) → primary-danger (final confirm).</li>
          <li>One primary per view. Secondary for supporting. Ghost for tertiary/toolbar. Link for inline navigation.</li>
        </ul>
      </Section>
    </>
  )
}

function BadgePage() {
  return (
    <>
      <PageHeader title="Badge" description="Inline labels for status, type, and metadata." />

      <Section title="Variants">
        <Row label="Default">
          <Badge>Default</Badge>
          <Badge className="bg-primary/10 text-primary border-0">Shared</Badge>
        </Row>
        <Row label="Secondary">
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="secondary" className="text-xs font-normal">Germany</Badge>
        </Row>
        <Row label="Destructive">
          <Badge variant="destructive">Deleted</Badge>
        </Row>
      </Section>

      <Section title="Chart-type badges">
        <Row label="Type colours">
          <Badge className="bg-blue-50 text-blue-600 border-0">bar</Badge>
          <Badge className="bg-emerald-50 text-emerald-700 border-0">line</Badge>
          <Badge className="bg-purple-50 text-purple-600 border-0">pie</Badge>
          <Badge className="bg-orange-50 text-orange-600 border-0">table</Badge>
          <Badge className="bg-amber-50 text-amber-600 border-0">scorecard</Badge>
        </Row>
      </Section>
    </>
  )
}

function FormPage() {
  const [radio, setRadio] = useState('weekly')
  const [search, setSearch] = useState('')
  const [sel, setSel] = useState('')
  const [selGrouped, setSelGrouped] = useState('')

  return (
    <>
      <PageHeader title="Form" description="Input · Textarea · Select · Checkbox · Radio" />

      {/* ── Text input ── */}
      <Section title="Text input">
        <Row label="Sizes">
          <Input size="sm"      placeholder="Small"   className="w-36" />
          <Input size="default" placeholder="Default" className="w-40" />
          <Input size="lg"      placeholder="Large"   className="w-44" />
        </Row>
        <Row label="States">
          <Input placeholder="Default"           className="w-40" />
          <Input placeholder="Error"   state="error"   className="w-40" />
          <Input placeholder="Success" state="success" className="w-40" />
        </Row>
        <Row label="Decorations">
          <Input placeholder="With prefix"  prefix="https://" className="w-48" />
          <Input placeholder="With suffix"  suffix=".com"      className="w-40" />
        </Row>
        <Row label="Search">
          <Input type="search" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="w-48" />
        </Row>
        <Row label="With FormField">
          <Input
            label="Email address"
            helper="We'll never share your email."
            placeholder="you@example.com"
            className="w-64"
          />
          <Input
            label="Username"
            error="Username is already taken"
            placeholder="handle"
            className="w-56"
          />
        </Row>
      </Section>

      {/* ── Textarea ── */}
      <Section title="Textarea">
        <Row label="Sizes">
          <Textarea size="sm"      placeholder="Small textarea"   className="w-64" />
          <Textarea size="default" placeholder="Default textarea" className="w-64" />
        </Row>
        <Row label="States">
          <Textarea placeholder="Error state"   state="error"   className="w-64" />
          <Textarea placeholder="Success state" state="success" className="w-64" />
        </Row>
        <Row label="With FormField">
          <Textarea
            label="Description"
            helper="Max 500 characters."
            placeholder="Describe your audience segment…"
            className="w-72"
          />
        </Row>
      </Section>

      {/* ── Select ── */}
      <Section title="Select">
        <Row label="Sizes">
          <SelectField
            size="sm"
            value={sel}
            onChange={setSel}
            options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]}
            placeholder="Small"
            className="w-36"
          />
          <SelectField
            size="default"
            value={sel}
            onChange={setSel}
            options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]}
            placeholder="Default"
            className="w-40"
          />
          <SelectField
            size="lg"
            value={sel}
            onChange={setSel}
            options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]}
            placeholder="Large"
            className="w-44"
          />
        </Row>
        <Row label="States">
          <SelectField
            value={sel} onChange={setSel}
            options={[{ value: 'a', label: 'Option A' }]}
            placeholder="Error state"
            state="error"
            className="w-40"
          />
          <SelectField
            value={sel} onChange={setSel}
            options={[{ value: 'a', label: 'Option A' }]}
            placeholder="Success state"
            state="success"
            className="w-40"
          />
        </Row>
        <Row label="Grouped">
          <SelectField
            value={selGrouped}
            onChange={setSelGrouped}
            options={[
              { group: 'Demographics', items: [{ value: 'age', label: 'Age' }, { value: 'gender', label: 'Gender' }] },
              { group: 'Behavior', items: [{ value: 'purchase', label: 'Purchase intent' }, { value: 'usage', label: 'Usage frequency' }] },
            ]}
            placeholder="Select dimension…"
            label="Dimension"
            className="w-56"
          />
        </Row>
      </Section>

      {/* ── Checkbox ── */}
      <Section title="Checkbox">
        <Row label="Sizes">
          <Checkbox size="sm"      defaultChecked label="Small"   />
          <Checkbox size="default" defaultChecked label="Default" />
        </Row>
        <Row label="States">
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked"       defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled"      disabled />
          <Checkbox label="Disabled + checked" disabled defaultChecked />
        </Row>
        <Row label="With description">
          <Checkbox
            defaultChecked
            label="Send weekly digest"
            description="Receive a summary of your audience insights every Monday."
          />
        </Row>
      </Section>

      {/* ── Radio ── */}
      <Section title="Radio">
        <Row label="RadioGroup">
          <RadioGroup name="frequency" value={radio} onChange={setRadio}>
            <Radio value="daily"   label="Daily"   description="Every day at 9am" />
            <Radio value="weekly"  label="Weekly"  description="Every Monday morning" />
            <Radio value="monthly" label="Monthly" description="First day of the month" />
            <Radio value="never"   label="Never"   disabled />
          </RadioGroup>
        </Row>
        <Row label="Sizes">
          <RadioGroup name="size-sm" size="sm">
            <Radio value="a" label="Small A" defaultChecked />
            <Radio value="b" label="Small B" />
          </RadioGroup>
        </Row>
      </Section>

      {/* ── Field patterns ── */}
      <Section title="Field patterns" hint="FormField wrapper">
        <Row label="Full form">
          <div className="flex flex-col gap-4 w-72">
            <Input
              label="Full name"
              placeholder="Jane Doe"
            />
            <Textarea
              label="Bio"
              helper="Briefly describe this segment."
              placeholder="Describe…"
            />
            <SelectField
              label="Primary market"
              placeholder="Select country…"
              options={[
                { value: 'de', label: 'Germany' },
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
              ]}
            />
            <div className="flex flex-col gap-2">
              <Checkbox label="Agree to terms" />
              <Checkbox label="Subscribe to newsletter" defaultChecked />
            </div>
          </div>
        </Row>
      </Section>
    </>
  )
}

function ChipPage() {
  const [removed, setRemoved] = useState(false)

  return (
    <>
      <PageHeader title="Chip" description="app/Chip.tsx — filter tags with optional remove and onClick." />

      <Section title="Variants">
        <Row label="default">
          <Chip label="Country of residence" />
          <Chip label="Removable" onRemove={() => {}} />
        </Row>
        <Row label="primary">
          <Chip label="Gender" variant="primary" />
          <Chip label="Age distribution" variant="primary" onRemove={() => {}} />
        </Row>
        <Row label="suggestion">
          <Chip label="Males 25–40" variant="suggestion" onClick={() => {}} />
          <Chip label="Germany" variant="suggestion" onClick={() => {}} />
        </Row>
      </Section>

      <Section title="Live demo">
        {!removed
          ? <Row label="Remove me">
              <Chip label="Click × to remove" onRemove={() => setRemoved(true)} />
            </Row>
          : <p className="text-xs text-green-700 font-medium">✓ Chip removed</p>
        }
      </Section>
    </>
  )
}

function CardPage() {
  return (
    <>
      <PageHeader title="Card" description="ResourceCard — unified base component used across all resource lists." />

      <Section title="ResourceCard variants">
        <Row label="With actions">
          <div className="w-full max-w-lg">
            <ResourceCard
              icon={<LayoutDashboard />}
              title="Q1 Audience Overview"
              meta="3 widgets"
              date="Updated 3/15/2025"
              actions={
                <>
                  <IconBtn icon={<Pencil className="h-3 w-3" />} label="Edit" onClick={() => {}} />
                  <IconBtn icon={<Trash2 className="h-3 w-3" />} label="Delete" destructive onClick={() => {}} />
                </>
              }
              onClick={() => {}}
            />
          </div>
        </Row>
        <Row label="Analysis">
          <div className="w-full max-w-lg">
            <ResourceCard
              icon={<FileText />}
              title="Q1 Audience Overview — Summary"
              meta="3 sections · Q1 Audience Overview"
              date="3/15/2025"
              actions={
                <>
                  <IconBtn icon={<ChevronRight className="h-3 w-3" />} label="Open" onClick={() => {}} />
                  <IconBtn icon={<Trash2 className="h-3 w-3" />} label="Delete" destructive onClick={() => {}} />
                </>
              }
              onClick={() => {}}
            />
          </div>
        </Row>
        <Row label="No actions">
          <div className="w-full max-w-lg">
            <ResourceCard
              icon={<Users />}
              title="Millennials 25–34 DE"
              meta="Germany · 2.4M universe"
              date="Created 1/3/2025"
              onClick={() => {}}
            />
          </div>
        </Row>
      </Section>

      <Section title="Historical row patterns" hint="Pre-ResourceCard — kept for reference">
        <Row label="Audience row">
          <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden px-3">
            <AudienceStyleRow />
          </div>
        </Row>
        <Row label="Dashboard row">
          <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden px-3">
            <DashboardStyleRow />
          </div>
        </Row>
        <Row label="Widget drag row">
          <div className="w-64 border border-border rounded-lg overflow-hidden">
            <WidgetDragRow />
          </div>
        </Row>
      </Section>
    </>
  )
}

function EmptyStatePage() {
  return (
    <>
      <PageHeader title="Empty State" description="EmptyState.tsx — one component, consistent across all empty lists." />

      <Section title="With CTA">
        <div className="border border-border rounded-lg overflow-hidden max-w-lg">
          <EmptyState
            title="No dashboards yet"
            description="Create your first dashboard by combining widgets onto a shared canvas."
            ctaLabel="Create a dashboard"
            onCta={() => {}}
          />
        </div>
      </Section>

      <Section title="Without CTA">
        <div className="border border-border rounded-lg overflow-hidden max-w-lg">
          <EmptyState
            title="No analyses yet"
            description="Generate a narrative report from any dashboard linked to this project."
          />
        </div>
      </Section>
    </>
  )
}

function SwitcherPage() {
  return (
    <>
      <PageHeader
        title="Switcher"
        description="ThemeToggle.tsx — segmented 3-state picker for system / light / dark. Used in the sidebar."
      />

      <Section title="Expanded (sidebar context)">
        <div className="flex gap-6 items-start">
          <div>
            <p className="text-xs text-muted-foreground mb-2">In sidebar</p>
            <div className="w-44 bg-sidebar rounded-lg border border-sidebar-border overflow-hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Collapsed (sidebar icon mode)">
        <div className="flex gap-6 items-center">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Icon only — cycles system → light → dark</p>
            <div className="w-12 bg-sidebar rounded-lg border border-sidebar-border overflow-hidden flex flex-col items-center py-1">
              <ThemeToggle collapsed />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

function LayoutPage() {
  return (
    <>
      <PageHeader title="Layout" description="App shell, toolbars, sidebars, panels — the structural skeleton." />

      {/* ── App shell ── */}
      <Section title="App shell">
        {/* Full shell replica at reduced scale */}
        <div
          className="w-full rounded-lg border border-border overflow-hidden bg-sidebar"
          style={{ height: 360, boxShadow: '0 1px 2px rgb(0 0 0 / 0.08), 0 6px 14px -4px rgb(0 0 0 / 0.14)' }}
        >
          <div className="flex h-full">
            {/* Left nav sidebar */}
            <div className="w-14 shrink-0 flex flex-col border-r border-sidebar-border bg-sidebar">
              {/* Header */}
              <div className="h-14 flex items-center justify-center border-b border-sidebar-border shrink-0">
                <div className="w-5 h-5 rounded bg-foreground/10" />
              </div>
              {/* Nav items */}
              <div className="flex-1 px-1.5 pt-3 flex flex-col gap-0.5">
                {[true, false, false, false, false].map((active, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-md mx-auto',
                      active ? 'bg-white text-foreground shadow-sm' : 'text-sidebar-foreground hover:bg-white/70'
                    )}
                  >
                    <div className={cn('w-3.5 h-3.5 rounded-sm', active ? 'bg-foreground/60' : 'bg-foreground/20')} />
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div className="pb-3 pt-2 border-t border-sidebar-border px-1.5 flex justify-center">
                <div className="w-8 h-8 rounded-md flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-sm bg-foreground/20" />
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 min-w-0 p-2">
              <div className="flex-1 h-full bg-background rounded-lg border border-border overflow-hidden flex flex-col"
                style={{ boxShadow: '0 1px 2px rgb(0 0 0 / 0.06), 0 4px 8px -3px rgb(0 0 0 / 0.08)' }}
              >
                {/* Page toolbar */}
                <div className="h-14 border-b border-border flex items-center px-4 gap-3 shrink-0">
                  <div className="flex flex-col gap-1">
                    <div className="h-2 w-20 rounded bg-foreground/60" />
                    <div className="h-1.5 w-32 rounded bg-foreground/20" />
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-7 w-16 rounded-md bg-muted border border-border" />
                    <div className="h-7 w-20 rounded-md bg-foreground/70" />
                  </div>
                </div>
                {/* Page body */}
                <div className="flex-1 p-5 grid grid-cols-3 gap-3 content-start">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 rounded-lg border border-border bg-background" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Outer shell: <code className="bg-muted px-1 rounded">bg-sidebar</code> + 8px padding around white card.
          White card: floating shadow, rounded-lg, border.
        </p>
      </Section>

      {/* ── App shell — expanded sidebar ── */}
      <Section title="App shell — expanded sidebar">
        <div
          className="w-full rounded-lg border border-border overflow-hidden bg-sidebar"
          style={{ height: 300, boxShadow: '0 1px 2px rgb(0 0 0 / 0.08), 0 6px 14px -4px rgb(0 0 0 / 0.14)' }}
        >
          <div className="flex h-full">
            {/* Expanded left sidebar */}
            <div className="w-44 shrink-0 flex flex-col border-r border-sidebar-border bg-sidebar">
              <div className="h-14 flex items-center px-3 gap-2 border-b border-sidebar-border shrink-0">
                <div className="flex-1 h-4 w-20 rounded bg-foreground/30" />
                <div className="w-5 h-5 rounded bg-foreground/10" />
              </div>
              {/* Search */}
              <div className="px-2 pt-3 pb-2">
                <div className="h-8 rounded-md bg-background border border-border flex items-center px-2 gap-2">
                  <div className="w-3 h-3 rounded-sm bg-foreground/20" />
                  <div className="flex-1 h-2 rounded bg-foreground/10" />
                </div>
              </div>
              {/* Nav */}
              <div className="flex-1 px-2 flex flex-col gap-0.5">
                {[true, false, false, false, false].map((active, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-2.5 h-8 px-2 rounded-md',
                      active ? 'bg-white shadow-sm' : ''
                    )}
                  >
                    <div className={cn('w-3.5 h-3.5 rounded-sm shrink-0', active ? 'bg-foreground/50' : 'bg-foreground/20')} />
                    <div className={cn('h-2 rounded flex-1', active ? 'bg-foreground/40' : 'bg-foreground/15')} />
                  </div>
                ))}
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0 p-2">
              <div className="h-full bg-background rounded-lg border border-border overflow-hidden flex flex-col"
                style={{ boxShadow: '0 1px 2px rgb(0 0 0 / 0.06), 0 4px 8px -3px rgb(0 0 0 / 0.08)' }}
              >
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0">
                  <div className="h-2 w-24 rounded bg-foreground/50" />
                  <div className="ml-auto flex gap-2">
                    <div className="h-7 w-16 rounded-md bg-muted border border-border" />
                    <div className="h-7 w-20 rounded-md bg-foreground/70" />
                  </div>
                </div>
                <div className="flex-1 p-4 grid grid-cols-3 gap-3 content-start">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 rounded-lg border border-border" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Expanded: resizable 160–320px, default 224px. Collapse with ⌘D. Logo in header, search bar below.
        </p>
      </Section>

      {/* ── App shell — left + right panels ── */}
      <Section title="App shell — left + right panels (DashboardBuilder)">
        <div
          className="w-full rounded-lg border border-border overflow-hidden bg-sidebar"
          style={{ height: 300, boxShadow: '0 1px 2px rgb(0 0 0 / 0.08), 0 6px 14px -4px rgb(0 0 0 / 0.14)' }}
        >
          <div className="flex h-full">
            {/* Icon nav */}
            <div className="w-14 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
              <div className="h-14 border-b border-sidebar-border flex items-center justify-center shrink-0">
                <div className="w-5 h-5 rounded bg-foreground/10" />
              </div>
              <div className="flex-1 px-1.5 pt-3 flex flex-col gap-0.5">
                {[false, false, false, true, false].map((active, i) => (
                  <div key={i} className={cn('w-8 h-8 rounded-md mx-auto flex items-center justify-center', active ? 'bg-white shadow-sm' : '')}>
                    <div className={cn('w-3.5 h-3.5 rounded-sm', active ? 'bg-foreground/60' : 'bg-foreground/20')} />
                  </div>
                ))}
              </div>
            </div>
            {/* Left questions panel */}
            <div className="w-36 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
              <div className="h-14 border-b border-sidebar-border flex items-center px-3 shrink-0">
                <div className="h-2 w-20 rounded bg-foreground/40" />
              </div>
              <div className="flex-1 p-2 flex flex-col gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 rounded border border-border bg-background px-2 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-foreground/20 shrink-0" />
                    <div className="flex-1 h-1.5 rounded bg-foreground/15" />
                  </div>
                ))}
              </div>
            </div>
            {/* Canvas */}
            <div className="flex-1 min-w-0 p-2">
              <div className="h-full bg-background rounded-lg border border-border overflow-hidden flex flex-col"
                style={{ boxShadow: '0 1px 2px rgb(0 0 0 / 0.06), 0 4px 8px -3px rgb(0 0 0 / 0.08)' }}
              >
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0">
                  <div className="h-2 w-28 rounded bg-foreground/50" />
                  <div className="ml-auto flex gap-2">
                    <div className="h-7 w-14 rounded-md bg-muted border border-border" />
                    <div className="h-7 w-20 rounded-md bg-foreground/70" />
                  </div>
                </div>
                <div className="flex-1 p-4 grid grid-cols-2 gap-3 content-start">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 rounded-lg border border-border" />
                  ))}
                </div>
              </div>
            </div>
            {/* Right properties panel */}
            <div className="w-32 shrink-0 border-l border-sidebar-border bg-sidebar flex flex-col">
              <div className="h-14 border-b border-sidebar-border flex items-center justify-between px-3 shrink-0">
                <div className="h-2 w-14 rounded bg-foreground/40" />
                <div className="w-4 h-4 rounded bg-foreground/10" />
              </div>
              <div className="flex-1 p-3 flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-1.5 w-10 rounded bg-foreground/25" />
                    <div className="h-7 rounded-md bg-background border border-border" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Three-panel layout: icon nav + questions browser + canvas + properties panel. Used in DashboardBuilder edit mode.
        </p>
      </Section>

      {/* ── App shell — chart detail (left list + right properties) ── */}
      <Section title="App shell — chart detail (Charts page)">
        <div
          className="w-full rounded-lg border border-border overflow-hidden bg-sidebar"
          style={{ height: 300, boxShadow: '0 1px 2px rgb(0 0 0 / 0.08), 0 6px 14px -4px rgb(0 0 0 / 0.14)' }}
        >
          <div className="flex h-full">
            {/* Icon nav */}
            <div className="w-14 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
              <div className="h-14 border-b border-sidebar-border flex items-center justify-center shrink-0">
                <div className="w-5 h-5 rounded bg-foreground/10" />
              </div>
              <div className="flex-1 px-1.5 pt-3 flex flex-col gap-0.5">
                {[false, false, true, false, false].map((active, i) => (
                  <div key={i} className={cn('w-8 h-8 rounded-md mx-auto flex items-center justify-center', active ? 'bg-white shadow-sm' : '')}>
                    <div className={cn('w-3.5 h-3.5 rounded-sm', active ? 'bg-foreground/60' : 'bg-foreground/20')} />
                  </div>
                ))}
              </div>
            </div>
            {/* Chart list sidebar */}
            <div className="w-44 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
              <div className="h-14 border-b border-sidebar-border flex items-center px-3 gap-2 shrink-0">
                <div className="flex-1 h-2 w-16 rounded bg-foreground/30" />
              </div>
              <div className="flex-1 overflow-hidden p-2 flex flex-col gap-1">
                {[false, true, false, false, false, false].map((active, i) => (
                  <div key={i}
                    className={cn('h-10 rounded-md px-2 flex items-center gap-2 border', active ? 'bg-background border-primary/30' : 'border-transparent hover:bg-white/50')}
                  >
                    <div className={cn('w-3 h-3 rounded-sm shrink-0', active ? 'bg-primary/40' : 'bg-foreground/20')} />
                    <div className="flex-1 space-y-1">
                      <div className={cn('h-1.5 w-16 rounded', active ? 'bg-foreground/50' : 'bg-foreground/20')} />
                      <div className="h-1 w-10 rounded bg-foreground/10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Chart detail + toolbar */}
            <div className="flex-1 min-w-0 p-2">
              <div className="h-full bg-background rounded-lg border border-border overflow-hidden flex flex-col"
                style={{ boxShadow: '0 1px 2px rgb(0 0 0 / 0.06), 0 4px 8px -3px rgb(0 0 0 / 0.08)' }}
              >
                <div className="h-14 border-b border-border flex items-center px-4 gap-3 shrink-0">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="h-1.5 w-14 rounded bg-foreground/20" />
                    <div className="h-2 w-28 rounded bg-foreground/50" />
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-7 w-14 rounded-md bg-muted border border-border" />
                    <div className="h-7 w-14 rounded-md bg-muted border border-border" />
                    <div className="h-7 w-24 rounded-md bg-foreground/70" />
                  </div>
                </div>
                <div className="flex-1 p-4 flex items-center justify-center">
                  <div className="w-full h-full rounded border border-border/50 bg-muted/20" />
                </div>
              </div>
            </div>
            {/* Right properties panel */}
            <div className="w-36 shrink-0 border-l border-sidebar-border bg-sidebar flex flex-col">
              <div className="h-14 border-b border-sidebar-border flex items-center px-3 shrink-0">
                <div className="h-1.5 w-12 rounded bg-muted-foreground/40 uppercase" />
              </div>
              <div className="flex-1 p-3 flex flex-col gap-3">
                {/* Chart type grid */}
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={cn('h-8 rounded border flex items-center justify-center', i === 1 ? 'border-primary/40 bg-primary/5' : 'border-border bg-background')}>
                      <div className={cn('w-3 h-3 rounded-sm', i === 1 ? 'bg-primary/40' : 'bg-foreground/15')} />
                    </div>
                  ))}
                </div>
                {/* Form fields */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-1.5 w-10 rounded bg-foreground/25" />
                    <div className="h-7 rounded-md bg-background border border-border" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Chart list left panel (injected via <code className="bg-muted px-1 rounded">setLeftPanel</code>) + detail toolbar + properties right sidebar.
        </p>
      </Section>

      {/* ── Toolbar ── */}
      <Section title="Toolbar">
        {/* Standard */}
        <div className="w-full space-y-3">
          <p className="text-xs text-muted-foreground">Standard — title + actions</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <Toolbar>
              <span className="text-sm font-semibold text-foreground">Dashboards</span>
              <ToolbarActions>
                <Button variant="secondary" size="toolbar">
                  <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
                  Share
                </Button>
                <Button size="toolbar">
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                  New
                </Button>
              </ToolbarActions>
            </Toolbar>
          </div>

          <p className="text-xs text-muted-foreground">Breadcrumb + title + multi-action</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <Toolbar>
              <div className="flex flex-col min-w-0">
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Brand tracking</p>
                <h1 className="text-sm font-semibold text-foreground truncate">Insurance brand awareness — 18–34</h1>
              </div>
              <ToolbarActions>
                <Button variant="secondary" size="toolbar">
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  Delete
                </Button>
                <Button variant="secondary" size="toolbar">
                  <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
                  Share
                </Button>
                <Button variant="secondary" size="toolbar">
                  <BookmarkPlus className="h-3.5 w-3.5" strokeWidth={2} />
                  Save
                </Button>
                <Button size="toolbar">
                  <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={2} />
                  Add to dashboard
                </Button>
              </ToolbarActions>
            </Toolbar>
          </div>

        </div>
      </Section>

      {/* ── Left sidebar ── */}
      <Section title="Left sidebar (WorkspaceSidebar)">
        <div className="flex gap-6 items-start">
          {/* Expanded */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Expanded</p>
            <div className="w-44 h-80 rounded-lg border border-sidebar-border bg-sidebar overflow-hidden flex flex-col shadow-sm">
              <div className="h-14 flex items-center px-3 gap-2 border-b border-sidebar-border shrink-0">
                <div className="flex-1 h-4 w-20 rounded bg-foreground/30" />
                <div className="w-5 h-5 rounded-md bg-foreground/10 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-foreground/25" />
                </div>
              </div>
              <div className="px-2 pt-3 pb-2 shrink-0">
                <div className="h-8 rounded-md bg-background border border-border flex items-center px-2 gap-2">
                  <div className="w-3 h-3 rounded-sm bg-foreground/20 shrink-0" />
                  <div className="flex-1 h-1.5 rounded bg-foreground/10" />
                  <div className="w-5 h-4 rounded bg-muted/60 border border-border text-[8px] flex items-center justify-center text-muted-foreground font-mono">⌘S</div>
                </div>
              </div>
              <div className="flex-1 px-2 flex flex-col gap-0.5">
                {['Chat', 'Audience', 'Charts', 'Dashboards', 'Analysis'].map((label, i) => (
                  <div
                    key={label}
                    className={cn(
                      'flex items-center gap-2.5 h-8 px-2 rounded-md',
                      i === 0 ? 'bg-background shadow-sm' : ''
                    )}
                  >
                    <div className={cn('w-3.5 h-3.5 rounded-sm shrink-0', i === 0 ? 'bg-foreground/50' : 'bg-foreground/20')} />
                    <span className={cn('text-xs', i === 0 ? 'font-medium text-foreground' : 'text-sidebar-foreground')}>{label}</span>
                  </div>
                ))}
              </div>
              <div className="pb-3 pt-2 border-t border-sidebar-border px-2 space-y-0.5">
                <ThemeToggle />
                <div className="flex items-center gap-2.5 h-8 px-2 rounded-md text-sidebar-foreground">
                  <div className="w-3.5 h-3.5 rounded-sm bg-foreground/20 shrink-0" />
                  <span className="text-xs text-sidebar-foreground">Logout</span>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsed */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Collapsed</p>
            <div className="w-14 h-80 rounded-lg border border-sidebar-border bg-sidebar overflow-hidden flex flex-col shadow-sm">
              <div className="h-14 flex items-center justify-center border-b border-sidebar-border shrink-0">
                <div className="w-5 h-5 rounded-md bg-foreground/10 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-foreground/25" />
                </div>
              </div>
              <div className="flex-1 px-1.5 pt-3 flex flex-col gap-0.5 items-center">
                {[true, false, false, false, false].map((active, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-8 h-8 rounded-md flex items-center justify-center',
                      active ? 'bg-white shadow-sm' : ''
                    )}
                  >
                    <div className={cn('w-3.5 h-3.5 rounded-sm', active ? 'bg-foreground/50' : 'bg-foreground/20')} />
                  </div>
                ))}
              </div>
              <div className="pb-3 pt-2 border-t border-sidebar-border px-1.5 flex flex-col items-center gap-0.5">
                <ThemeToggle collapsed />
                <div className="w-8 h-8 rounded-md flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-sm bg-foreground/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Resize note */}
          <div className="pt-8 text-xs text-muted-foreground space-y-1 max-w-[160px]">
            <p>Resizable: 160–320px</p>
            <p>Default: 224px</p>
            <p>Collapsed: 52px</p>
            <p>Toggle: ⌘D</p>
            <p>Resize handle: right edge drag</p>
          </div>
        </div>
      </Section>

      {/* ── Right sidebar ── */}
      <Section title="Right sidebar / inspector panel">
        <div className="flex gap-6 items-start">
          {/* Expanded */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Expanded (RightSidebar)</p>
            <div className="w-56 h-72 rounded-lg border border-sidebar-border bg-sidebar overflow-hidden flex flex-col shadow-sm">
              <div className="h-14 flex items-center px-3 border-b border-sidebar-border shrink-0">
                <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                  <IconLayoutSidebarRightCollapse size={14} strokeWidth={2} />
                </button>
              </div>
              <div className="flex-1 p-3 flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-1.5 w-12 rounded bg-foreground/25" />
                    <div className="h-8 rounded-md bg-background border border-border" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsed */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Collapsed</p>
            <div className="w-14 h-72 rounded-lg border border-sidebar-border bg-sidebar overflow-hidden flex flex-col shadow-sm">
              <div className="h-14 flex items-center justify-center border-b border-sidebar-border shrink-0">
                <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                  <IconLayoutSidebarRightExpand size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* WidgetPropertiesPanel variant */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Properties panel (Dashboard)</p>
            <div className="w-56 h-72 rounded-lg border border-sidebar-border bg-sidebar overflow-hidden flex flex-col shadow-sm">
              <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
                <span className="text-xs font-semibold text-muted-foreground">Properties</span>
                <button className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  <Plus className="h-3.5 w-3.5 rotate-45" strokeWidth={2} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {['Rows', 'Columns', 'Filters'].map((label) => (
                  <div key={label} className="space-y-2 pb-4 border-b border-sidebar-border last:border-0">
                    <p className="text-xs font-medium text-foreground">{label}</p>
                    <div className="h-6 rounded-md border border-dashed border-border flex items-center px-2">
                      <span className="text-[10px] text-muted-foreground/50 italic">Drop here</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 text-xs text-muted-foreground space-y-1 max-w-[140px]">
            <p>Resizable: 200–480px</p>
            <p>Default: 280px</p>
            <p>Collapsed: 52px</p>
            <p>Resize handle: left edge drag</p>
          </div>
        </div>
      </Section>

      {/* ── PageHeader ── */}
      <Section title="PageHeader component">
        <div className="w-full space-y-3">
          <p className="text-xs text-muted-foreground">Title only</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <Toolbar>
              <span className="text-sm font-semibold text-foreground">Analyses</span>
            </Toolbar>
          </div>

          <p className="text-xs text-muted-foreground">Title + subtitle text node</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <Toolbar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground leading-tight">My Dashboards</span>
                <span className="text-xs text-muted-foreground">3 dashboards</span>
              </div>
              <ToolbarActions>
                <Button size="toolbar">
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                  New dashboard
                </Button>
              </ToolbarActions>
            </Toolbar>
          </div>
        </div>
      </Section>

      {/* ── Dividers ── */}
      <Section title="Dividers">
        <div className="flex gap-12 items-start">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Standard — <code className="bg-muted px-1 rounded">border-border</code></p>
              <div className="w-48 border-t border-border" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Subtle — <code className="bg-muted px-1 rounded">border-border/50</code></p>
              <div className="w-48 border-t border-border/50" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Sidebar — <code className="bg-muted px-1 rounded">border-sidebar-border</code></p>
              <div className="w-48 border-t border-sidebar-border" />
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">List rows — <code className="bg-muted px-1 rounded">divide-border</code></p>
            <div className="flex flex-col divide-y divide-border border border-border rounded-md w-48">
              {['Brand tracking', 'Purchase intent', 'Ad recall', 'NPS trend'].map(label => (
                <div key={label} className="py-2 px-3 text-xs text-foreground">{label}</div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Section group in sidebar</p>
            <div className="w-48 bg-sidebar border border-sidebar-border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-sidebar-border">
                <p className="text-xs font-medium text-foreground">General</p>
                <p className="text-xs text-muted-foreground mt-2 mb-1">Title</p>
                <div className="h-7 rounded-md bg-background border border-border" />
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-medium text-foreground">Filters</p>
                <div className="mt-2 space-y-1.5">
                  <div className="h-7 rounded-md bg-background border border-border" />
                  <div className="h-7 rounded-md bg-background border border-border" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

// ── Shared chart widget helpers ───────────────────────────────────────────────

const CW_VIZ_TYPES: { type: Widget['type']; label: string }[] = [
  { type: 'bar',   label: 'Bar'   },
  { type: 'line',  label: 'Line'  },
  { type: 'table', label: 'Table' },
]

function CwVizSwitcher({ value, onChange }: { value: Widget['type']; onChange: (t: Widget['type']) => void }) {
  return (
    <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
      {CW_VIZ_TYPES.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={cn(
            'h-6 px-2 rounded text-xs font-medium transition-colors',
            value === type
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// ── AI Chat data widget card ───────────────────────────────────────────────────

function AiChatWidgetDemo() {
  const [vizType, setVizType] = useState<Widget['type']>('bar')
  const [saved, setSaved] = useState(false)

  const metric = 'brand_awareness'
  const widget: Widget = {
    id: 'pg-ai-demo',
    type: vizType,
    title: 'Insurance brand awareness — 18–34',
    audienceId: '',
    metric,
    createdAt: '2025-01-01T00:00:00Z',
  }
  const data = generateChartData(vizType, false, undefined, `pg-ai:${vizType}`, metric, undefined, 'Insurance')

  return (
    <div className="w-[400px] rounded-2xl rounded-bl-sm border border-border bg-background shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight">Insurance brand awareness — 18–34</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Statista Consumer Insights · Global 2025</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <CwVizSwitcher value={vizType} onChange={setVizType} />
            <button
              title="Export PNG"
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconDownload size={12} strokeWidth={2} />
            </button>
            <button
              title="Copy image"
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconPlus size={12} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-3 pt-3 pb-1" style={{ height: 160 }}>
        <ChartRenderer widget={widget} data={data} height={160} />
      </div>

      {/* Source */}
      <div className="px-4 pb-3">
        <span className="text-xs text-muted-foreground">Source: Statista Consumer Insights</span>
      </div>

      {/* CTAs */}
      <div className="px-4 py-3 border-t border-border space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSaved(s => !s)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium border transition-colors',
              saved
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-border bg-background text-foreground hover:bg-accent'
            )}
          >
            <IconCheck size={11} strokeWidth={2} />
            {saved ? 'Added to Dashboard' : 'Add to Dashboard'}
          </button>
          <button className="flex items-center justify-center gap-1 h-8 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-accent transition-colors">
            Refine
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Charts page inline view ────────────────────────────────────────────────────

const CHART_TYPE_OPTIONS: { type: Widget['type']; label: string }[] = [
  { type: 'bar',       label: 'Bar'       },
  { type: 'line',      label: 'Line'      },
  { type: 'pie',       label: 'Pie'       },
  { type: 'table',     label: 'Table'     },
  { type: 'scorecard', label: 'Scorecard' },
]

const METRIC_OPTIONS = [
  { value: 'brand_awareness', label: 'Brand awareness' },
  { value: 'purchase_intent', label: 'Purchase intent' },
  { value: 'net_promoter_score', label: 'Net Promoter Score' },
  { value: 'brand_affinity', label: 'Brand affinity' },
  { value: 'ad_recall', label: 'Ad recall' },
]

const CATEGORY_OPTIONS = [
  'Insurance', 'Health', 'Finance', 'Fashion', 'Travel',
  'AI & smart technology', 'Consumer electronics', 'Online shopping',
]

const BREAKDOWN_OPTIONS = [
  { value: '',            label: 'None' },
  { value: 'age_group',   label: 'Age group' },
  { value: 'gender',      label: 'Gender' },
  { value: 'country',     label: 'Country' },
  { value: 'device_type', label: 'Device' },
]

function ChartsPageWidgetDemo() {
  const [chartType, setChartType] = useState<Widget['type']>('bar')
  const [metric, setMetric]       = useState('brand_awareness')
  const [category, setCategory]   = useState('Insurance')
  const [breakdown, setBreakdown] = useState('age_group')
  const [heatmap, setHeatmap]     = useState(false)
  const [benchmark, setBenchmark] = useState(true)

  const widget: Widget = {
    id: 'pg-charts-demo',
    type: chartType,
    title: `${METRIC_OPTIONS.find(m => m.value === metric)?.label} — ${category}`,
    audienceId: '',
    benchmarkAudienceId: benchmark ? 'bench' : undefined,
    metric,
    breakdown: breakdown || undefined,
    createdAt: '2025-01-01T00:00:00Z',
  }

  const data = generateChartData(
    chartType, benchmark,
    undefined, `pg-charts:${chartType}:${metric}:${category}:${breakdown}`,
    metric, breakdown || undefined, category
  )

  const isTable = chartType === 'table'

  return (
    <div className="border border-border rounded-lg overflow-hidden flex w-full" style={{ height: 480 }}>

      {/* Chart area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-border shrink-0 gap-4">
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{category}</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {METRIC_OPTIONS.find(m => m.value === metric)?.label}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm">
              <IconShare size={13} strokeWidth={2} />
              Share
            </Button>
            <Button size="sm">
              <IconDownload size={13} strokeWidth={2} />
              Save
            </Button>
          </div>
        </div>

        {/* Chart */}
        <div className={cn('flex-1 min-h-0', isTable ? 'overflow-auto' : 'p-5')}>
          <ChartRenderer
            widget={widget}
            data={data}
            height={isTable ? undefined : 360}
            heatmap={isTable ? heatmap : undefined}
          />
        </div>
      </div>

      {/* Properties panel */}
      <div className="w-56 shrink-0 border-l border-border flex flex-col bg-sidebar overflow-y-auto">
        <div className="px-3 py-2.5 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground">Properties</p>
        </div>

        <div className="p-3 space-y-4">

          {/* Chart type */}
          <div>
            <p className="text-xs font-medium text-foreground mb-1.5">Chart type</p>
            <div className="grid grid-cols-3 gap-1">
              {CHART_TYPE_OPTIONS.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={cn(
                    'py-1.5 rounded border text-xs font-medium transition-colors',
                    chartType === type
                      ? 'border-primary bg-primary/8 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric */}
          <div>
            <p className="text-xs font-medium text-foreground mb-1.5">Metric</p>
            <select
              value={metric}
              onChange={e => setMetric(e.target.value)}
              className="w-full h-7 text-xs px-2 rounded-md border border-border bg-background text-foreground appearance-none cursor-pointer"
            >
              {METRIC_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <p className="text-xs font-medium text-foreground mb-1.5">Category</p>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full h-7 text-xs px-2 rounded-md border border-border bg-background text-foreground appearance-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Breakdown */}
          <div>
            <p className="text-xs font-medium text-foreground mb-1.5">Breakdown</p>
            <select
              value={breakdown}
              onChange={e => setBreakdown(e.target.value)}
              className="w-full h-7 text-xs px-2 rounded-md border border-border bg-background text-foreground appearance-none cursor-pointer"
            >
              {BREAKDOWN_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={benchmark}
                onChange={e => setBenchmark(e.target.checked)}
                className="h-3.5 w-3.5 accent-primary cursor-pointer"
              />
              <span className="text-xs text-foreground">Show benchmark</span>
            </label>
            {isTable && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={heatmap}
                  onChange={e => setHeatmap(e.target.checked)}
                  className="h-3.5 w-3.5 accent-primary cursor-pointer"
                />
                <span className="text-xs text-foreground">Heatmap</span>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard widget card ─────────────────────────────────────────────────────

const DASH_CHART_TYPES: { type: Widget['type']; label: string }[] = [
  { type: 'table',     label: 'Table'     },
  { type: 'bar',       label: 'Bar'       },
  { type: 'line',      label: 'Line'      },
  { type: 'pie',       label: 'Pie'       },
  { type: 'scorecard', label: 'Scorecard' },
]

const DASH_SUMMARIES = [
  'The 25–34 age group shows the strongest brand awareness at 74%, well above the 55% market average. Awareness drops sharply for consumers aged 45+.',
  'Mobile leads with 72% recall — significantly above the 54% all-demographics benchmark. Desktop shows a smaller gap (58% vs 51%).',
  'Insurance awareness peaks in the DACH region at 81%. Trust-based statements score highest among 35–44s, aligned with life-stage financial responsibility.',
]

function DashboardWidgetDemo() {
  const [chartType, setChartType] = useState<Widget['type']>('bar')
  const [summary, setSummary]     = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const metric = 'brand_awareness'
  const widget: Widget = {
    id: 'pg-dash-demo',
    type: chartType,
    title: 'Brand Awareness by Age Group',
    audienceId: '',
    metric,
    breakdown: 'age_group',
    createdAt: '2025-01-01T00:00:00Z',
  }
  const data = generateChartData(chartType, false, undefined, `pg-dash:${chartType}`, metric, 'age_group', 'Insurance')

  function handleGenerateSummary() {
    setGenerating(true)
    setTimeout(() => {
      setSummary(DASH_SUMMARIES[Math.floor(Math.random() * DASH_SUMMARIES.length)])
      setGenerating(false)
    }, 1400)
  }

  return (
    <div
      className="bg-background rounded-xl flex flex-col overflow-hidden w-[480px]"
      style={{ boxShadow: 'var(--field-shadow)', minHeight: 320 }}
    >
      {/* Title + actions */}
      <div className="relative flex items-center gap-2 px-4 py-3 shrink-0 border-b border-border/40">
        <span className="text-sm font-semibold truncate flex-1 min-w-0">Brand Awareness by Age Group</span>
        <div className="flex items-center gap-0.5 shrink-0">
          <button className="h-6 px-2 rounded text-xs text-secondary-foreground hover:text-foreground hover:bg-muted/50 transition-colors">Export</button>
          <button className="h-6 px-2 rounded text-xs text-secondary-foreground hover:text-foreground hover:bg-muted/50 transition-colors">Share</button>
          <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors ml-1">
            <IconTrash size={13} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* AI summary row */}
      <div className="px-4 shrink-0 border-b border-border/40">
        {summary ? (
          <div className="flex items-start gap-2 py-2.5">
            <Sparkles className="h-3 w-3 text-primary/50 shrink-0 mt-0.5" />
            <p className="text-xs text-secondary-foreground leading-relaxed flex-1">{summary}</p>
            <button onClick={() => setSummary(null)} className="shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              <IconX size={12} stroke={2} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerateSummary}
            disabled={generating}
            className="flex items-center gap-1.5 py-2 text-xs text-secondary-foreground/50 hover:text-primary transition-colors disabled:opacity-40"
          >
            {generating
              ? <><RefreshCw className="h-3 w-3 animate-spin" /><span>Generating…</span></>
              : <><Sparkles className="h-3 w-3" /><span>Add AI summary</span></>}
          </button>
        )}
      </div>

      {/* Chart type strip */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/40 shrink-0">
        {DASH_CHART_TYPES.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={cn(
              'h-7 px-3 rounded-full text-xs font-medium transition-colors border',
              type === chartType
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background text-muted-foreground border-border hover:text-foreground hover:border-foreground/30'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="px-2 pb-2 pt-1" style={{ height: 200 }}>
        <ChartRenderer widget={widget} data={data} height={200} />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

function ChartWidgetPage() {
  return (
    <>
      <PageHeader
        title="Chart Widget"
        description="Three surfaces that embed chart data — the dashboard widget card, the AI chat card, and the Charts page view."
      />

      <Section title="Dashboard widget card">
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground max-w-xl">
            The grid card used in Dashboard Builder. Has a title bar with Export/Share/Delete actions, an AI summary row (click "Add AI summary" below to see it generate), a chart type strip for switching visualization, and the chart body. All controls are live.
          </p>
          <DashboardWidgetDemo />
        </div>
      </Section>

      <Section title="AI chat card">
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground max-w-xl">
            Returned inline in the Research AI conversation thread. Compact, self-contained. Has a viz-type switcher (bar / line / table), export PNG, copy image, and an Add to Dashboard CTA. The viz switcher and saved state are interactive below.
          </p>
          <AiChatWidgetDemo />
        </div>
      </Section>

      <Section title="Charts page view">
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground max-w-xl">
            Full-width view rendered when a chart is selected in the Charts page sidebar. Includes a toolbar with Share/Save actions and a Properties panel with chart type picker, metric, category, breakdown, benchmark toggle, and heatmap toggle. All controls below are live.
          </p>
          <ChartsPageWidgetDemo />
        </div>
      </Section>
    </>
  )
}

// ─── Page map ─────────────────────────────────────────────────────────────────

const PAGES: Record<PageId, React.ReactNode> = {
  'overview':    <OverviewPage />,
  'typography':  <TypographyPage />,
  'icons':       <IconsPage />,
  'color':       <ColorPage />,
  'data-viz':    <DataVizPage />,
  'elevation':   <ElevationPage />,
  'button':      <ButtonPage />,
  'badge':       <BadgePage />,
  'form':        <FormPage />,
  'chip':        <ChipPage />,
  'card':          <CardPage />,
  'chart-widget':  <ChartWidgetPage />,
  'empty-state':   <EmptyStatePage />,
  'switcher':      <SwitcherPage />,
  'layout':      <LayoutPage />,
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [active, setActive] = useState<PageId>('overview')

  return (
    <div className="flex h-full overflow-hidden">

      {/* Left nav */}
      <nav className="w-52 shrink-0 bg-sidebar flex flex-col overflow-y-auto pt-5 pb-4">
        <p className="px-4 mb-4 text-sm font-semibold text-foreground">Design System</p>
        {NAV.map(({ group, items }, gi) => (
          <div key={group} className={cn(gi > 0 && 'mt-4')}>
            <p className="px-4 mb-1 text-xs font-medium text-muted-foreground">{group}</p>
            {items.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cn(
                  'w-full text-left px-4 py-1.5 text-sm transition-colors',
                  active === id
                    ? 'text-primary font-medium bg-primary/10'
                    : 'text-foreground hover:bg-accent'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-12 py-12">
          {PAGES[active]}
        </div>
      </main>

    </div>
  )
}
